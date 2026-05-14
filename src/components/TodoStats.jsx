/*
  TodoStats — bottom footer of the card.
  Shows the active-items counter and a "Clear completed" button.
*/
export default function TodoStats({
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <div className="todo-stats">
      <span className="todo-stats__counter">
        <strong>{activeCount}</strong>{' '}
        {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <button
        type="button"
        className="todo-stats__clear"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
        {completedCount > 0 && ` (${completedCount})`}
      </button>
    </div>
  )
}
