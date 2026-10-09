import { Icon } from '../../components/art/Icon'
import { findInteractions } from '../../data/interactions'

export function InteractionWarnings({ medNames }: { medNames: string[] }) {
  const found = findInteractions(medNames)
  if (found.length === 0) return null
  return (
    <section className="stack-sm" aria-label="Medicine warnings">
      {found.map((i) => (
        <div key={`${i.a}-${i.b}`} className={`callout ${i.level === 'serious' ? 'callout-danger' : 'callout-warn'}`}>
          <h3 className="callout-head">
            <Icon name={i.level === 'serious' ? 'danger' : 'warning'} />
            <span>
              <span className="visually-hidden">{i.level === 'serious' ? 'Serious warning: ' : 'Caution: '}</span>
              {i.a} and {i.b}
            </span>
          </h3>
          <p>{i.what}</p>
          <p>
            <strong>Talk to your pharmacist or doctor</strong> before your next dose. Your doctor may have a reason to prescribe both. Do not
            stop on your own.
          </p>
        </div>
      ))}
    </section>
  )
}
