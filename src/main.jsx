import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PowerProvider } from './context/PowerContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PowerProvider>
        <App />
      </PowerProvider>
    </BrowserRouter>
  </StrictMode>,
)