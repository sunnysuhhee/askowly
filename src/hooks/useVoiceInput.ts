import { useCallback, useRef, useState } from 'react'

// The Web Speech API is not in TypeScript's DOM types yet.
interface Recognition {
  lang: string
  interimResults: boolean
  continuous: boolean
  start(): void
  stop(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}
type RecognitionCtor = new () => Recognition

function getCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

/** Tap to talk. Calls onText with what was heard. */
export function useVoiceInput(onText: (text: string) => void) {
  const Ctor = getCtor()
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rec = useRef<Recognition | null>(null)

  const start = useCallback(() => {
    if (!Ctor) return
    setError(null)
    const r = new Ctor()
    r.lang = 'en-US'
    r.interimResults = false
    r.continuous = false
    r.onresult = (e) => {
      const text = Array.from(e.results).map((res) => res[0].transcript).join(' ')
      onText(text)
    }
    r.onerror = (e) => {
      setError(e.error === 'not-allowed' ? 'Please allow the microphone so Owly can hear you. You can also type instead.' : 'Sorry, I did not catch that. Please try again, or type instead.')
    }
    r.onend = () => setListening(false)
    rec.current = r
    setListening(true)
    r.start()
  }, [Ctor, onText])

  const stop = useCallback(() => rec.current?.stop(), [])

  return { supported: Boolean(Ctor), listening, error, start, stop }
}
