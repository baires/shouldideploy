import React, { createContext, useState, useContext, useEffect } from 'react'
import en from '../locales/en.json'
import es from '../locales/es.json'
import esAR from '../locales/es-AR.json'
import pt from '../locales/pt.json'

type LocaleData = typeof en
type Language = string

const locales: Record<string, LocaleData> = {
  en,
  es,
  'es-AR': esAR,
  pt
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
  availableLanguages: string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

/**
 * Find the best matching language from available locales
 * Supports regional codes (e.g., 'es-AR') with fallback to base language (e.g., 'es')
 */
function findBestMatchingLanguage(lang: string): string {
  // 1. Try exact match (e.g., 'es-AR')
  if (locales[lang]) {
    return lang
  }

  // 2. Try base language (e.g., 'es' from 'es-AR')
  const baseLang = lang.split('-')[0]
  if (locales[baseLang]) {
    return baseLang
  }

  // 3. Fallback to English
  return 'en'
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang) {
      setLanguage(findBestMatchingLanguage(savedLang))
    } else {
      const browserLang = navigator.language
      setLanguage(findBestMatchingLanguage(browserLang))
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const getLocaleData = (lang: string): LocaleData => {
    // 1. Try exact match (e.g., 'es-MX')
    if (locales[lang]) {
      return locales[lang]
    }

    // 2. Try base language (e.g., 'es' from 'es-MX')
    const baseLang = lang.split('-')[0]
    if (locales[baseLang]) {
      return locales[baseLang]
    }

    // 3. Fallback to 'en'
    return locales['en']
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = getLocaleData(language)

    for (const k of keys) {
      if (value && typeof value === 'object' && value[k] !== undefined) {
        value = value[k]
      } else {
        return key
      }
    }
    return value
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        availableLanguages: Object.keys(locales)
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
