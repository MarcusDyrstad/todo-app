/**
 * Date utility helpers. Dates are stored as YYYY-MM-DD strings.
 */

export function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false
  return dueDate < todayISO()
}

export function formatDate(iso) {
  if (!iso) return ''
  const today = new Date(todayISO() + 'T00:00:00')
  const target = new Date(iso + 'T00:00:00')
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'

  const sameYear = target.getFullYear() === today.getFullYear()
  const opts = sameYear
    ? { weekday: 'short', month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' }
  return target.toLocaleDateString(undefined, opts)
}
