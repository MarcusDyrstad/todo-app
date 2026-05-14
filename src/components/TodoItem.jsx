import { useEffect, useRef, useState } from 'react'

/**
 * TodoItem
 * --------
 * A single row in the list. Handles its own "is editing" mode locally,
 * but delegates persistence back up to the parent through callbacks.
 *
 * UX details:
 *   • Double-clicking the label switches to edit mode.
 *   • Enter confirms the edit; Escape cancels; blur also confirms.
 *   • The checkbox toggles completion state.
 */
export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  // Focus + select the input when entering edit mode.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    setDraft(todo.text)
    setIsEditing(true)
  }

  const commitEdit = () => {
    onEdit(todo.id, draft)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setDraft(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <li className={`todo-item ${todo.completed ? 'is-completed' : ''}`}>
      {/* Custom checkbox — uses a real <input type=checkbox> for a11y */}
      <label className="todo-item__check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="todo-item__checkmark" aria-hidden="true" />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="todo-item__edit"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          maxLength={200}
        />
      ) : (
        <span
          className="todo-item__text"
          onDoubleClick={startEditing}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      <div className="todo-item__actions">
        {!isEditing && (
          <button
            type="button"
            className="icon-btn"
            onClick={startEditing}
            aria-label="Edit task"
            title="Edit"
          >
            ✎
          </button>
        )}
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </li>
  )
}
