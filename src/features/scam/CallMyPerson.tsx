import { Link } from 'react-router-dom'
import { Icon } from '../../components/art/Icon'
import { useStore } from '../../store'

/** A second opinion from a trusted family member or friend, using the phone's own text and call apps. */
export function CallMyPerson({ message }: { message: string }) {
  const [{ person }] = useStore()

  if (!person.phone) {
    return (
      <div className="note">
        <Icon name="phone" />
        <div className="stack-sm">
          <p>Want a second opinion from someone you trust? Add your person once in Settings, and they will be one tap away.</p>
          <Link to="/settings" className="btn btn-secondary">
            <Icon name="plus" /> Add my person
          </Link>
        </div>
      </div>
    )
  }

  const who = person.name || 'my person'
  const body = `Hi ${person.name || ''}, I got this message. Does it look real to you?\n\n"${message.slice(0, 600)}"`
  return (
    <div className="stack-sm">
      <div className="row">
        <a className="btn btn-secondary" href={`sms:${person.phone}?&body=${encodeURIComponent(body)}`}>
          <Icon name="chat" /> Text it to {who}
        </a>
        <a className="btn btn-secondary" href={`tel:${person.phone}`}>
          <Icon name="phone" /> Call {who}
        </a>
      </div>
      <p>These open your phone’s messages or phone app. On a computer they may not work.</p>
    </div>
  )
}
