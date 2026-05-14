import { useState } from 'react'

export default function SubtaskList({ subtasks, onAdd, onToggle, onDelete, onUpdate }) {
  const [draft, setDraft] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    onAdd(draft)
    setDraft('')
  }

  return (
    <div className="subtasks">
      {subtasks.length > 0 && (
        <ul className="subtasks__list">
          {subtasks.map((s) => (
            <SubtaskItem
              key={s.id}
              subtask={s}
              onToggle={() => onToggle(s.id)}
              onDelete={() => onDelete(s.id)}
              onUpdate={(text) => onUpdate(s.id, text)}
            />
          ))}
        </ul>
      )}
      <form className="subtasks__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="subtasks__input"
          placeholder="Add a subtask…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={120}
        />
        <button
          type="submit"
          className="subtasks__add"
          disabled={!draft.trim()}
          aria-label="Add subtask"
          title="Add subtask"
        >
          +
        </button>
      </form>
    </div>
  )
}

function SubtaskItem({ subtask, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(subtask.text)

  const commit = () => { onUpdate(draft); setIsEditing(false) }
  const cancel = () => { setDraft(subtask.text); setIsEditing(false) }

  return (
    <li className={`subtask ${subtask.completed ? 'is-completed' : ''}`}>
      <label className="subtask__check">
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={onToggle}
          aria-label={`${subtask.completed ? 'Uncheck' : 'Check'} subtask`}
        />
        <span className="subtask__checkmark" aria-hidden="true" />
      </label>
      {isEditing ? (
        <input
          autoFocus
          type="text"
          className="subtask__edit"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') cancel()
          }}
          maxLength={120}
        />
      ) : (
        <span
          className="subtask__text"
          onDoubleClick={() => setIsEditing(true)}
          title="Double-click to edit"
        >
          {subtask.text}
        </span>
      )}
      <button
        type="button"
        className="icon-btn icon-btn--small icon-btn--danger"
        onClick={onDelete}
        aria-label="Delete subtask"
        title="Delete subtask"
      >
        ✕
      </button>
    </li>
  )
}
