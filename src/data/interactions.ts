/**
 * A small, curated list of well-known interactions between common senior
 * medicines. This is not a complete checker; the app always says
 * "talk to your pharmacist".
 */
export interface Interaction {
  a: string
  b: string
  level: 'serious' | 'caution'
  what: string
}

export const INTERACTIONS: Interaction[] = [
  { a: 'Warfarin', b: 'Aspirin', level: 'serious', what: 'Taking these together raises the chance of serious bleeding.' },
  { a: 'Warfarin', b: 'Ibuprofen', level: 'serious', what: 'Taking these together raises the chance of serious bleeding, including in the stomach.' },
  { a: 'Warfarin', b: 'Naproxen', level: 'serious', what: 'Taking these together raises the chance of serious bleeding, including in the stomach.' },
  { a: 'Apixaban', b: 'Aspirin', level: 'serious', what: 'Taking these together raises the chance of bleeding.' },
  { a: 'Apixaban', b: 'Ibuprofen', level: 'serious', what: 'Taking these together raises the chance of bleeding.' },
  { a: 'Apixaban', b: 'Naproxen', level: 'serious', what: 'Taking these together raises the chance of bleeding.' },
  { a: 'Clopidogrel', b: 'Omeprazole', level: 'caution', what: 'Omeprazole can make clopidogrel work less well.' },
  { a: 'Sildenafil', b: 'Nitroglycerin', level: 'serious', what: 'Together these can drop blood pressure to a dangerous level.' },
  { a: 'Lisinopril', b: 'Potassium chloride', level: 'caution', what: 'Together these can raise potassium too high.' },
  { a: 'Losartan', b: 'Potassium chloride', level: 'caution', what: 'Together these can raise potassium too high.' },
  { a: 'Lisinopril', b: 'Ibuprofen', level: 'caution', what: 'Ibuprofen can make blood pressure medicine work less well and strain the kidneys.' },
  { a: 'Lisinopril', b: 'Naproxen', level: 'caution', what: 'Naproxen can make blood pressure medicine work less well and strain the kidneys.' },
  { a: 'Sertraline', b: 'Warfarin', level: 'caution', what: 'Together these can raise the chance of bleeding.' },
  { a: 'Sertraline', b: 'Aspirin', level: 'caution', what: 'Together these can raise the chance of bleeding.' },
  { a: 'Simvastatin', b: 'Amlodipine', level: 'caution', what: 'Amlodipine can raise simvastatin levels, which may cause muscle problems at higher doses.' },
  { a: 'Levothyroxine', b: 'Omeprazole', level: 'caution', what: 'Omeprazole can make it harder for your body to absorb levothyroxine.' },
  { a: 'Gabapentin', b: 'Diphenhydramine', level: 'caution', what: 'Both can cause sleepiness. Together they raise the risk of falls.' },
  { a: 'Donepezil', b: 'Diphenhydramine', level: 'caution', what: 'Diphenhydramine can work against donepezil and worsen confusion.' },
  { a: 'Metformin', b: 'Prednisone', level: 'caution', what: 'Prednisone can raise blood sugar, making diabetes harder to control.' },
  { a: 'Furosemide', b: 'Hydrochlorothiazide', level: 'caution', what: 'Two water pills together can lower potassium and cause dehydration.' },
]

export function findInteractions(medNames: string[]): Interaction[] {
  const set = new Set(medNames)
  return INTERACTIONS.filter((i) => set.has(i.a) && set.has(i.b))
}
