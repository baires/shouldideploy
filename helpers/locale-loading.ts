import en from '../locales/en.json'

export type LocaleData = typeof en

// Keep English in the initial bundle; fetch just the chosen translation.
const loaders: Record<string, () => Promise<{ default: LocaleData }>> = {
  es: () => import('../locales/es.json'),
  'es-AR': () => import('../locales/es-AR.json'),
  pt: () => import('../locales/pt.json'),
  cs: () => import('../locales/cs.json'),
  sl: () => import('../locales/sl.json'),
  el: () => import('../locales/el.json'),
  bg: () => import('../locales/bg.json'),
}

export const availableLanguages = ['en', ...Object.keys(loaders)]
export const englishLocale = { language: 'en', messages: en }

export async function loadLocale(requested: string) {
  const language = availableLanguages.includes(requested)
    ? requested
    : availableLanguages.includes(requested.split('-')[0])
      ? requested.split('-')[0]
      : 'en'
  return language === 'en'
    ? englishLocale
    : { language, messages: (await loaders[language]()).default }
}
