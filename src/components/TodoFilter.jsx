/**
 * TodoFilter
 * ----------
 * Three radio-style buttons: All / Active / Completed.
 * The active button is highlighted via the `is-active` class.
 *
 * Implemented as <button>s (not <a href="#...">) since this is purely
 * a client-side state change with no navigation.
 */
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

export default function TodoFilter({ filter, setFilter, counts }) {
  return (
    <div className="todo-filter" role="tablist" aria-label="Filter tasks">
      {FILTERS.map(({ key, label }) => {
        const isActive = filter === key
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`todo-filter__btn ${isActive ? 'is-active' : ''}`}
            onClick={() => setFilter(key)}
          >
            <span>{label}</span>
            <span className="todo-filter__count">{counts[key]}</span>
          </button>
        )
      })}
    </div>
  )
}
