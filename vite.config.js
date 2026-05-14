import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — kept intentionally minimal.
// `base` is set so the app works correctly when deployed to GitHub Pages
// under a project subpath like `https://<user>.github.io/todo-app/`.
// Change "todo-app" if you rename the repo.
export default defineConfig({
  plugins: [react()],
  base: '/todo-app/',
})
