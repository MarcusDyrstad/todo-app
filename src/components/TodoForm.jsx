import { useState } from 'react'

/**
 * TodoForm
 * --------
 * Controlled <input> + submit button. Pure presentational component:
 * it doesn't know about localStorage or the global todos array — it
 * just calls `onAdd(text)` and clears itself on success.
 *
 * Props:
 *   onAdd(text) -> boolean — return true if the parent accepted the input
 *   error       -> string  — current validation error, if any
 *   clearError  -> ()      — called when the user starts typing again
 */
export default function TodoForm({ onAdd, error, clearError }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Parent decides if the input is valid; if so, we clear the field.
    const ok = onAdd(value)
    if (ok) setValue('')
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (error) clearError() // Hide the error as soon as they fix it.
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
      {/* Inline error message — accessible via aria-describedby */}
      {error && (
        <p id="todo-form-error" className="todo-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
