import { Link } from 'react-router-dom'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { Icon } from '../../components/art/Icon'
import { Leaf } from '../../components/art/Objects'
import { PageHead } from '../../components/PageHead'
import { goodStreak, routinesFor, type Feeling } from '../../data/routines'
import { daysAgoKey, todayKey } from '../../lib/dates'
import { useStore } from '../../store'

const ENCOURAGE: Record<Feeling, string> = {
  good: 'Glad to hear it. Here are a few routines that suit a good day.',
  okay: 'Thank you for telling me. Let’s keep it easy and steady today.',
  rough: 'Sorry today is a rough one. Gentle seated moves can still help, and resting is fine too.',
}

export function MobilityHome() {
  const [state, setState] = useStore()
  const today = todayKey()
  const feeling = state.feelings[today]
  const moved = state.movedDays.includes(today)
  const streak = goodStreak(state.feelings, Array.from({ length: 14 }, (_, i) => daysAgoKey(i)))
  const routines = feeling ? routinesFor(feeling, streak) : []
  const daysThisWeek = Array.from({ length: 7 }, (_, i) => daysAgoKey(i)).filter((d) => state.movedDays.includes(d)).length

  return (
    <div className="stack narrow">
      <PageHead title="Exercise" back={{ to: '/', label: 'Home' }} owly="stretch" />

      <section className="card stack-sm" aria-labelledby="goal">
        <h2 id="goal">Today’s goal: move for 10 minutes</h2>
        <p>Any movement counts: a routine, a walk, gardening, or dancing in the kitchen.</p>
        {moved ? (
          <p className="status">
            <Icon name="check" /> Done for today. You moved on {daysThisWeek} of the last 7 days.
          </p>
        ) : (
          <button className="btn btn-ok" onClick={() => setState((s) => ({ ...s, movedDays: [...s.movedDays, today] }))}>
            <Icon name="check" /> I moved today
          </button>
        )}
      </section>

      <h2 id="feeling">How are you feeling today?</h2>
      <ChoiceGroup<Feeling>
        label="How are you feeling today"
        selected={feeling}
        onChoose={(f) => setState((s) => ({ ...s, feelings: { ...s.feelings, [today]: f } }))}
        choices={[
          { value: 'good', label: 'Good', icon: <Icon name="smile" /> },
          { value: 'okay', label: 'So-so', icon: <Icon name="meh" /> },
          { value: 'rough', label: 'Rough', icon: <Icon name="frown" /> },
        ]}
      />

      {feeling && (
        <section className="stack-sm" aria-live="polite" aria-labelledby="routines">
          <p>{ENCOURAGE[feeling]}</p>
          {feeling === 'good' && streak >= 3 && (
            <p className="callout callout-ok callout-head">
              <Icon name="star" /> {streak} good days in a row. A standing balance routine is now on your list, to help you feel steadier.
            </p>
          )}
          <h2 id="routines" className="visually-hidden">
            Routines for today
          </h2>
          <ul className="list">
            {routines.map((r) => (
              <li key={r.id} className="card stack-sm">
                <h3>{r.title}</h3>
                <p>
                  {r.summary} About {r.minutes} minutes, {r.seated ? 'sitting in a chair' : 'holding on to a chair'}.
                </p>
                <Link to={`/move/${r.id}`} className="btn">
                  Start {r.title} <Icon name="next" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link to="/move/places" className="btn btn-secondary btn-block">
        <Icon name="pin" /> Good places to walk nearby
      </Link>
      <div className="note">
        <Icon name="info" />
        <p>If you feel chest pain, dizziness, or sharp pain, stop and rest. Check with your doctor before starting new exercise.</p>
      </div>
      <div className="foot-decor">
        <Leaf tone="orange" />
        <Leaf tone="blush" />
        <Leaf />
      </div>
    </div>
  )
}
