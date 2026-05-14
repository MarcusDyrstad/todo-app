import { useEffect, useMemo, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilter from './components/TodoFilter.jsx'
import TodoStats from './components/TodoStats.jsx'
import SortControls from './components/SortControls.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import './styles/App.css'

// Priority ordering used by the "Priority" sort option.
// Lower number = higher in the sorted list.
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

/**
 * App — single source of truth for todos, filter, sort, and theme.
 */
export default function App() {
  // ----- State -----------------------------------------------------------

  const [todos, setTodos] = useLocalStorage('todos', [])
  const [filter, setFilter] = useLocalStorage('filter', 'all')
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'date-desc')
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [error, setError] = useState('')

  // ----- Theme: write the chosen theme onto <html data-theme="..."> ------
  // index.css reads this attribute to flip every design token at once.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // ----- CRUD handlers ---------------------------------------------------

  /** Add a new todo with validation. Priority defaults to 'medium'. */
  const addTodo = (text, priority = 'medium') => {
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

    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random())

    setTodos((prev) => [
      ...prev,
      {
        id,
        text: trimmed,
        completed: false,
        priority,
        createdAt: Date.now(),
      },
    ])
    return true
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

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

  /** Update a todo's priority (called when the user clicks the priority pill). */
  const setPriority = (id, priority) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t)),
    )
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  // ----- Derived state: filter + sort -----------------------------------

  const visibleTodos = useMemo(() => {
    // 1. Filter by tab
    let result = todos
    if (filter === 'active') result = result.filter((t) => !t.completed)
    if (filter === 'completed') result = result.filter((t) => t.completed)

    // 2. Sort (copy so we don't mutate state)
    const sorted = [...result]
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        break
      case 'alpha':
        sorted.sort((a, b) =>
          a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }),
        )
        break
      case 'priority':
        sorted.sort(
          (a, b) =>
            PRIORITY_ORDER[a.priority ?? 'medium'] -
            PRIORITY_ORDER[b.priority ?? 'medium'],
        )
        break
      case 'completion':
        // Incomplete first, then completed. Secondary sort by creation date.
        sorted.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1
          return (b.createdAt ?? 0) - (a.createdAt ?? 0)
        })
        break
      default:
        break
    }
    return sorted
  }, [todos, filter, sortBy])

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  )
  const completedCount = todos.length - activeCount

  // ----- Render ----------------------------------------------------------

  return (
    <main className="app">
      <header className="app__header">
        {/* AmplifyOps logo replaces the old "Todo List" gradient title.
            Lives in /public so Vite serves it from the site root. */}
        <img
          src={`${import.meta.env.BASE_URL}amplifyops-logo.svg`}
          alt="AmplifyOps Federal"
          className="app__logo"
        />
        <p className="app__subtitle">
          Stay on top of your day. Your tasks are saved automatically.
        </p>

        {/* Floating top-right theme toggle */}
        <div className="app__theme-toggle">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <section className="card">
        <TodoForm
          onAdd={addTodo}
          error={error}
          clearError={() => setError('')}
        />

        <TodoFilter
          filter={filter}
          setFilter={setFilter}
          counts={{
            all: todos.length,
            active: activeCount,
            completed: completedCount,
          }}
        />

        <SortControls sortBy={sortBy} setSortBy={setSortBy} />

        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onSetPriority={setPriority}
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
