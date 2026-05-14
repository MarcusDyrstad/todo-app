import { useEffect, useRef, useState } from 'react'
import SubtaskList from './SubtaskList.jsx'
import { formatDate, isOverdue } from '../utils/dates.js'

const NEXT_PRIORITY  = { low: 'medium', medium: 'high', high: 'low' }
const PRIORITY_LABEL = { low: 'Low',    medium: 'Med',  high: 'High' }

export default function TodoItem({
  todo,
  categories,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtaskText,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft]         = useState(todo.text)
  const [isExpanded, setIsExpanded] = useState(false)
  const [descDraft, setDescDraft] = useState(todo.description || '')
  const inputRef = useRef(null)

  const priority  = todo.priority ?? 'medium'
  const subtasks  = todo.subtasks || []
  const category  = categories.find((c) => c.id === todo.categoryId)
  const overdue   = isOverdue(todo.dueDate, todo.completed)
  const subDone   = subtasks.filter((s) => s.completed).length

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => { setDescDraft(todo.description || '') }, [todo.description])

  const startEditing = () => { setDraft(todo.text); setIsEditing(true) }
  const commitEdit = () => {
    const trimmed = draft.trim()
    if (!trimmed) { onDelete(todo.id); return }
    onUpdate(todo.id, { text: trimmed })
    setIsEditing(false)
  }
  const cancelEdit = () => { setDraft(todo.text); setIsEditing(false) }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }
  const cyclePriority = () => onUpdate(todo.id, { priority: NEXT_PRIORITY[priority] })
  const commitDescription = () => onUpdate(todo.id, { description: descDraft.trim() })

  return (
    <li
      className={`todo-item ${todo.completed ? 'is-completed' : ''} ${isExpanded ? 'is-expanded' : ''} ${overdue ? 'is-overdue' : ''}`}
      data-priority={priority}
    >
      <div className="todo-item__row">
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
          <div className="todo-item__main">
            <span
              className="todo-item__text"
              onDoubleClick={startEditing}
              title="Double-click to edit"
            >
              {todo.text}
            </span>
            {(category || todo.dueDate || subtasks.length > 0 || todo.description) && (
              <div className="todo-item__meta">
                {category && (
                  <span
                    className="category-pill"
                    style={{
                      backgroundColor: hexWithAlpha(category.color, 0.15),
                      color: category.color,
                      borderColor: category.color,
                    }}
                  >
                    {category.name}
                  </span>
                )}
                {todo.dueDate && (
                  <span className={`due-date ${overdue ? 'is-overdue' : ''}`}>
                    {overdue && <span aria-hidden="true">⚠️</span>}
                    {formatDate(todo.dueDate)}
                  </span>
                )}
                {subtasks.length > 0 && (
                  <span className="subtask-progress" title="Subtask progress">
                    ◧ {subDone}/{subtasks.length}
                  </span>
                )}
                {todo.description && !isExpanded && (
                  <span className="description-hint" title={todo.description}>📝</span>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="priority-badge"
          data-priority={priority}
          onClick={cyclePriority}
          title="Click to change priority"
          aria-label={`Priority: ${PRIORITY_LABEL[priority]}. Click to change.`}
        >
          {PRIORITY_LABEL[priority]}
        </button>

        <div className="todo-item__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            aria-expanded={isExpanded}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {!isEditing && (
            <button type="button" className="icon-btn" onClick={startEditing} aria-label="Edit task" title="Edit">
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
      </div>

      {isExpanded && (
        <div className="todo-item__details">
          <div className="details-row">
            <label className="details-label" htmlFor={`desc-${todo.id}`}>Description</label>
            <textarea
              id={`desc-${todo.id}`}
              className="details-textarea"
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              onBlur={commitDescription}
              placeholder="Add a description…"
              rows={2}
            />
          </div>

          <div className="details-row details-row--inline">
            <label className="details-label" htmlFor={`cat-${todo.id}`}>Category</label>
            <select
              id={`cat-${todo.id}`}
              className="details-select"
              value={todo.categoryId || ''}
              onChange={(e) => onUpdate(todo.id, { categoryId: e.target.value || null })}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="details-row details-row--inline">
            <label className="details-label" htmlFor={`due-${todo.id}`}>Due date</label>
            <input
              id={`due-${todo.id}`}
              type="date"
              className="details-date"
              value={todo.dueDate || ''}
              onChange={(e) => onUpdate(todo.id, { dueDate: e.target.value || null })}
            />
            {todo.dueDate && (
              <button
                type="button"
                className="details-clear"
                onClick={() => onUpdate(todo.id, { dueDate: null })}
              >
                Clear
              </button>
            )}
          </div>

          <div className="details-row">
            <label className="details-label">
              Subtasks {subtasks.length > 0 && `(${subDone}/${subtasks.length})`}
            </label>
            <SubtaskList
              subtasks={subtasks}
              onAdd={(text) => onAddSubtask(todo.id, text)}
              onToggle={(sid) => onToggleSubtask(todo.id, sid)}
              onDelete={(sid) => onDeleteSubtask(todo.id, sid)}
              onUpdate={(sid, text) => onUpdateSubtaskText(todo.id, sid, text)}
            />
          </div>
        </div>
      )}
    </li>
  )
}

function hexWithAlpha(hex, alpha) {
  if (!hex || typeof hex !== 'string' || hex[0] !== '#') return hex
  const cleaned = hex.slice(1)
  if (cleaned.length !== 6) return hex
  const r = parseInt(cleaned.slice(0, 2), 16)
  const g = parseInt(cleaned.slice(2, 4), 16)
  const b = parseInt(cleaned.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
