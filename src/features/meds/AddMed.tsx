import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '../../components/art/Icon'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { PageHead } from '../../components/PageHead'
import { SpeakButton } from '../../components/SpeakButton'
import { findMed, findMedInText, searchMeds, type MedInfo } from '../../data/meds'
import { medGroup, medStyle } from '../../data/medGroups'
import { newId, useStore } from '../../store'
import { friendlyTime } from '../../lib/dates'

type Schedule = 'morning' | 'twice' | 'night'
const SCHEDULES: Record<Schedule, string[]> = { morning: ['08:00'], twice: ['08:00', '20:00'], night: ['21:00'] }

export function AddMed() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [, setState] = useStore()
  const [query, setQuery] = useState(params.get('name') ?? '')
  const [picked, setPicked] = useState<MedInfo | null>(() => findMed(params.get('name') ?? '') ?? null)
  const [customName, setCustomName] = useState('')
  const [schedule, setSchedule] = useState<Schedule | undefined>()
  const [times, setTimes] = useState<string[]>([])
  const [scan, setScan] = useState<'idle' | 'reading' | 'notfound'>('idle')

  const matches = picked ? [] : searchMeds(query)
  const name = picked?.name ?? customName

  async function readBottle(file: File) {
    setScan('reading')
    try {
      // Loaded only when needed; reads the label on this device.
      const { default: Tesseract } = await import('tesseract.js')
      const { data } = await Tesseract.recognize(file, 'eng')
      const med = findMedInText(data.text)
      if (med) {
        setPicked(med)
        setQuery(med.name)
        setScan('idle')
      } else setScan('notfound')
    } catch {
      setScan('notfound')
    }
  }

  function chooseSchedule(s: Schedule) {
    setSchedule(s)
    setTimes(SCHEDULES[s])
  }

  function save() {
    setState((s) => ({ ...s, meds: [...s.meds, { id: newId(), name, times, note: '' }] }))
    navigate('/meds')
  }

  return (
    <div className="stack narrow">
      <PageHead title="Add a medicine" back={{ to: '/meds', label: 'my medicines' }} owly="book" />

      {!picked && !customName && (
        <>
          <section className="card stack-sm">
            <label htmlFor="medname">Type the name on the bottle</label>
            <input id="medname" value={query} autoComplete="off" onChange={(e) => setQuery(e.target.value)} />
            <div className="row row-tight">
              <SpeakButton onText={(heard) => setQuery(heard.replace(/[.!?]$/, ''))} />
            </div>
            {matches.length > 0 && (
              <>
                <p className="label" id="matches">
                  Is it one of these?
                </p>
                <ChoiceGroup
                  label="Matching medicines"
                  choices={matches.map((m) => ({
                    value: m.name,
                    label: m.name,
                    icon: (
                      <span style={medStyle(m.name)}>
                        <Icon name="pill" />
                      </span>
                    ),
                  }))}
                  onChoose={(v) => setPicked(findMed(v)!)}
                />
              </>
            )}
            {query.trim().length >= 3 && matches.length === 0 && (
              <>
                <p>Owly does not have information about “{query.trim()}”, but you can still add it for reminders.</p>
                <button className="btn btn-secondary" onClick={() => setCustomName(query.trim())}>
                  <Icon name="plus" /> Add “{query.trim()}”
                </button>
              </>
            )}
          </section>

          <section className="card stack-sm">
            <h2>Or take a picture of the label</h2>
            <p>Owly reads the name from the label on this device. Good light helps.</p>
            <label className="btn btn-secondary btn-block" style={{ margin: 0 }} aria-busy={scan === 'reading'}>
              <Icon name="camera" /> {scan === 'reading' ? 'Reading the label…' : 'Take a picture'}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="visually-hidden"
                disabled={scan === 'reading'}
                onChange={(e) => e.target.files?.[0] && readBottle(e.target.files[0])}
              />
            </label>
            {scan === 'notfound' && (
              <p className="status status-error" role="alert">
                <Icon name="warning" /> Owly could not read the name. Try again in good light, or type the name above.
              </p>
            )}
          </section>
        </>
      )}

      {(picked || customName) && (
        <>
          <section className="card med-card stack-sm" style={medStyle(name)}>
            <div className="med-head">
              <Icon name="pill" />
              <h2>{name}</h2>
              <span className="tag med-tag">{medGroup(name).label}</span>
            </div>
            {picked && <p>Usually used {picked.purpose}.</p>}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setPicked(null)
                setCustomName('')
                setQuery('')
              }}
            >
              <Icon name="back" /> Not this one
            </button>
          </section>

          <h2>When do you take it?</h2>
          <p>Choose what your prescription label says. You can set the exact times next.</p>
          <ChoiceGroup
            label="When do you take it"
            selected={schedule}
            onChoose={chooseSchedule}
            choices={[
              { value: 'morning', label: 'Once, in the morning', icon: <Icon name="sun" /> },
              { value: 'twice', label: 'Morning and evening', icon: <Icon name="sunmoon" /> },
              { value: 'night', label: 'Once, at bedtime', icon: <Icon name="moon" /> },
            ]}
          />
          {times.length > 0 && (
            <section className="card stack-sm">
              <h3>Reminder times</h3>
              {times.map((t, i) => (
                <div key={i}>
                  <label htmlFor={`t${i}`}>
                    Reminder {i + 1} (now {friendlyTime(t)})
                  </label>
                  <input id={`t${i}`} type="time" value={t} onChange={(e) => setTimes(times.map((x, j) => (j === i ? e.target.value : x)))} />
                </div>
              ))}
            </section>
          )}
          <button className="btn btn-block btn-ok" disabled={times.length === 0} onClick={save}>
            <Icon name="check" /> Save {name}
          </button>
        </>
      )}
    </div>
  )
}
