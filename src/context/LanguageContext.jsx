import { createContext, useContext, useState } from 'react'
import strings from '../i18n/strings'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ur')

  const toggle = () => setLang(l => {
    const next = l === 'ur' ? 'en' : 'ur'
    localStorage.setItem('lang', next)
    return next
  })

  const t = key => strings[lang]?.[key] ?? strings.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
