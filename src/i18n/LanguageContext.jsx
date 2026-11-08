import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { translations } from './translations'

// Current language (en or ar), the text direction, and the t() function that returns translated text.
const LanguageContext = createContext(null)
const STORAGE_KEY = 'powergrid-lang'

function loadLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ar') return saved
  } catch {
    /* storage unavailable */
  }
  return 'en'
}

// reads a nested key like "home.title" from an object
const lookup = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // update <html lang dir> so the browser lays the page out right-to-left for Arabic
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang, dir])

  // t('home.title') or t('providers.found', { n: 3 }) -> text in the current language
  const t = useCallback(
    (key, params = {}) => {
      const value = lookup(translations[lang], key) ?? lookup(translations.en, key) ?? key
      if (typeof value !== 'string') return value
      return value.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
    },
    [lang],
  )

  const toggle = () => setLang((l) => (l === 'en' ? 'ar' : 'en'))

  return (
    <LanguageContext.Provider value={{ lang, dir, t, setLang, toggle }}>{children}</LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
