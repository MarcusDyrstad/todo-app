import TodoItem from './TodoItem.jsx'

/**
 * TodoList
 * --------
 * Receives the already-filtered list from the parent and renders it.
 * Shows a friendly empty state depending on which filter is active.
 *
 * Note: we use `todo.id` as the React key — never the array index —
 * so React can correctly identify rows across reorders/edits.
 */
export default function TodoList({ todos, onToggle, onDelete, onEdit, filter }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state" role="status">
        <p className="empty-state__icon" aria-hidden="true">✨</p>
        <p className="empty-state__text">{getEmptyMessage(filter)}</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}

// Tiny helper kept outside the component so it isn't recreated each render.
function getEmptyMessage(filter) {
  switch (filter) {
    case 'active':
      return 'Nothing left to do. Nice work!'
    case 'completed':
      return 'No completed tasks yet.'
    default:
      return 'Your list is empty — add your first task above.'
  }
}
