import { Link } from 'react-router-dom'
import { Icon } from '../../components/art/Icon'
import { Owly } from '../../components/art/Owly'
import { Disclaimer } from '../../components/Disclaimer'
import { PageHead } from '../../components/PageHead'
import { friendlyTime, todayKey } from '../../lib/dates'
import { useStore } from '../../store'
import { medGroup, medStyle } from '../../data/medGroups'
import { InteractionWarnings } from './InteractionWarnings'

export function MedList() {
  const [state, setState] = useStore()
  const today = todayKey()

  function mark(medId: string, time: string, status: 'taken' | 'skipped') {
    setState((s) => ({
      ...s,
      doses: [...s.doses.filter((d) => !(d.medId === medId && d.date === today && d.time === time)), { medId, date: today, time, status }],
    }))
  }

  const statusOf = (medId: string, time: string) =>
    state.doses.find((d) => d.medId === medId && d.date === today && d.time === time)?.status

  return (
    <div className="stack narrow">
      <PageHead title="My medicines" back={{ to: '/', label: 'Home' }} owly="book" />

      {state.meds.length === 0 ? (
        <section className="card stack-sm" style={{ textAlign: 'center' }}>
          <Owly pose="book" className="dialog-art" />
          <h2>No medicines yet</h2>
          <p>Add your medicines once, and Owly will remind you when it is time and explain what each one is for.</p>
        </section>
      ) : (
        <>
          <InteractionWarnings medNames={state.meds.map((m) => m.name)} />

          <section className="stack-sm" aria-labelledby="today">
            <h2 id="today">Today’s reminders</h2>
            <ul className="list">
              {state.meds.map((m) => (
                <li key={m.id} className="card med-card" style={medStyle(m.name)}>
                  <div className="med-head">
                    <Icon name="pill" />
                    <h3>{m.name}</h3>
                    <span className="tag med-tag">{medGroup(m.name).label}</span>
                  </div>
                  {m.times.map((t) => {
                    const st = statusOf(m.id, t)
                    return (
                      <div key={t} className="reminder">
                        <span className="reminder-time">
                          <Icon name="clock" /> {friendlyTime(t)}
                        </span>
                        {st === 'taken' ? (
                          <span className="done">
                            <Icon name="check" /> Taken
                          </span>
                        ) : st === 'skipped' ? (
                          <span className="done">Skipped today</span>
                        ) : (
                          <button className="btn btn-ok" onClick={() => mark(m.id, t, 'taken')}>
                            <Icon name="check" /> I took it
                            <span className="visually-hidden">: {m.name} at {friendlyTime(t)}</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </li>
              ))}
            </ul>
          </section>

          <section className="stack-sm" aria-labelledby="about">
            <h2 id="about">About my medicines</h2>
            <p>What each one is for and what to watch for.</p>
            <ul className="list">
              {state.meds.map((m) => (
                <li key={m.id}>
                  <Link
                    to={`/meds/${m.id}`}
                    className="btn btn-secondary btn-block med-link"
                    style={{ ...medStyle(m.name), justifyContent: 'space-between' }}
                  >
                    <span className="row" style={{ gap: 12 }}>
                      <Icon name="pill" /> {m.name}
                    </span>
                    <span>
                      Learn more <Icon name="next" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <div className="row">
        <Link to="/meds/add" className="btn">
          <Icon name="plus" /> Add a medicine
        </Link>
        {state.meds.length > 0 && (
          <Link to="/meds/share" className="btn btn-secondary">
            <Icon name="print" /> My medicine list
          </Link>
        )}
      </div>
      <Disclaimer />
    </div>
  )
}
