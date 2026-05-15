import { createContext, useContext, useState } from 'react'
import translations from './translations.js'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('fr')
  const langues = Object.keys(translations)

  const t = (key) => translations[lang]?.[key] || translations['fr'][key] || key

  const ajouterLangue = (code, traductions) => {
    translations[code] = traductions
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t, langues, ajouterLangue }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)