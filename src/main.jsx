import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Entry point — React 18's `createRoot` enables concurrent features
// (e.g. automatic batching, transitions). StrictMode helps catch bugs
// like unsafe lifecycles and accidental side effects during development.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
