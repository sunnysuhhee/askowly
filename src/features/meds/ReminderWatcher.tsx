import { useEffect, useState } from 'react'
import { nowHHMM, friendlyTime, todayKey } from '../../lib/dates'
import { useStore, type MyMed } from '../../store'
import { useSpeak } from '../../hooks/useSpeak'
import { Icon } from '../../components/art/Icon'
import { Owly } from '../../components/art/Owly'
import { medGroup, medStyle } from '../../data/medGroups'

interface Due {
  med: MyMed
  time: string
}

/**
 * Checks every 30 seconds while the app is open. When a dose is due and
 * not yet marked, shows a full-screen reminder with one big button.
 * (Browsers cannot reliably remind you when the app is closed; we say so in Settings.)
 */
export function ReminderWatcher() {
  const [state, setState] = useStore()
  const [due, setDue] = useState<Due | null>(null)
  const [snoozed, setSnoozed] = useState<Record<string, number>>({})
  const { speak } = useSpeak()

  useEffect(() => {
    function check() {
      if (due) return
      const now = nowHHMM()
      const today = todayKey()
      for (const med of state.meds) {
        for (const time of med.times) {
          const key = `${med.id}@${time}`
          const handled = state.doses.some((d) => d.medId === med.id && d.date === today && d.time === time)
          // Due within the last 2 hours, not handled, not snoozed.
          const minsLate = toMins(now) - toMins(time)
          if (!handled && minsLate >= 0 && minsLate <= 120 && (snoozed[key] ?? 0) < Date.now()) {
            setDue({ med, time })
            const msg = `Time for your ${med.name}.`
            speak(msg)
            if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
              new Notification('AskOwly', { body: msg, icon: '/icon.svg' })
            }
            return
          }
        }
      }
    }
    check()
    const timer = setInterval(check, 30_000)
    return () => clearInterval(timer)
  }, [state.meds, state.doses, snoozed, due, speak])

  if (!due) return null

  function record(status: 'taken' | 'skipped') {
    const { med, time } = due!
    setState((s) => ({ ...s, doses: [...s.doses, { medId: med.id, date: todayKey(), time, status }] }))
    setDue(null)
  }

  return (
    <div className="overlay" data-feature="meds" role="alertdialog" aria-modal="true" aria-labelledby="reminder-title" aria-describedby="reminder-when">
      <div className="card med-card stack-sm" style={medStyle(due.med.name)}>
        <Owly pose="book" className="dialog-art" />
        <h1 id="reminder-title" tabIndex={-1} style={{ textAlign: 'center' }}>
          Time for your {due.med.name}
        </h1>
        <p id="reminder-when" style={{ textAlign: 'center' }}>
          <span className="med-dot" aria-hidden="true" />
          {medGroup(due.med.name).label} medicine, scheduled for {friendlyTime(due.time)}.
        </p>
        <button className="btn btn-ok btn-block" autoFocus onClick={() => record('taken')}>
          <Icon name="check" /> I took it
        </button>
        <div className="row">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSnoozed((s) => ({ ...s, [`${due.med.id}@${due.time}`]: Date.now() + 15 * 60_000 }))
              setDue(null)
            }}
          >
            <Icon name="clock" /> Remind me in 15 minutes
          </button>
          <button className="btn btn-secondary" onClick={() => record('skipped')}>
            Skip this time
          </button>
        </div>
      </div>
    </div>
  )
}

function toMins(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
