import React, {
  createContext, useState, useContext, useEffect, useCallback, useMemo, useRef
} from 'react'
import { availableLanguages, englishLocale, loadLocale } from './locale-loading'

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => any
  availableLanguages: string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(englishLocale)
  const requestId = useRef(0)

  const changeLanguage = useCallback(async (language: string) => {
    const currentRequest = ++requestId.current
    try {
      const nextLocale = await loadLocale(language)
      // An earlier, slower download must not override a later selection.
      if (currentRequest !== requestId.current) return
      setLocale(nextLocale)
      localStorage.setItem('language', nextLocale.language)
    } catch {
      // Keep the current translation if the selected chunk cannot be fetched.
    }
  }, [])

  useEffect(() => {
    void changeLanguage(localStorage.getItem('language') || navigator.language)
    return () => {
      requestId.current++
    }
  }, [changeLanguage])

  const t = useCallback((key: string) => {
    let value: any = locale.messages
    for (const part of key.split('.')) {
      if (value && typeof value === 'object' && value[part] !== undefined) {
        value = value[part]
      } else {
        return key
      }
    }
    return value
  }, [locale.messages])

  const context = useMemo(() => ({
    language: locale.language,
    setLanguage: changeLanguage,
    t,
    availableLanguages,
  }), [locale.language, changeLanguage, t])

  return <LanguageContext.Provider value={context}>{children}</LanguageContext.Provider>
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider')
  return context
}
