import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../../components/art/Icon'
import { Disclaimer } from '../../components/Disclaimer'
import { PageHead } from '../../components/PageHead'
import { ReadAloud } from '../../components/ReadAloud'
import { findMed } from '../../data/meds'
import { medGroup, medStyle } from '../../data/medGroups'
import { useStore } from '../../store'
import { friendlyTime } from '../../lib/dates'
import { PriceCompare } from './PriceCompare'
import { InteractionWarnings } from './InteractionWarnings'

export function MedDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [state, setState] = useStore()
  const [confirmRemove, setConfirmRemove] = useState(false)
  const med = state.meds.find((m) => m.id === id)

  if (!med) {
    return (
      <div className="stack narrow">
        <PageHead title="Owly could not find that medicine" back={{ to: '/meds', label: 'my medicines' }} owly="book" />
        <p>It may have been removed. Go back to see your list.</p>
      </div>
    )
  }

  const info = findMed(med.name)
  const spoken = info
    ? `${med.name} is usually used ${info.purpose}. Watch for: ${info.watchFor.join('. ')}.`
    : `${med.name}. Ask your pharmacist what this medicine is for.`

  return (
    <div className="stack narrow">
      <PageHead title={med.name} back={{ to: '/meds', label: 'my medicines' }} owly="book" />

      <section className="card med-card stack-sm" style={medStyle(med.name)} aria-labelledby="general">
        <div className="med-head">
          <Icon name="pill" />
          <h2 id="general">General information</h2>
          <span className="tag med-tag">{medGroup(med.name).label}</span>
        </div>
        {info ? (
          <>
            <h3>What it is for</h3>
            <p>Usually used {info.purpose}.</p>
            <h3>What to watch for</h3>
            <ul>
              {info.watchFor.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            {info.tips.length > 0 && (
              <>
                <h3>Good to know</h3>
                <ul>
                  {info.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <p>Owly does not have details for this medicine yet. Your pharmacist can explain what it is for.</p>
        )}
        <div className="row row-tight">
          <ReadAloud text={spoken} />
        </div>
      </section>

      <InteractionWarnings medNames={state.meds.map((m) => m.name)} />

      <section className="card stack-sm" aria-labelledby="reminders">
        <h2 id="reminders">My reminders</h2>
        <ul className="list">
          {med.times.map((t) => (
            <li key={t} className="reminder-time">
              <Icon name="clock" /> {friendlyTime(t)}
            </li>
          ))}
        </ul>
      </section>

      <PriceCompare medName={med.name} />
      <Disclaimer />

      {confirmRemove ? (
        <div className="callout callout-warn stack-sm" role="group" aria-labelledby="confirm-remove">
          <p className="callout-head" id="confirm-remove">
            <Icon name="warning" /> <strong>Remove {med.name} and its reminders?</strong>
          </p>
          <div className="row">
            <button
              className="btn btn-danger"
              onClick={() => {
                setState((s) => ({ ...s, meds: s.meds.filter((m) => m.id !== med.id), doses: s.doses.filter((d) => d.medId !== med.id) }))
                navigate('/meds')
              }}
            >
              <Icon name="trash" /> Yes, remove it
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirmRemove(false)} autoFocus>
              No, keep it
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn-quiet" onClick={() => setConfirmRemove(true)}>
          <Icon name="trash" /> Remove this medicine
        </button>
      )}
    </div>
  )
}
