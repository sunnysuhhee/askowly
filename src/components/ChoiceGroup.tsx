import type { ReactNode } from 'react'

export interface Choice<T extends string> {
  value: T
  label: ReactNode
  icon?: ReactNode
}

/**
 * Design rule: never more than three choices on screen at once.
 * This throws in development so the rule cannot be broken by accident.
 */
export function ChoiceGroup<T extends string>({
  choices, onChoose, selected, label,
}: { choices: Choice<T>[]; onChoose: (v: T) => void; selected?: T; label: string }) {
  if (import.meta.env.DEV && choices.length > 3) {
    throw new Error(`ChoiceGroup "${label}" has ${choices.length} choices; the limit is 3.`)
  }
  return (
    <div className="choices" role="group" aria-label={label}>
      {choices.map((c) => (
        <button
          key={c.value}
          type="button"
          className="tile"
          aria-pressed={selected === c.value}
          onClick={() => onChoose(c.value)}
        >
          {c.icon}
          {c.label}
        </button>
      ))}
    </div>
  )
}
