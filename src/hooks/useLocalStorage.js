import { useEffect, useState } from 'react'

/**
 * useLocalStorage — same API as useState, but values are transparently
 * persisted to (and rehydrated from) window.localStorage.
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer (function form of useState) — runs once on mount.
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: failed to read key "${key}"`, error)
      return initialValue
    }
  })

  // Sync to storage whenever value (or key) changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`useLocalStorage: failed to write key "${key}"`, error)
    }
  }, [key, value])

  return [value, setValue]
}
