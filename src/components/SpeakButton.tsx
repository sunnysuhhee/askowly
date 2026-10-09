import { useVoiceInput } from '../hooks/useVoiceInput'
import { Icon } from './art/Icon'

/**
 * A "Speak" button that types what you say into a text box beside it.
 * When the browser cannot listen, it says so plainly instead, and typing still works.
 */
export function SpeakButton({ onText, disabled = false }: { onText: (text: string) => void; disabled?: boolean }) {
  const voice = useVoiceInput(onText)
  if (!voice.supported) {
    return <p className="voice-note">Speaking is not available in this browser. You can type instead.</p>
  }
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={voice.listening ? voice.stop : voice.start} disabled={disabled}>
        <Icon name={voice.listening ? 'stop' : 'mic'} /> {voice.listening ? 'Stop listening' : 'Speak'}
      </button>
      <div role="status" aria-live="polite" style={{ flexBasis: '100%' }}>
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
    </>
  )
}
