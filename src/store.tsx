import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Feeling } from './data/routines'
import { daysAgoKey } from './lib/dates'

export interface MyMed {
  id: string
  name: string
  /** "HH:MM" 24-hour times */
  times: string[]
  note: string
}

export interface DoseEntry {
  medId: string
  date: string
  time: string
  status: 'taken' | 'skipped'
}

export interface AppState {
  meds: MyMed[]
  doses: DoseEntry[]
  person: { name: string; phone: string }
  textSize: 'large' | 'larger' | 'largest'
  feelings: Record<string, Feeling>
  movedDays: string[]
}

const INITIAL: AppState = {
  meds: [],
  doses: [],
  person: { name: '', phone: '' },
  textSize: 'large',
  feelings: {},
  movedDays: [],
}

type Ctx = [AppState, (fn: (s: AppState) => AppState) => void]
const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  // Storage key kept from the app's earlier name so people keep their saved medicines and settings.
  const [state, setState] = useLocalStorage<AppState>('silverline:v1', INITIAL)

  useEffect(() => {
    document.documentElement.dataset.size = state.textSize
  }, [state.textSize])

  // Keep only the last 60 days of dose history so storage stays small.
  useEffect(() => {
    const cutoff = daysAgoKey(60)
    if (state.doses.some((d) => d.date < cutoff)) {
      setState((s) => ({ ...s, doses: s.doses.filter((d) => d.date >= cutoff) }))
    }
  }, [state.doses, setState])

  return <StoreContext.Provider value={[state, (fn) => setState(fn)]}>{children}</StoreContext.Provider>
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}
