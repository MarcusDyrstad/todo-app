import { useMemo, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilter from './components/TodoFilter.jsx'
import TodoStats from './components/TodoStats.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import './styles/App.css'

/**
 * App
 * ----
 * The single source of truth for todo state lives here.
 *
 * State management choice:
 *   • For an app this size, `useState` (lifted up + passed via props)
 *     is the simplest correct answer.
 *   • Redux / Zustand / Context would be overkill — they shine when
 *     state is shared by *deeply* nested components or many unrelated
 *     trees. Here the tree is one level deep.
 *   • `useMemo` is used for derived data (filtered list, counts) so
 *     we don't recompute on unrelated re-renders.
 */
export default function App() {
  // The canonical list of todos. Each todo: { id, text, completed }.
  const [todos, setTodos] = useLocalStorage('todos', [])

  // Current filter. Persisted so the user's choice survives refreshes.
  const [filter, setFilter] = useLocalStorage('filter', 'all')

  // Validation error shown under the input.
  const [error, setError] = useState('')

  // ----- CRUD handlers ---------------------------------------------------

  /** Add a new todo with basic validation. */
  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Task cannot be empty.')
      return false
    }
    if (trimmed.length > 200) {
      setError('Task is too long (max 200 characters).')
      return false
    }
    setError('')

    // crypto.randomUUID() gives us collision-safe IDs in modern browsers.
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random())

    setTodos((prev) => [
      ...prev,
      { id, text: trimmed, completed: false, createdAt: Date.now() },
    ])
    return true
  }

  /** Toggle a todo's completed flag. */
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  /** Delete a single todo. */
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  /** Edit a todo's text. Empty edits delete the todo (classic UX). */
  const editTodo = (id, newText) => {
    const trimmed = newText.trim()
    if (!trimmed) {
      deleteTodo(id)
      return
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
    )
  }

  /** Bulk-remove anything currently completed. */
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  // ----- Derived state ---------------------------------------------------

  // Memoize the filtered list — only recomputes when `todos` or `filter`
  // changes. Avoids unnecessary work on each parent render.
  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  )
  const completedCount = todos.length - activeCount

  // ----- Render ----------------------------------------------------------

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Todo List</h1>
        <p className="app__subtitle">
          Stay on top of your day. Your tasks are saved automatically.
        </p>
      </header>

      <section className="card">
        <TodoForm onAdd={addTodo} error={error} clearError={() => setError('')} />

        <TodoFilter
          filter={filter}
          setFilter={setFilter}
          counts={{ all: todos.length, active: activeCount, completed: completedCount }}
        />

        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          filter={filter}
        />

        <TodoStats
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      </section>

      <footer className="app__footer">
        Built with React + Vite — data stays in your browser.
      </footer>
    </main>
  )
}
