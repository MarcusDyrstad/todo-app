import { useState } from 'react'

// Priority options shown as a 3-pill button group inside the form.
const PRIORITIES = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high',   label: 'High' },
]

/**
 * TodoForm
 * --------
 * Controlled input + priority picker + Add button.
 * onAdd is called with (text, priority); App validates the text.
 */
export default function TodoForm({ onAdd, error, clearError }) {
  const [value, setValue] = useState('')
  const [priority, setPriority] = useState('medium') // default — most tasks

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = onAdd(value, priority)
    if (ok) {
      setValue('')
      // Note: we intentionally keep the priority pill where it is,
      // so adding several "high"-priority tasks in a row is fast.
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (error) clearError()
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className={`todo-form__field ${error ? 'has-error' : ''}`}>
        <input
          type="text"
          className="todo-form__input"
          placeholder="What needs to be done?"
          value={value}
          onChange={handleChange}
          aria-label="New task"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'todo-form-error' : undefined}
          maxLength={200}
          autoFocus
        />
        <button
          type="submit"
          className="todo-form__submit"
          disabled={!value.trim()}
        >
          Add
        </button>
      </div>

      {/* Priority picker — three small pills, one for each level. */}
      <div className="priority-picker" role="radiogroup" aria-label="Priority">
        <span className="priority-picker__label">Priority:</span>
        {PRIORITIES.map(({ value: v, label }) => {
          const selected = priority === v
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={selected}
              data-priority={v}
              className={`priority-pill ${selected ? 'is-selected' : ''}`}
              onClick={() => setPriority(v)}
            >
              <span className="priority-pill__dot" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {error && (
        <p id="todo-form-error" className="todo-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
