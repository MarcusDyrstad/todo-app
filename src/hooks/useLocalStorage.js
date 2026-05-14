import { useEffect, useState } from 'react'

/**
 * useLocalStorage
 * ---------------
 * A reusable custom hook that mirrors `useState` but transparently
 * persists the value into `window.localStorage`.
 *
 * Why a custom hook?
 *  • Keeps persistence logic out of components (separation of concerns).
 *  • Avoids duplicating try/catch JSON parsing everywhere.
 *  • If we ever swap localStorage for IndexedDB or a backend API,
 *    we only touch this one file.
 *
 * @param {string} key            — localStorage key
 * @param {*}      initialValue   — fallback when no value is stored
 * @returns {[any, Function]}     — same shape as useState
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer so we read from localStorage exactly once on mount.
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      // If nothing is stored, use the provided default.
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (error) {
      // localStorage can throw in private mode or when quota is exceeded.
      console.warn(`useLocalStorage: failed to read key "${key}"`, error)
      return initialValue
    }
  })

  // Whenever the value changes, write it back to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`useLocalStorage: failed to write key "${key}"`, error)
    }
  }, [key, value])

  return [value, setValue]
}
