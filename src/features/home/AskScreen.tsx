import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ask } from '../../ai/client'
import type { AskResult, ChatTurn } from '../../ai/types'
import { Icon } from '../../components/art/Icon'
import { OfflineNote } from '../../components/OfflineNote'
import { Owly } from '../../components/art/Owly'
import { Mug } from '../../components/art/Objects'
import { ReadAloud } from '../../components/ReadAloud'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { useStore } from '../../store'
import { analyzeMessage } from '../../scam/engine'
import { VerdictCard } from '../scam/VerdictCard'

const featureLabel: Record<string, string> = {
  scam: 'Open the message checker',
  meds: 'Go to my medicines',
  mobility: 'See exercises',
}
const featureColor: Record<string, string> = { scam: 'scam', meds: 'meds', mobility: 'move' }

/** Breaks a reply into short paragraphs: on blank lines, then every two sentences. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .flatMap((block) => {
      const sentences = block.trim().match(/[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g) ?? [block]
      const out: string[] = []
      for (let i = 0; i < sentences.length; i += 2) out.push(sentences.slice(i, i + 2).join('').trim())
      return out
    })
    .filter(Boolean)
}

export function AskScreen() {
  const [state] = useStore()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const lastReplyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const onHeard = useCallback((heard: string) => {
    setText((prev) => (prev ? `${prev} ${heard}` : heard))
    inputRef.current?.focus()
  }, [])
  const voice = useVoiceInput(onHeard)

  async function submit(message: string) {
    const q = message.trim()
    if (!q || busy) return
    const history: ChatTurn[] = [...turns, { role: 'user', text: q }]
    setTurns(history)
    setText('')
    setBusy(true)
    const result = await ask(history, { medNames: state.meds.map((m) => m.name) })
    setTurns([...history, { role: 'assistant', text: result.reply, result, about: q }])
    setBusy(false)
    setTimeout(() => lastReplyRef.current?.focus(), 0)
  }

  // Speech from the top-bar Speak button on other screens arrives as ?q=...
  useEffect(() => {
    const q = params.get('q')
    if (q) {
      setParams({}, { replace: true })
      void submit(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  function openFeature(r: AskResult, about: string) {
    if (r.intent === 'scam') navigate('/scam', { state: { message: about } })
    else if (r.intent === 'meds') {
      const mine = r.medName && state.meds.find((m) => m.name === r.medName)
      navigate(mine ? `/meds/${mine.id}` : r.medName ? `/meds/add?name=${encodeURIComponent(r.medName)}` : '/meds')
    } else if (r.intent === 'mobility') navigate('/move')
  }

  function startOver() {
    setTurns([])
    setText('')
    inputRef.current?.focus()
  }

  const lastAssistant = turns.map((t) => t.role).lastIndexOf('assistant')
  // While Owly waits for the online answer, show the on-device scam check at once (as the message checker does).
  const pending = busy ? turns[turns.length - 1] : undefined
  const instantScam = pending?.role === 'user' ? analyzeMessage(pending.text) : null
  const chatting = turns.length > 0

  return (
    <div className="stack">
      <div className="greeting">
        <Owly pose="listening" active={voice.listening} />
        <h1 tabIndex={-1}>Hello! What can I help you with today?</h1>
        <Mug className="decor" />
      </div>

      {chatting && (
        <section className="chat" role="log" aria-live="polite" aria-label="Your conversation with Owly">
          {turns.map((t, i) =>
            t.role === 'user' ? (
              <div key={i} className="msg msg-me">
                <div className="bubble bubble-me">
                  <span className="who">You</span>
                  {t.text}
                </div>
              </div>
            ) : (
              <div key={i} className="msg">
                <Owly pose="listening" className="avatar" />
                <div ref={i === lastAssistant ? lastReplyRef : undefined} tabIndex={-1} className="bubble bubble-them">
                  <span className="who">Owly</span>
                  {toParagraphs(t.text).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                  {t.result.scam && <VerdictCard result={t.result.scam} compact />}
                  <OfflineNote result={t.result} />
                  <div className="bubble-actions">
                    <ReadAloud text={t.text} />
                    {t.result.intent !== 'other' && (
                      <button className="btn" data-feature={featureColor[t.result.intent]} onClick={() => openFeature(t.result, t.about)}>
                        {featureLabel[t.result.intent]} <Icon name="next" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
          {busy && (
            <div className="msg">
              <Owly pose="listening" className="avatar" />
              <div className="bubble bubble-them">
                <span className="who">Owly</span>
                <p className="status">Owly is thinking…</p>
                {instantScam && instantScam.score >= 2 && <VerdictCard result={instantScam} compact />}
              </div>
            </div>
          )}
        </section>
      )}

      <form
        className="ask-box stack-sm"
        onSubmit={(e) => {
          e.preventDefault()
          void submit(text)
        }}
      >
        <label htmlFor="ask">Your question</label>
        <textarea
          id="ask"
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, like a text message. Shift+Enter adds a new line.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void submit(text)
            }
          }}
          placeholder="Type your question here…"
          aria-describedby="ask-status"
        />
        <div className="row">
          {voice.supported && (
            <button type="button" className="btn btn-secondary" onClick={voice.listening ? voice.stop : voice.start} disabled={busy}>
              <Icon name={voice.listening ? 'stop' : 'mic'} /> {voice.listening ? 'Stop listening' : 'Speak'}
            </button>
          )}
          <button className="btn" type="submit" disabled={busy || !text.trim()}>
            <Icon name="send" /> {busy ? 'Sending…' : 'Send'}
          </button>
        </div>
        <div id="ask-status" role="status" aria-live="polite">
          {voice.listening && (
            <p className="status">
              <Icon name="mic" /> Listening… speak now, then tap “Stop listening”.
            </p>
          )}
          {voice.error && (
            <p className="status status-error">
              <Icon name="warning" /> {voice.error}
            </p>
          )}
        </div>
        {!voice.supported && (
          <p className="voice-note">Speaking to Owly is not available in this browser. You can type your question instead.</p>
        )}
        {chatting && (
          <div className="row row-tight">
            <button className="btn btn-quiet" type="button" onClick={startOver} disabled={busy}>
              <Icon name="restart" /> Start a new conversation
            </button>
          </div>
        )}
      </form>

      <section className="stack-sm" aria-labelledby="shortcuts">
        <h2 id="shortcuts">Or choose one</h2>
        <div className="choices">
          <Link to="/meds" className="tile" data-feature="meds">
            <Owly pose="book" />
            My medicines
          </Link>
          <Link to="/move" className="tile" data-feature="move">
            <Owly pose="stretch" />
            Exercise
          </Link>
          <Link to="/scam" className="tile" data-feature="scam">
            <Owly pose="shield" />
            Check a message
          </Link>
        </div>
      </section>
    </div>
  )
}
