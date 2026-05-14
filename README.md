# Todo List — React + Vite

A polished, accessible Todo List app with localStorage persistence. Built as a portfolio / internship submission piece to demonstrate clean component structure and modern React best practices.

## Features

- Add, edit, complete, and delete tasks
- Filter by All / Active / Completed (filter is also persisted)
- Bulk-clear completed tasks
- Live task counter
- Input validation with inline error messaging
- Automatic localStorage persistence via a reusable custom hook
- Responsive layout with automatic light / dark theming

## Tech stack — and why

| Tool | Why it was chosen |
|------|-------------------|
| **React 18** | Industry standard for component-based UI. Hooks make state and side effects easy to express. |
| **Vite** | Near-instant dev server (native ESM, no bundling on save) and a tiny, modern production build. Replaces Create React App, which is no longer maintained. |
| **JavaScript (JSX)** | Per the brief. TypeScript would be the production choice, but JS keeps the focus on React fundamentals. |
| **localStorage** | Persists data without a backend. Wrapped in a custom hook so the storage layer can be swapped later. |
| **Plain CSS + design tokens** | Keeps the bundle tiny and the styling readable. CSS variables make light/dark themes trivial. No Tailwind / styled-components dependency. |

## Folder structure

```
todo-app/
├── public/
├── src/
│   ├── components/
│   │   ├── TodoForm.jsx        # Controlled input + submit
│   │   ├── TodoItem.jsx        # Single row, handles inline edit mode
│   │   ├── TodoList.jsx        # Renders items or empty state
│   │   ├── TodoFilter.jsx      # All / Active / Completed tabs
│   │   └── TodoStats.jsx       # Counter + "Clear completed"
│   ├── hooks/
│   │   └── useLocalStorage.js  # Reusable persistence hook
│   ├── styles/
│   │   └── App.css             # Component styles
│   ├── App.jsx                 # Top-level state + composition
│   ├── main.jsx                # ReactDOM entry point
│   └── index.css               # Resets + design tokens
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload at http://localhost:5173)
npm run dev

# 3. Build for production (outputs to ./dist)
npm run build

# 4. Preview the production build locally
npm run preview
```

## Deploying to GitHub Pages

1. Create a new public repository on GitHub named **`todo-app`** (or anything you like — just update `base` in `vite.config.js` to match the repo name).
2. From the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: todo list app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/todo-app.git
   git push -u origin main
   ```
3. Install the GitHub Pages helper (already listed in `package.json` as a dev dep):
   ```bash
   npm install
   ```
4. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```
   This pushes the `dist/` folder to a `gh-pages` branch.
5. In GitHub: **Settings → Pages → Source = `gh-pages` branch**. Your app will be live at:
   `https://<your-username>.github.io/todo-app/`

## State management notes

State is intentionally kept simple:

- The single source of truth lives in `App.jsx` (`todos`, `filter`).
- All mutations happen via small, named handlers passed as props.
- `useMemo` memoizes derived data (the filtered list and counts).
- Persistence is isolated in `useLocalStorage`, so swapping to a backend later only changes one file.

Redux / Zustand / Context would be overkill for a tree this small.
