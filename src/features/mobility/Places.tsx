import { PageHead } from '../../components/PageHead'
import { PLACES } from '../../data/places'

export function Places() {
  return (
    <div className="stack narrow">
      <PageHead title="Good places to walk" back={{ to: '/move', label: 'Exercise' }} owly="stretch" />
      <p>Flat, safe spots with places to sit and rest. This is a sample list for now; check opening times before you go.</p>
      <ul className="list">
        {PLACES.map((p) => (
          <li key={p.name} className="card stack-sm">
            <h2>{p.name}</h2>
            <p>{p.what}</p>
            <p>
              <strong>When:</strong> {p.when}
            </p>
            <ul className="list" aria-label="Features" style={{ display: 'flex', flexWrap: 'wrap' }}>
              {p.tags.map((t) => (
                <li key={t} className="tag" style={{ marginTop: 4 }}>
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
