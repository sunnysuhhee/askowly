import { useEffect, useState } from 'react'

/** useState that survives reloads. Falls back to memory if storage is blocked. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? { ...initial, ...JSON.parse(raw) } : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode or full storage: keep working in memory */
    }
  }, [key, value])
  return [value, setValue] as const
}
