import { useState } from 'react'

const DEFAULT_COLORS = [
  '#3b82f6', '#a855f7', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
]

export default function CategoryManager({ categories, onAdd, onUpdate, onDelete }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(DEFAULT_COLORS[0])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    onAdd(newName, newColor)
    setNewName('')
    const idx = DEFAULT_COLORS.indexOf(newColor)
    setNewColor(DEFAULT_COLORS[(idx + 1) % DEFAULT_COLORS.length])
  }

  return (
    <div className="category-manager">
      <button
        type="button"
        className="category-manager__toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <span>Categories ({categories.length})</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="category-manager__panel">
          <ul className="category-manager__list">
            {categories.length === 0 && (
              <li className="category-manager__empty">
                No categories yet — add your first one below.
              </li>
            )}
            {categories.map((c) => (
              <CategoryRow
                key={c.id}
                category={c}
                onUpdate={(updates) => onUpdate(c.id, updates)}
                onDelete={() => onDelete(c.id)}
              />
            ))}
          </ul>

          <form className="category-manager__form" onSubmit={handleAdd}>
            <div className="color-picker" role="radiogroup" aria-label="Category color">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={color === newColor}
                  className={`color-swatch ${color === newColor ? 'is-selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewColor(color)}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
            <div className="category-manager__form-row">
              <input
                type="text"
                placeholder="New category name…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="category-manager__input"
                maxLength={30}
              />
              <button
                type="submit"
                className="category-manager__add"
                disabled={!newName.trim()}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function CategoryRow({ category, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(category.name)

  const commit = () => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== category.name) onUpdate({ name: trimmed })
    else setDraftName(category.name)
    setIsEditing(false)
  }
  const cancel = () => { setDraftName(category.name); setIsEditing(false) }

  return (
    <li className="category-row">
      <span className="category-row__dot" style={{ backgroundColor: category.color }} aria-hidden="true" />
      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') cancel()
          }}
          className="category-row__input"
          maxLength={30}
        />
      ) : (
        <span
          className="category-row__name"
          onDoubleClick={() => setIsEditing(true)}
          title="Double-click to rename"
        >
          {category.name}
        </span>
      )}
      <div className="category-row__actions">
        <button
          type="button"
          className="icon-btn icon-btn--small"
          onClick={() => setIsEditing(true)}
          aria-label={`Rename ${category.name}`}
          title="Rename"
        >
          ✎
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--small icon-btn--danger"
          onClick={onDelete}
          aria-label={`Delete ${category.name}`}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </li>
  )
}
