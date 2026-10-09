import { useSpeak } from '../hooks/useSpeak'
import { Icon } from './art/Icon'

/** Shown only when the browser can actually speak. */
export function ReadAloud({ text, label = 'Read aloud' }: { text: string; label?: string }) {
  const { supported, speaking, speak, stop } = useSpeak()
  if (!supported) return null
  return (
    <button type="button" className="btn btn-secondary no-print" onClick={() => (speaking ? stop() : speak(text))}>
      <Icon name={speaking ? 'stop' : 'speaker'} /> {speaking ? 'Stop reading' : label}
    </button>
  )
}
