import Time from './time'
import {
  REASONS_TO_DEPLOY,
  REASONS_TO_NOT_DEPLOY,
  REASONS_FOR_THURSDAY_AFTERNOON,
  REASONS_FOR_FRIDAY_AFTERNOON,
  REASONS_FOR_FRIDAY_13TH,
  REASONS_FOR_AFTERNOON,
  REASONS_FOR_WEEKEND,
  REASONS_FOR_DAY_BEFORE_CHRISTMAS,
  REASONS_FOR_CHRISTMAS,
  REASONS_NEW_YEAR
} from './reasons'
import { Theme } from './themes'
import { getTranslatedReasons } from './i18n-server'

export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.NODE_ENV === 'production')
    return 'https://shouldideploy.today'
  return `http://localhost:${process.env.PORT ?? 3001}`
}

export const shouldIDeploy = function (time: Time | null, date?: Date) {
  if (!time) {
    return false
  }

  const currentDate = time.getDate()

  if (date && currentDate.toDateString() !== date.toDateString()) {
    return false
  }

  return (
    !time.isFriday() &&
    !time.isWeekend() &&
    !time.isHolidays() &&
    !time.isAfternoon()
  )
}

export const shouldIDeployColorTheme = function (
  time: Time | null,
  theme?: string
) {
  const isDark = theme === Theme.Dark
  const canDeploy = shouldIDeploy(time)

  if (isDark) {
    return canDeploy
      ? '#121212'
      : 'linear-gradient(135deg, #4a0000 0%, #2b0000 100%)'
  }

  return canDeploy ? '#fff' : '#ff4136'
}

export const shouldIDeployFontTheme = function (
  time: Time | null,
  theme?: string
) {
  const isDark = theme === Theme.Dark
  const canDeploy = shouldIDeploy(time)

  if (isDark) {
    return canDeploy ? '#fff' : '#ffdad9'
  }

  return canDeploy ? '#111' : '#fff'
}

export const shouldIDeployFavIcon = function (time: Time | null) {
  return shouldIDeploy(time)
    ? `${getBaseUrl()}/dots.png`
    : `${getBaseUrl()}/dots-red.png`
}

export const getRandom = function ranDay(list: string | string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Return a list of reasons according of time parameter
 * @param time - Time object
 * @param lang - Optional language code for translations (defaults to English)
 * @returns string[]
 */
export function dayHelper(time: Time, lang?: string): string[] {
  time = time || new Time(time)

  // Default to English if no language specified
  const language = lang || 'en'

  if (time.isDayBeforeChristmas()) {
    return getTranslatedReasons('day_before_christmas', language)
  }

  if (time.isChristmas()) {
    return getTranslatedReasons('christmas', language)
  }

  if (time.isNewYear()) {
    return getTranslatedReasons('new_year', language)
  }

  if (time.isFriday13th()) {
    return getTranslatedReasons('friday_13th', language)
  }

  if (time.isFridayAfternoon()) {
    return getTranslatedReasons('friday_afternoon', language)
  }

  if (time.isFriday()) {
    return getTranslatedReasons('to_not_deploy', language)
  }

  if (time.isThursdayAfternoon()) {
    return getTranslatedReasons('thursday_afternoon', language)
  }

  if (time.isWeekend()) {
    return getTranslatedReasons('weekend', language)
  }

  if (time.isAfternoon()) {
    return getTranslatedReasons('afternoon', language)
  }

  return getTranslatedReasons('to_deploy', language)
}
