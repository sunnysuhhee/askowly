/**
 * Gentle routines based on widely used fall-prevention programs
 * (CDC STEADI, Otago-style balance and strength moves).
 * Reps scale with how the person says they feel today.
 */
export type Pose =
  | 'sit' | 'sit-arms-up' | 'sit-leg-lift' | 'sit-ankle' | 'sit-twist'
  | 'stand-chair' | 'stand-one-leg' | 'heel-raise' | 'march' | 'sit-to-stand' | 'side-step' | 'heel-toe'

export type Feeling = 'good' | 'okay' | 'rough'

export interface Step {
  pose: Pose
  title: string
  how: string
  /** Reps (or seconds when `seconds` is true) on a good day. Scaled down on rougher days. */
  reps: number
  seconds?: boolean
}

export interface Routine {
  id: string
  title: string
  summary: string
  minutes: number
  seated: boolean
  level: 1 | 2
  safety: string
  steps: Step[]
}

export const ROUTINES: Routine[] = [
  {
    id: 'seated-warmup', title: 'Seated Warm-up', summary: 'Wake up your joints without standing.', minutes: 6, seated: true, level: 1,
    safety: 'Sit in a sturdy chair without wheels, with your feet flat on the floor.',
    steps: [
      { pose: 'sit', title: 'Deep breaths', how: 'Sit tall. Breathe in slowly through your nose, then out through your mouth.', reps: 5 },
      { pose: 'sit-arms-up', title: 'Arm raises', how: 'Raise both arms up in front of you as high as is comfortable, then lower them slowly.', reps: 8 },
      { pose: 'sit-ankle', title: 'Ankle circles', how: 'Lift one foot a little and draw slow circles with your toes. Switch feet.', reps: 8 },
      { pose: 'sit-leg-lift', title: 'Knee straightening', how: 'Slowly straighten one knee until your leg is out in front, hold, then lower. Switch legs.', reps: 8 },
      { pose: 'sit-twist', title: 'Gentle twist', how: 'Hands on your knees. Turn your shoulders gently to one side, then the other.', reps: 6 },
    ],
  },
  {
    id: 'chair-strength', title: 'Chair Strength', summary: 'Build leg strength to make standing up easier.', minutes: 8, seated: true, level: 1,
    safety: 'Use a sturdy chair against a wall. Stop if anything hurts sharply.',
    steps: [
      { pose: 'sit-leg-lift', title: 'Leg straightening', how: 'Straighten one leg out in front, hold for a count of three, then lower. Switch legs.', reps: 10 },
      { pose: 'sit', title: 'Toe taps', how: 'Keep your heels down and lift your toes, then lower them.', reps: 12 },
      { pose: 'sit-to-stand', title: 'Sit to stand', how: 'Scoot forward. Lean forward a little and push up to standing, using your hands if you need to. Sit back down slowly.', reps: 6 },
      { pose: 'sit-arms-up', title: 'Arm presses', how: 'Bend your elbows at your sides, then push your hands up toward the ceiling.', reps: 10 },
    ],
  },
  {
    id: 'standing-balance', title: 'Standing Balance', summary: 'Practice balance to help prevent falls.', minutes: 8, seated: false, level: 2,
    safety: 'Stand behind a sturdy chair or kitchen counter and hold on with both hands. Have someone nearby the first few times.',
    steps: [
      { pose: 'stand-chair', title: 'Stand tall', how: 'Hold the chair. Stand up tall with your feet apart and look straight ahead.', reps: 20, seconds: true },
      { pose: 'heel-raise', title: 'Heel raises', how: 'Holding on, rise up onto your toes, then lower your heels slowly.', reps: 10 },
      { pose: 'side-step', title: 'Side steps', how: 'Holding on, step one foot out to the side, then bring it back. Switch sides.', reps: 8 },
      { pose: 'stand-one-leg', title: 'One-foot stand', how: 'Holding on with both hands, lift one foot just off the floor. Switch feet.', reps: 10, seconds: true },
      { pose: 'heel-toe', title: 'Heel-to-toe stand', how: 'Holding on, place one foot right in front of the other, like on a tightrope.', reps: 10, seconds: true },
    ],
  },
  {
    id: 'walk-prep', title: 'Get Ready to Walk', summary: 'Loosen up before a walk.', minutes: 5, seated: false, level: 2,
    safety: 'Hold a sturdy chair or counter. Wear shoes with good grip.',
    steps: [
      { pose: 'march', title: 'March in place', how: 'Holding on, lift one knee and then the other, like a slow march.', reps: 20 },
      { pose: 'heel-raise', title: 'Heel raises', how: 'Rise up onto your toes, then lower slowly.', reps: 8 },
      { pose: 'sit-ankle', title: 'Ankle circles', how: 'Sitting or holding on, draw slow circles with each foot.', reps: 6 },
      { pose: 'stand-chair', title: 'Tall posture', how: 'Stand tall, shoulders back and relaxed. You are ready to walk.', reps: 10, seconds: true },
    ],
  },
]

const SCALE: Record<Feeling, number> = { good: 1, okay: 0.7, rough: 0.5 }

export function scaledReps(step: Step, feeling: Feeling): number {
  return Math.max(3, Math.round(step.reps * SCALE[feeling]))
}

const byId = (id: string) => ROUTINES.find((r) => r.id === id)!

/**
 * Picks at most three routines for today (the three-choice rule).
 * Rough days: seated only. After several good days in a row, step up to standing work.
 */
export function routinesFor(feeling: Feeling, goodStreak: number): Routine[] {
  if (feeling === 'rough') return ['seated-warmup', 'chair-strength'].map(byId)
  if (feeling === 'okay') return ['seated-warmup', 'chair-strength', 'walk-prep'].map(byId)
  return (goodStreak >= 3 ? ['standing-balance', 'walk-prep', 'chair-strength'] : ['seated-warmup', 'chair-strength', 'standing-balance']).map(byId)
}

/** Consecutive days (ending today) the person said they felt good. */
export function goodStreak(feelings: Record<string, Feeling>, dayKeys: string[]): number {
  let n = 0
  for (const k of dayKeys) {
    if (feelings[k] === 'good') n++
    else break
  }
  return n
}
