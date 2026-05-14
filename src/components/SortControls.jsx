const OPTIONS = [
  { value: 'date-desc',  label: 'Date added (newest)' },
  { value: 'due-date',   label: 'Due date (soonest)' },
  { value: 'alpha',      label: 'Alphabetical (A → Z)' },
  { value: 'priority',   label: 'Priority (high → low)' },
  { value: 'completion', label: 'Completion (incomplete first)' },
]

export default function SortControls({ sortBy, setSortBy }) {
  return (
    <div className="sort-controls">
      <label htmlFor="sort-by" className="sort-controls__label">Sort by</label>
      <select
        id="sort-by"
        className="sort-controls__select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        {OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}
