import { Icon } from '../../components/art/Icon'
import { PRICES_AS_OF, pricesFor } from '../../data/pharmacyPrices'

/**
 * Sample prices from a small saved list: not live and not from your insurance.
 * Shown only for medicines in that list, and clearly labeled as a sample.
 */
export function PriceCompare({ medName }: { medName: string }) {
  const rows = pricesFor(medName)
  if (!rows) return null
  const cheapest = rows[0]
  const cashWins = rows.filter((r) => r.cash < r.copay)

  return (
    <section className="card stack-sm" aria-labelledby="prices">
      <h2 id="prices">Sample prices (30-day supply)</h2>
      <div className="note">
        <Icon name="info" />
        <p>
          These are sample prices saved in AskOwly in {PRICES_AS_OF}, not live prices and not from your insurance. Call the pharmacy to check
          today’s price.
        </p>
      </div>
      <p>
        Lowest in this sample: <strong>${cheapest.best}</strong> at <strong>{cheapest.pharmacy.name}</strong>
        {cheapest.cash < cheapest.copay ? ', paying cash instead of using insurance.' : ', using insurance.'}
      </p>
      <div className="table-wrap" tabIndex={0} aria-label="Sample price table">
        <table>
          <thead>
            <tr>
              <th scope="col">Pharmacy</th>
              <th scope="col">Typical copay</th>
              <th scope="col">Cash price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pharmacy.id}>
                <th scope="row">
                  {r.pharmacy.name}
                  <div style={{ fontWeight: 400 }}>{r.pharmacy.milesAway ? `${r.pharmacy.milesAway} miles` : r.pharmacy.town}</div>
                </th>
                <td className={r.copay <= r.cash ? 'best' : ''}>
                  ${r.copay}
                  {r.copay <= r.cash && <span className="visually-hidden"> (lower)</span>}
                </td>
                <td className={r.cash < r.copay ? 'best' : ''}>
                  ${r.cash}
                  {r.cash < r.copay && <span className="visually-hidden"> (lower)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cashWins.length > 0 && (
        <p>
          At {cashWins.length === 1 ? 'one pharmacy' : `${cashWins.length} pharmacies`} in this sample, paying cash costs less than a typical copay.
          You can ask your pharmacist: “What is the cash price?”
        </p>
      )}
    </section>
  )
}
