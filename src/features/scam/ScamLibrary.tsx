import { useState } from 'react'
import { Icon } from '../../components/art/Icon'
import { PageHead } from '../../components/PageHead'
import { SCAM_LIBRARY, SCAM_LIBRARY_UPDATED } from '../../data/scamLibrary'

export function ScamLibrary() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="stack narrow">
      <PageHead title="Common scams" back={{ to: '/scam', label: 'the message checker' }} owly="shield" />
      <p>Scams that are common right now (list updated {SCAM_LIBRARY_UPDATED}). Choose one to learn the signs.</p>
      <ul className="list">
        {SCAM_LIBRARY.map((s) => {
          const isOpen = open === s.id
          return (
            <li key={s.id} className="card">
              <button
                className="btn btn-secondary btn-block"
                style={{ justifyContent: 'space-between' }}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <span>{s.title}</span>
                <span>{isOpen ? 'Hide' : 'Show'}</span>
              </button>
              {isOpen && (
                <div className="stack-sm" style={{ marginTop: 18 }}>
                  <p>{s.how}</p>
                  <div className="callout callout-warn">
                    <p className="callout-head">
                      <Icon name="warning" /> <strong>Example</strong>
                    </p>
                    <p>“{s.example}”</p>
                  </div>
                  <h3>How to spot it</h3>
                  <ul>
                    {s.spotIt.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <div className="callout callout-ok">
                    <p className="callout-head">
                      <Icon name="check" /> <strong>What to do</strong>
                    </p>
                    <p>{s.doThis}</p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
