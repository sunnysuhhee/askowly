/**
 * SAMPLE pricing for a 30-day supply. A small cached dataset for the demo,
 * not live prices. Replace with real prices you collect from local
 * pharmacies (call or check their sites) and update AS_OF.
 */
export const PRICES_AS_OF = 'September 2026'

export interface Pharmacy {
  id: string
  name: string
  town: string
  milesAway: number
}

export const PHARMACIES: Pharmacy[] = [
  { id: 'main', name: 'Main Street Pharmacy', town: 'Downtown', milesAway: 1.2 },
  { id: 'chain', name: 'Big Chain Pharmacy', town: 'Route 24', milesAway: 6.5 },
  { id: 'grocery', name: 'Grocery Store Pharmacy', town: 'Shopping Plaza', milesAway: 8.0 },
  { id: 'mail', name: 'Mail-Order Pharmacy', town: 'By mail', milesAway: 0 },
]

/** price[medName][pharmacyId] = { cash, copay } in dollars */
export const PRICES: Record<string, Record<string, { cash: number; copay: number }>> = {
  Lisinopril: { main: { cash: 9, copay: 10 }, chain: { cash: 15, copay: 10 }, grocery: { cash: 4, copay: 10 }, mail: { cash: 6, copay: 5 } },
  Atorvastatin: { main: { cash: 18, copay: 15 }, chain: { cash: 32, copay: 15 }, grocery: { cash: 10, copay: 15 }, mail: { cash: 9, copay: 10 } },
  Metformin: { main: { cash: 8, copay: 10 }, chain: { cash: 14, copay: 10 }, grocery: { cash: 4, copay: 10 }, mail: { cash: 5, copay: 5 } },
  Amlodipine: { main: { cash: 10, copay: 10 }, chain: { cash: 19, copay: 10 }, grocery: { cash: 4, copay: 10 }, mail: { cash: 6, copay: 5 } },
  Levothyroxine: { main: { cash: 14, copay: 12 }, chain: { cash: 24, copay: 12 }, grocery: { cash: 11, copay: 12 }, mail: { cash: 10, copay: 8 } },
  Omeprazole: { main: { cash: 16, copay: 15 }, chain: { cash: 28, copay: 15 }, grocery: { cash: 12, copay: 15 }, mail: { cash: 11, copay: 10 } },
  Apixaban: { main: { cash: 560, copay: 47 }, chain: { cash: 595, copay: 47 }, grocery: { cash: 548, copay: 47 }, mail: { cash: 530, copay: 35 } },
  Losartan: { main: { cash: 12, copay: 10 }, chain: { cash: 22, copay: 10 }, grocery: { cash: 8, copay: 10 }, mail: { cash: 7, copay: 5 } },
  Metoprolol: { main: { cash: 11, copay: 10 }, chain: { cash: 18, copay: 10 }, grocery: { cash: 6, copay: 10 }, mail: { cash: 7, copay: 5 } },
  Gabapentin: { main: { cash: 15, copay: 12 }, chain: { cash: 27, copay: 12 }, grocery: { cash: 13, copay: 12 }, mail: { cash: 12, copay: 8 } },
}

export function pricesFor(medName: string) {
  const row = PRICES[medName]
  if (!row) return null
  return PHARMACIES.map((p) => ({ pharmacy: p, ...row[p.id], best: Math.min(row[p.id].cash, row[p.id].copay) }))
    .sort((a, b) => a.best - b.best)
}
