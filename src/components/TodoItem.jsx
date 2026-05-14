import { useEffect, useRef, useState } from 'react'

// Cycle order for the click-to-cycle priority pill.
const NEXT_PRIORITY = { low: 'medium', medium: 'high', high: 'low' }
const PRIORITY_LABEL = { low: 'Low', medium: 'Med', high: 'High' }

/**
 * TodoItem
 * --------
 * One row in the list. Adds:
 *   • a colored left-edge accent matching the task's priority
 *   • a clickable priority pill (cycles low → medium → high → low)
 * Edit mode is unchanged from the previous version.
 */
export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onSetPriority,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  // Legacy todos created before priorities existed default to medium.
  const priority = todo.priority ?? 'medium'

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
    <li
      className={`todo-item ${todo.completed ? 'is-completed' : ''}`}
      data-priority={priority}
    >
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

      {/* Priority pill — click to cycle to the next level. */}
      <button
        type="button"
        className="priority-badge"
        data-priority={priority}
        onClick={() => onSetPriority(todo.id, NEXT_PRIORITY[priority])}
        title="Click to change priority"
        aria-label={`Priority: ${PRIORITY_LABEL[priority]}. Click to change.`}
      >
        {PRIORITY_LABEL[priority]}
      </button>

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
