import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { GeminiProvider } from './context/GeminiContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <GeminiProvider>
        <App />
      </GeminiProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
