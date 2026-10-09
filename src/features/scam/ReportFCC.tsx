import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '../../components/art/Icon'
import { PageHead } from '../../components/PageHead'

const FCC_URL = 'https://consumercomplaints.fcc.gov/hc/en-us'

/** AskOwly does not send reports itself: it copies the message and opens the FCC's own form. */
export function ReportFCC() {
  const message = (useLocation().state as { message?: string } | null)?.message ?? ''
  const [copied, setCopied] = useState<'yes' | 'no' | null>(null)

  async function copyAndOpen() {
    if (message) {
      try {
        await navigator.clipboard.writeText(message)
        setCopied('yes')
      } catch {
        setCopied('no')
      }
    }
    window.open(FCC_URL, '_blank', 'noopener')
  }

  return (
    <div className="stack narrow">
      <PageHead title="How to report it" back={{ to: '/scam', label: 'the message checker' }} owly="shield" />
      <p>
        Reporting helps the Federal Communications Commission (FCC) track and stop scammers. It is free. You fill in the form on the FCC’s own
        website. AskOwly does not send anything for you.
      </p>

      <section className="card stack-sm">
        <h2>Report on the FCC website</h2>
        <ol className="stack-sm" style={{ margin: 0 }}>
          <li>Tap the button below. {message && 'Owly will copy the message for you.'}</li>
          <li>
            On the FCC page, choose <strong>Phone</strong>, then <strong>Unwanted Calls</strong> or <strong>Text messages</strong>.
          </li>
          <li>Paste the message where it asks for a description, and add the phone number it came from.</li>
        </ol>
        <button className="btn btn-block" onClick={copyAndOpen}>
          <Icon name="share" /> {message ? 'Copy the message and open the FCC website' : 'Open the FCC website'}
        </button>
        <div role="status">
          {copied === 'yes' && (
            <p className="status">
              <Icon name="check" /> Copied. Press and hold in the description box and choose “Paste”.
            </p>
          )}
          {copied === 'no' && (
            <p className="status status-error">
              <Icon name="warning" /> Owly could not copy the message. You can copy it yourself from your messages.
            </p>
          )}
        </div>
      </section>

      <section className="card stack-sm">
        <h2>Got it as a text?</h2>
        <p>
          You can also forward the text to <strong>7726</strong> (it spells SPAM). Your phone company uses it to block the sender. Then delete it.
        </p>
      </section>
    </div>
  )
}
