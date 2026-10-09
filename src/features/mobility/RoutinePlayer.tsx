import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../../components/art/Icon'
import { Owly } from '../../components/art/Owly'
import { PageHead } from '../../components/PageHead'
import { PoseArt } from '../../components/PoseArt'
import { ReadAloud } from '../../components/ReadAloud'
import { ROUTINES, scaledReps } from '../../data/routines'
import { todayKey } from '../../lib/dates'
import { useStore } from '../../store'

/** One step per screen: a big picture, one sentence, Back and Next. No swiping or timers. */
export function RoutinePlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [state, setState] = useStore()
  const routine = ROUTINES.find((r) => r.id === id)
  const [i, setI] = useState(-1) // -1 = safety screen
  const feeling = state.feelings[todayKey()] ?? 'okay'

  if (!routine) {
    return (
      <div className="stack narrow">
        <PageHead title="Owly could not find that routine" back={{ to: '/move', label: 'Exercise' }} owly="stretch" />
      </div>
    )
  }

  if (i === -1) {
    return (
      <div className="stack narrow">
        <PageHead title={routine.title} back={{ to: '/move', label: 'Exercise' }} owly="stretch" />
        <div className="callout callout-warn">
          <h2 className="callout-head">
            <Icon name="warning" /> Before you start
          </h2>
          <p>{routine.safety}</p>
        </div>
        <p>
          {routine.steps.length} steps, about {routine.minutes} minutes. Go at your own pace, and stop any time.
        </p>
        <div className="row row-tight">
          <ReadAloud text={`Before you start. ${routine.safety}`} />
        </div>
        <button className="btn btn-block" onClick={() => setI(0)}>
          I’m ready <Icon name="next" />
        </button>
      </div>
    )
  }

  if (i >= routine.steps.length) {
    const today = todayKey()
    return (
      <div className="stack narrow" style={{ textAlign: 'center' }}>
        <Owly pose="stretch" className="dialog-art" />
        <h1 tabIndex={-1}>Nicely done</h1>
        <p>You finished {routine.title}. Every bit of movement helps keep you steady and strong.</p>
        {!state.movedDays.includes(today) ? (
          <button className="btn btn-ok btn-block" onClick={() => setState((s) => ({ ...s, movedDays: [...s.movedDays, today] }))}>
            <Icon name="check" /> Count this as today’s movement
          </button>
        ) : (
          <p className="status" style={{ justifyContent: 'center' }}>
            <Icon name="check" /> Today’s movement is counted.
          </p>
        )}
        <Link to="/move" className="btn btn-secondary btn-block">
          <Icon name="back" /> Back to Exercise
        </Link>
      </div>
    )
  }

  const step = routine.steps[i]
  const reps = scaledReps(step, feeling)
  const amount = step.seconds ? `Hold for ${reps} seconds` : `Do it ${reps} times`
  const last = i === routine.steps.length - 1

  return (
    <div className="stack narrow">
      <div className="row row-tight" style={{ justifyContent: 'space-between' }}>
        <p className="label" style={{ margin: 0 }}>
          Step {i + 1} of {routine.steps.length}
        </p>
        <button className="btn btn-secondary" onClick={() => navigate('/move')}>
          <Icon name="pause" /> Stop for now
        </button>
      </div>
      <ol className="progress-dots" aria-hidden="true">
        {routine.steps.map((_, j) => (
          <li key={j} className={j <= i ? 'on' : ''} />
        ))}
      </ol>
      <h1 tabIndex={-1}>{step.title}</h1>
      <PoseArt pose={step.pose} title={step.title} />
      <p>{step.how}</p>
      <p className="amount">{amount}.</p>
      <div className="row row-tight">
        <ReadAloud text={`${step.title}. ${step.how} ${amount}.`} />
      </div>
      <div className="row">
        <button className="btn btn-secondary" onClick={() => setI(i - 1)}>
          <Icon name="back" /> Back
        </button>
        <button className="btn" onClick={() => setI(i + 1)}>
          {last ? 'Finish' : 'Next'} <Icon name={last ? 'check' : 'next'} />
        </button>
      </div>
    </div>
  )
}
