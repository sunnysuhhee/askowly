import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ask } from '../../ai/client'
import type { AskResult } from '../../ai/types'
import { analyzeMessage, VERDICT_TEXT, type ScamResult } from '../../scam/engine'
import { Icon } from '../../components/art/Icon'
import { OfflineNote } from '../../components/OfflineNote'
import { PageHead } from '../../components/PageHead'
import { ReadAloud } from '../../components/ReadAloud'
import { SpeakButton } from '../../components/SpeakButton'
import { VerdictCard } from './VerdictCard'
import { CallMyPerson } from './CallMyPerson'

export function CheckMessage() {
  const location = useLocation()
  const incoming = (location.state as { message?: string } | null)?.message ?? ''
  const [text, setText] = useState(incoming)
  const [result, setResult] = useState<ScamResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [answer, setAnswer] = useState<AskResult | null>(null)

  async function check(message: string) {
    if (!message.trim()) return
    // Show the on-device answer instantly, then add anything extra the AI found.
    setResult(analyzeMessage(message))
    setAnswer(null)
    setBusy(true)
    const r = await ask([{ role: 'user', text: `Is this message a scam?\n\n${message}` }], { medNames: [] })
    if (r.scam) setResult(r.scam)
    setAnswer(r)
    setBusy(false)
  }

  useEffect(() => {
    if (incoming) void check(incoming)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spoken = result
    ? `${VERDICT_TEXT[result.verdict].title}. ${result.tells.map((t) => `${t.title}. ${t.why}`).join(' ')} ${VERDICT_TEXT[result.verdict].advice}`
    : ''

  return (
    <div className="stack narrow">
      <PageHead title="Check a message" back={{ to: '/', label: 'Home' }} owly="shield" />
      <p>Got a text, email, or phone call that seems odd? Paste it below, or type what they said. Owly will point out any warning signs.</p>

      <form
        className="card stack-sm"
        onSubmit={(e) => {
          e.preventDefault()
          void check(text)
        }}
      >
        <label htmlFor="msg">The message you got</label>
        <p className="hint" id="msg-hint">Tip: press and hold in the message, choose “Copy”, then press and hold here and choose “Paste”.</p>
        <textarea
          id="msg"
          aria-describedby="msg-hint"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setResult(null)
            setAnswer(null)
          }}
        />
        <div className="row">
          <SpeakButton
            onText={(heard) => {
              setText((prev) => (prev ? `${prev} ${heard}` : heard))
              setResult(null)
            }}
          />
          <button className="btn" type="submit" disabled={!text.trim()}>
            <Icon name="search" /> Check this message
          </button>
        </div>
      </form>

      {result && (
        <div className="stack" aria-live="polite">
          <VerdictCard result={result} />
          {answer && <OfflineNote result={answer} />}
          {busy && (
            <p className="status" role="status">
              Owly is taking a closer look…
            </p>
          )}
          <div className="row">
            <ReadAloud text={spoken} label="Read the result aloud" />
          </div>
          <CallMyPerson message={text} />
          {result.verdict !== 'safe' && (
            <Link to="/scam/report" state={{ message: text }} className="btn btn-secondary btn-block">
              <Icon name="bell" /> How to report it
            </Link>
          )}
        </div>
      )}

      <Link to="/scam/library" className="btn btn-secondary btn-block">
        <Icon name="books" /> Learn the common scams
      </Link>
    </div>
  )
}
