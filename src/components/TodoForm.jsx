import { useState } from 'react'

const PRIORITIES = [
  { value: 'low',    label: 'Low'  },
  { value: 'medium', label: 'Med'  },
  { value: 'high',   label: 'High' },
]

export default function TodoForm({ onAdd, error, clearError, categories }) {
  const [text, setText]             = useState('')
  const [priority, setPriority]     = useState('medium')
  const [categoryId, setCategoryId] = useState('')
  const [dueDate, setDueDate]       = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = onAdd({
      text,
      priority,
      categoryId: categoryId || null,
      dueDate: dueDate || null,
    })
    if (ok) setText('')
  }

  const handleChange = (e) => {
    setText(e.target.value)
    if (error) clearError()
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className={`todo-form__field ${error ? 'has-error' : ''}`}>
        <input
          type="text"
          className="todo-form__input"
          placeholder="What needs to be done?"
          value={text}
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
          disabled={!text.trim()}
        >
          Add
        </button>
      </div>

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

      <div className="todo-form__row">
        <label className="todo-form__inline">
          <span>Category:</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="todo-form__select"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="todo-form__inline">
          <span>Due:</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="todo-form__date"
          />
          {dueDate && (
            <button
              type="button"
              className="todo-form__clear"
              onClick={() => setDueDate('')}
              aria-label="Clear due date"
              title="Clear due date"
            >
              ✕
            </button>
          )}
        </label>
      </div>

      {error && (
        <p id="todo-form-error" className="todo-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
