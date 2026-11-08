import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PowerProvider } from './context/PowerContext'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <PowerProvider>
          <App />
        </PowerProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
