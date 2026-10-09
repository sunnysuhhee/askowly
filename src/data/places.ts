/**
 * SAMPLE local places. Replace with real spots from your area:
 * the town park, the senior center, the mall's walking hours.
 */
export type PlaceTag = 'Flat path' | 'Benches' | 'Indoors' | 'Restrooms' | 'Parking close by' | 'Group class'

export interface Place {
  name: string
  what: string
  when: string
  tags: PlaceTag[]
}

export const PLACES: Place[] = [
  { name: 'Riverside Park Loop', what: 'A paved, flat half-mile loop along the river.', when: 'Dawn to dusk', tags: ['Flat path', 'Benches', 'Restrooms', 'Parking close by'] },
  { name: 'County Mall Walkers', what: 'Walk the mall indoors before stores open. Cool in summer, warm in winter.', when: 'Mon–Sat, 7–10 AM', tags: ['Indoors', 'Flat path', 'Benches', 'Restrooms'] },
  { name: 'Senior Center Balance Class', what: 'A free, gentle balance and strength class led by an instructor.', when: 'Tue & Thu, 10 AM', tags: ['Indoors', 'Group class', 'Restrooms', 'Parking close by'] },
  { name: 'Library Garden Path', what: 'A short, shaded garden path with a bench every 100 feet.', when: 'Library hours', tags: ['Flat path', 'Benches', 'Restrooms'] },
]
