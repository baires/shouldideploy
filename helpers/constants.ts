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

export const shouldIDeployColorTheme = function (time: Time | null) {
  return shouldIDeploy(time) ? '#36a64f' : '#ff4136'
}

export const shouldIDeployFontTheme = function (time: Time | null) {
  return shouldIDeploy(time) ? '#fff' : '#111'
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
 * @param string[]
 */
export function dayHelper(time: Time) {
  time = time || new Time(time)

  if (time.isDayBeforeChristmas()) {
    return REASONS_FOR_DAY_BEFORE_CHRISTMAS
  }

  if (time.isChristmas()) {
    return REASONS_FOR_CHRISTMAS
  }

  if (time.isNewYear()) {
    return REASONS_NEW_YEAR
  }

  if (time.isFriday13th()) {
    return REASONS_FOR_FRIDAY_13TH
  }

  if (time.isFridayAfternoon()) {
    return REASONS_FOR_FRIDAY_AFTERNOON
  }

  if (time.isFriday()) {
    return REASONS_TO_NOT_DEPLOY
  }

  if (time.isThursdayAfternoon()) {
    return REASONS_FOR_THURSDAY_AFTERNOON
  }

  if (time.isWeekend()) {
    return REASONS_FOR_WEEKEND
  }

  if (time.isAfternoon()) {
    return REASONS_FOR_AFTERNOON
  }

  return REASONS_TO_DEPLOY
}
