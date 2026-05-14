import TodoItem from './TodoItem.jsx'

export default function TodoList({
  todos,
  categories,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtaskText,
  filter,
}) {
  if (todos.length === 0) {
    return (
      <div className="empty-state" role="status">
        <AmplifyOpsArrow />
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
          categories={categories}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onUpdateSubtaskText={onUpdateSubtaskText}
        />
      ))}
    </ul>
  )
}

// Inline SVG so the empty-state logo always renders regardless of file paths.
function AmplifyOpsArrow() {
  return (
    <svg
      viewBox="0 0 200 200"
      width="64"
      height="64"
      className="empty-state__icon"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AmplifyOps"
    >
      <polygon points="10,60 185,18 110,195"  fill="#F8B62D" />
      <polygon points="68,80 175,32 117,180"  fill="#F37021" />
      <polygon points="108,100 158,60 130,160" fill="#C7281C" />
    </svg>
  )
}

function getEmptyMessage(filter) {
  switch (filter) {
    case 'active':    return 'Nothing left to do. Nice work!'
    case 'completed': return 'No completed tasks yet.'
    default:          return 'Your list is empty — add your first task above.'
  }
}
