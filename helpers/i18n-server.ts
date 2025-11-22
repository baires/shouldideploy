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

/**
 * Get locale data with fallback support
 * Supports regional codes (e.g., 'es-AR') with fallback to base language (e.g., 'es')
 * @param lang - language code
 * @returns LocaleData
 */
function getLocaleData(lang: string): LocaleData {
  // 1. Try exact match (e.g., 'es-AR')
  if (locales[lang]) {
    return locales[lang]
  }

  // 2. Try base language (e.g., 'es' from 'es-AR')
  const baseLang = lang.split('-')[0]
  if (locales[baseLang]) {
    return locales[baseLang]
  }

  // 3. Fallback to English
  return locales.en
}

/**
 * Server-side translation function
 * @param key - dot-notation key like 'reasons.to_deploy'
 * @param lang - language code (defaults to 'en'). Supports regional codes like 'es-AR'
 * @returns translated value or falls back to base language or English
 */
export function translate(key: string, lang?: string): any {
  const language = lang || 'en'

  const keys = key.split('.')
  let value: any = getLocaleData(language)

  for (const k of keys) {
    if (value && typeof value === 'object' && value[k] !== undefined) {
      value = value[k]
    } else {
      // Fallback to English if translation not found
      let fallbackValue: any = locales.en
      for (const fk of keys) {
        if (
          fallbackValue &&
          typeof fallbackValue === 'object' &&
          fallbackValue[fk] !== undefined
        ) {
          fallbackValue = fallbackValue[fk]
        } else {
          return key
        }
      }
      return fallbackValue
    }
  }

  return value
}

/**
 * Get reasons array by type with translation support
 */
export function getTranslatedReasons(
  reasonType: string,
  lang?: string
): string[] {
  return translate(`reasons.${reasonType}`, lang)
}
