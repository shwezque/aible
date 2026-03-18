import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from './hooks/useStore'
import { ThemeProvider } from './hooks/useTheme.jsx'
import './index.css'
import App from './App.jsx'

// Load Inter font
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
document.head.appendChild(link)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
