import TodoItem from './TodoItem.jsx'

/**
 * TodoList
 * --------
 * Renders either the empty-state illustration or the filtered list.
 * The empty state now uses the AmplifyOps arrow mark instead of ✨.
 */
export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onSetPriority,
  filter,
}) {
  if (todos.length === 0) {
    return (
      <div className="empty-state" role="status">
        <img
          src={`${import.meta.env.BASE_URL}amplifyops-arrow.svg`}
          alt=""
          className="empty-state__icon"
          aria-hidden="true"
        />
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
          onSetPriority={onSetPriority}
        />
      ))}
    </ul>
  )
}

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
