import { useEffect, useMemo, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilter from './components/TodoFilter.jsx'
import TodoStats from './components/TodoStats.jsx'
import SortControls from './components/SortControls.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import CategoryManager from './components/CategoryManager.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import './styles/App.css'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const DEFAULT_CATEGORIES = [
  { id: 'cat-work',     name: 'Work',     color: '#3b82f6' },
  { id: 'cat-personal', name: 'Personal', color: '#a855f7' },
  { id: 'cat-errands',  name: 'Errands',  color: '#10b981' },
]

export default function App() {
  const [todos, setTodos]           = useLocalStorage('todos', [])
  const [categories, setCategories] = useLocalStorage('categories', DEFAULT_CATEGORIES)
  const [filter, setFilter]         = useLocalStorage('filter', 'all')
  const [sortBy, setSortBy]         = useLocalStorage('sortBy', 'date-desc')
  const [theme, setTheme]           = useLocalStorage('theme', 'light')
  const [error, setError] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const newId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now() + Math.random())

  // ----- Todo CRUD -----
  const addTodo = ({
    text,
    priority = 'medium',
    categoryId = null,
    dueDate = null,
    description = '',
  }) => {
    const trimmed = text.trim()
    if (!trimmed) { setError('Task cannot be empty.'); return false }
    if (trimmed.length > 200) { setError('Task is too long (max 200 characters).'); return false }
    setError('')
    setTodos((prev) => [
      ...prev,
      {
        id: newId(),
        text: trimmed,
        description: description.trim(),
        completed: false,
        priority,
        categoryId,
        dueDate,
        subtasks: [],
        createdAt: Date.now(),
      },
    ])
    return true
  }

  const updateTodo = (id, updates) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }
  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  // ----- Subtask handlers -----
  const addSubtask = (todoId, text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const subtask = { id: newId(), text: trimmed, completed: false }
    setTodos((prev) => prev.map((t) =>
      t.id === todoId ? { ...t, subtasks: [...(t.subtasks || []), subtask] } : t,
    ))
  }
  const toggleSubtask = (todoId, subtaskId) => {
    setTodos((prev) => prev.map((t) =>
      t.id === todoId
        ? { ...t, subtasks: (t.subtasks || []).map((s) => s.id === subtaskId ? { ...s, completed: !s.completed } : s) }
        : t,
    ))
  }
  const deleteSubtask = (todoId, subtaskId) => {
    setTodos((prev) => prev.map((t) =>
      t.id === todoId ? { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId) } : t,
    ))
  }
  const updateSubtaskText = (todoId, subtaskId, text) => {
    const trimmed = text.trim()
    if (!trimmed) { deleteSubtask(todoId, subtaskId); return }
    setTodos((prev) => prev.map((t) =>
      t.id === todoId
        ? { ...t, subtasks: (t.subtasks || []).map((s) => s.id === subtaskId ? { ...s, text: trimmed } : s) }
        : t,
    ))
  }

  // ----- Category CRUD -----
  const addCategory = (name, color) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const id = newId()
    setCategories((prev) => [...prev, { id, name: trimmed, color }])
    return id
  }
  const updateCategory = (id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }
  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setTodos((prev) => prev.map((t) => (t.categoryId === id ? { ...t, categoryId: null } : t)))
  }

  // ----- Derived: filter THEN sort -----
  const visibleTodos = useMemo(() => {
    let result = todos
    if (filter === 'active')    result = result.filter((t) => !t.completed)
    if (filter === 'completed') result = result.filter((t) =>  t.completed)

    const sorted = [...result]
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)); break
      case 'due-date':
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        }); break
      case 'alpha':
        sorted.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' })); break
      case 'priority':
        sorted.sort((a, b) =>
          PRIORITY_ORDER[a.priority ?? 'medium'] - PRIORITY_ORDER[b.priority ?? 'medium']); break
      case 'completion':
        sorted.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1
          return (b.createdAt ?? 0) - (a.createdAt ?? 0)
        }); break
      default: break
    }
    return sorted
  }, [todos, filter, sortBy])

  const activeCount    = useMemo(() => todos.filter((t) => !t.completed).length, [todos])
  const completedCount = todos.length - activeCount

  return (
    <main className="app">
      <header className="app__header">
        <img
          src={`${import.meta.env.BASE_URL}amplifyops-logo.svg`}
          alt="AmplifyOps Federal"
          className="app__logo"
        />
        <p className="app__subtitle">
          Stay on top of your day. Your tasks are saved automatically.
        </p>
        <div className="app__theme-toggle">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <section className="card">
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
        />
        <TodoForm
          onAdd={addTodo}
          error={error}
          clearError={() => setError('')}
          categories={categories}
        />
        <TodoFilter
          filter={filter}
          setFilter={setFilter}
          counts={{ all: todos.length, active: activeCount, completed: completedCount }}
        />
        <SortControls sortBy={sortBy} setSortBy={setSortBy} />
        <TodoList
          todos={visibleTodos}
          categories={categories}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
          onUpdateSubtaskText={updateSubtaskText}
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
