import { Icon, type IconName } from '../../components/art/Icon'
import { VERDICT_TEXT, type ScamResult, type Verdict } from '../../scam/engine'

const LOOK: Record<Verdict, { box: string; icon: IconName; symbol: string }> = {
  scam: { box: 'callout-danger', icon: 'danger', symbol: 'Warning' },
  careful: { box: 'callout-warn', icon: 'warning', symbol: 'Caution' },
  safe: { box: 'callout-info', icon: 'search', symbol: 'Checked' },
}

/** How sure Owly is, in plain words. No checker can promise a message is safe. */
const HOW_SURE: Record<Verdict, string> = {
  scam: 'Owly found strong warning signs. Treat this message as a scam.',
  careful: 'Owly found some warning signs. It may or may not be a scam, so be careful.',
  safe: 'Owly did not find the usual warning signs. No checker can promise a message is safe.',
}

/**
 * Three separate parts: the assessment, the specific warning signs (so the
 * person learns them), and what to do next.
 */
export function VerdictCard({ result, compact = false }: { result: ScamResult; compact?: boolean }) {
  const v = VERDICT_TEXT[result.verdict]
  const look = LOOK[result.verdict]
  const tells = compact ? result.tells.slice(0, 3) : result.tells
  const H = compact ? 'h3' : 'h2'

  return (
    <div className="stack-sm" style={{ marginTop: compact ? 12 : 0 }}>
      <section className={`callout ${look.box}`} aria-label="Assessment">
        <div className="verdict">
          <Icon name={look.icon} />
          <div>
            <span className="visually-hidden">{look.symbol}: </span>
            <H style={{ margin: 0 }}>{v.title}</H>
          </div>
        </div>
        <p style={{ marginTop: 12 }}>{HOW_SURE[result.verdict]}</p>
      </section>

      {tells.length > 0 && (
        <section className="card card-plain stack-sm" aria-label="Warning signs">
          <H style={{ margin: 0 }}>{tells.length === 1 ? 'The warning sign' : `${tells.length} warning signs`}</H>
          <ul className="list">
            {tells.map((t, i) => (
              <li key={`${t.id}-${i}`} className={`tell ${result.verdict === 'scam' ? 'tell-danger' : ''}`}>
                <strong>{t.title}</strong>
                <div>
                  It says: <q>{t.quote}</q>
                </div>
                <div>{t.why}</div>
              </li>
            ))}
          </ul>
          {compact && result.tells.length > 3 && <p>The message checker shows {result.tells.length - 3} more.</p>}
        </section>
      )}

      <section className="card stack-sm" aria-label="What to do next">
        <H style={{ margin: 0 }}>What to do next</H>
        <p>{v.advice}</p>
      </section>
    </div>
  )
}
