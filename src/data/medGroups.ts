import type { CSSProperties } from 'react'
import { findMed } from './meds'

/**
 * Medicines are colored by what they treat, so pills for the same thing share a color
 * across the list, reminders, and the printed summary. Color is never the only cue:
 * every colored medicine also shows its group's name.
 */
export type MedGroupId = 'heart' | 'cholesterol' | 'sugar' | 'thinner' | 'pain' | 'stomach' | 'mind' | 'other'

export interface MedGroup {
  id: MedGroupId
  label: string
  /** Stripe, pill and dot color (navy text and outlines sit on it). */
  color: string
  /** Light tint behind the medicine's card. */
  soft: string
}

export const MED_GROUPS: Record<MedGroupId, MedGroup> = {
  heart: { id: 'heart', label: 'Heart & blood pressure', color: '#f08e97', soft: '#fde4e6' },
  cholesterol: { id: 'cholesterol', label: 'Cholesterol', color: '#f3c94b', soft: '#fdf3cf' },
  sugar: { id: 'sugar', label: 'Blood sugar', color: '#76aeee', soft: '#e0ecfb' },
  thinner: { id: 'thinner', label: 'Blood thinner', color: '#b193e6', soft: '#ede5fa' },
  pain: { id: 'pain', label: 'Pain & swelling', color: '#6fc48f', soft: '#e1f4e7' },
  stomach: { id: 'stomach', label: 'Stomach', color: '#ee93c6', soft: '#fce5f1' },
  mind: { id: 'mind', label: 'Mood, memory & sleep', color: '#f59e6e', soft: '#fde7db' },
  other: { id: 'other', label: 'Other', color: '#b8c0cf', soft: '#eceff4' },
}

const GROUP_OF: Record<string, MedGroupId> = {
  Lisinopril: 'heart', Amlodipine: 'heart', Losartan: 'heart', Metoprolol: 'heart',
  Hydrochlorothiazide: 'heart', Furosemide: 'heart', Nitroglycerin: 'heart',
  Atorvastatin: 'cholesterol', Simvastatin: 'cholesterol', Rosuvastatin: 'cholesterol',
  Metformin: 'sugar', Glipizide: 'sugar', Insulin: 'sugar',
  Warfarin: 'thinner', Apixaban: 'thinner', Clopidogrel: 'thinner', Aspirin: 'thinner',
  Ibuprofen: 'pain', Naproxen: 'pain', Acetaminophen: 'pain', Gabapentin: 'pain', Prednisone: 'pain',
  Omeprazole: 'stomach', Pantoprazole: 'stomach',
  Sertraline: 'mind', Donepezil: 'mind', Diphenhydramine: 'mind',
}

/** The group for a medicine name (brand names work too). Unknown medicines are "Other". */
export function medGroup(name: string): MedGroup {
  const known = findMed(name)
  return MED_GROUPS[(known && GROUP_OF[known.name]) || 'other']
}

/** CSS variables for one medicine's color, for a style={} prop. */
export function medStyle(name: string): CSSProperties {
  const g = medGroup(name)
  return { '--med': g.color, '--med-soft': g.soft } as CSSProperties
}
