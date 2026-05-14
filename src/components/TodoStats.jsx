/**
 * TodoStats
 * ---------
 * Footer of the card. Shows how many items are left and offers the
 * "Clear completed" action. Pluralization is handled inline.
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
        // Disabled when there's nothing to clear — prevents no-op clicks.
        disabled={completedCount === 0}
      >
        Clear completed
        {completedCount > 0 && ` (${completedCount})`}
      </button>
    </div>
  )
}
