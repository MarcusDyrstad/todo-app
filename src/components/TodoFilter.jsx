/*
  TodoFilter — three buttons: All / Active / Completed.
  Stateless: the current filter lives in App.jsx.
*/
const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'active',    label: 'Active' },
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
