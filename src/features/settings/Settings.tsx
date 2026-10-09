import { useState } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { Icon } from '../../components/art/Icon'
import { PageHead } from '../../components/PageHead'
import { useSpeak } from '../../hooks/useSpeak'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { useStore, type AppState } from '../../store'

const noop = () => {}

export function Settings() {
  const [state, setState] = useStore()
  const [name, setName] = useState(state.person.name)
  const [phone, setPhone] = useState(state.person.phone)
  const [saved, setSaved] = useState(false)
  const [notif, setNotif] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
  const canHear = useVoiceInput(noop).supported
  const canSpeak = useSpeak().supported

  return (
    <div className="stack narrow">
      <PageHead title="Settings" back={{ to: '/', label: 'Home' }} />

      <section className="card stack-sm" aria-labelledby="person">
        <h2 id="person">My person</h2>
        <p>Someone you trust, like a son, daughter, or friend. When you check a message, you can text or call them in one tap.</p>
        <form
          className="stack-sm"
          onSubmit={(e) => {
            e.preventDefault()
            setState((s) => ({ ...s, person: { name: name.trim(), phone: phone.trim() } }))
            setSaved(true)
          }}
        >
          <div>
            <label htmlFor="pname">Their name</label>
            <input id="pname" value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="pphone">Their phone number</label>
            <input id="pphone" type="tel" inputMode="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setSaved(false) }} />
          </div>
          <button className="btn btn-ok" type="submit">
            <Icon name="check" /> Save my person
          </button>
          <div role="status">
            {saved && (
              <p className="status">
                <Icon name="check" /> Saved.
              </p>
            )}
          </div>
        </form>
      </section>

      <section className="card stack-sm" aria-labelledby="size">
        <h2 id="size">Text size</h2>
        <ChoiceGroup<AppState['textSize']>
          label="Text size"
          selected={state.textSize}
          onChoose={(v) => setState((s) => ({ ...s, textSize: v }))}
          choices={[
            { value: 'large', label: 'Large' },
            { value: 'larger', label: <span style={{ fontSize: '1.12em' }}>Larger</span> },
            { value: 'largest', label: <span style={{ fontSize: '1.3em' }}>Largest</span> },
          ]}
        />
      </section>

      <section className="card stack-sm" aria-labelledby="voice">
        <h2 id="voice">Speaking and listening</h2>
        <p className="status">
          <Icon name={canHear ? 'check' : 'info'} />
          {canHear ? 'You can speak to Owly with the “Speak” button.' : 'Speaking to Owly is not available in this browser. You can always type.'}
        </p>
        <p className="status">
          <Icon name={canSpeak ? 'check' : 'info'} />
          {canSpeak ? 'Owly can read answers aloud with the “Read aloud” button.' : 'Reading aloud is not available in this browser.'}
        </p>
      </section>

      <section className="card stack-sm" aria-labelledby="reminders">
        <h2 id="reminders">Medicine reminders</h2>
        <p>
          Owly reminds you on screen, and out loud when your browser allows it, while AskOwly is open. Keep it open in a tab for reminders to work.
        </p>
        {notif === 'granted' && (
          <p className="status">
            <Icon name="check" /> Pop-up notifications are on.
          </p>
        )}
        {notif === 'default' && (
          <>
            <p>To also get a pop-up while you use another tab, allow notifications.</p>
            <button className="btn btn-secondary" onClick={async () => setNotif(await Notification.requestPermission())}>
              <Icon name="bell" /> Allow notifications
            </button>
          </>
        )}
        {notif === 'denied' && <p>Pop-up notifications are turned off in your browser settings.</p>}
      </section>

      <section className="card stack-sm" aria-labelledby="privacy">
        <h2 id="privacy">Your privacy</h2>
        <p>
          Everything you add stays on this device. There is no account and no password. When you chat with Owly while online, your messages are sent
          to get an answer and are not saved by AskOwly.
        </p>
      </section>
    </div>
  )
}
