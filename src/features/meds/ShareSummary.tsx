import { useState } from 'react'
import { Icon } from '../../components/art/Icon'
import { PageHead } from '../../components/PageHead'
import { findMed } from '../../data/meds'
import { medGroup, medStyle } from '../../data/medGroups'
import { findInteractions } from '../../data/interactions'
import { friendlyTime } from '../../lib/dates'
import { useStore } from '../../store'

/** A clean one-page list to print for a doctor, or send with the device's own share or copy. */
export function ShareSummary() {
  const [state] = useStore()
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard

  const lines = state.meds.map((m) => {
    const info = findMed(m.name)
    return `• ${m.name} (${medGroup(m.name).label}): ${m.times.map(friendlyTime).join(', ')}${info ? `. For: ${info.purpose}` : ''}`
  })
  const warnings = findInteractions(state.meds.map((m) => m.name))
  const text = [
    'My medicines (from AskOwly)',
    `Updated ${new Date().toLocaleDateString()}`,
    '',
    ...lines,
    ...(warnings.length ? ['', 'Things to ask about:', ...warnings.map((w) => `• ${w.a} + ${w.b}: ${w.what}`)] : []),
  ].join('\n')

  async function send() {
    try {
      if (canShare) {
        await navigator.share({ title: 'My medicines', text })
        setStatus({ ok: true, text: 'Sent.' })
      } else {
        await navigator.clipboard.writeText(text)
        setStatus({ ok: true, text: 'Copied. You can paste it into a text message or email.' })
      }
    } catch (e) {
      // Closing the share sheet is not an error worth showing.
      if (e instanceof DOMException && e.name === 'AbortError') return
      setStatus({ ok: false, text: 'That did not work. You can print the list instead.' })
    }
  }

  return (
    <div className="stack narrow">
      <PageHead title="My medicine list" back={{ to: '/meds', label: 'my medicines' }} owly="book" />
      <p className="no-print">Show this to your doctor or pharmacist, or send it to family.</p>

      <section className="card stack-sm">
        {state.meds.length === 0 ? (
          <p>You have not added any medicines yet.</p>
        ) : (
          <div className="table-wrap" tabIndex={0} aria-label="Medicine list">
            <table>
              <thead>
                <tr>
                  <th scope="col">Medicine</th>
                  <th scope="col">When</th>
                  <th scope="col">What it is for</th>
                </tr>
              </thead>
              <tbody>
                {state.meds.map((m) => (
                  <tr key={m.id}>
                    <th scope="row" style={medStyle(m.name)}>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        <span className="med-dot" aria-hidden="true" />
                        {m.name}
                      </span>
                      <div style={{ fontWeight: 400 }}>{medGroup(m.name).label}</div>
                    </th>
                    <td>{m.times.map(friendlyTime).join(', ')}</td>
                    <td>{findMed(m.name)?.purpose ?? 'Ask your pharmacist'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {warnings.length > 0 && (
          <>
            <h2>Things to ask about</h2>
            <ul>
              {warnings.map((w) => (
                <li key={w.a + w.b}>
                  {w.a} + {w.b}: {w.what}
                </li>
              ))}
            </ul>
          </>
        )}
        <p>Updated {new Date().toLocaleDateString()}</p>
      </section>

      <div className="row no-print">
        <button className="btn" onClick={() => window.print()}>
          <Icon name="print" /> Print
        </button>
        {(canShare || canCopy) && (
          <button className="btn btn-secondary" onClick={send}>
            <Icon name="share" /> {canShare ? 'Send to family' : 'Copy the list'}
          </button>
        )}
      </div>
      {status && (
        <p className={`status ${status.ok ? '' : 'status-error'}`} role="status">
          <Icon name={status.ok ? 'check' : 'warning'} /> {status.text}
        </p>
      )}
    </div>
  )
}
