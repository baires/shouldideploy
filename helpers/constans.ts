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
import { titles } from './titles'

export const HOST = 'https://shouldideploy.today'

export const shouldIDeploy = function (time: Time | null, date?: Date) {
  if (!time) {
    return false
  }

  const currentDate = time.getDate()

  if (date && currentDate.toDateString() !== date.toDateString()) {
    return false
  }

  return !time.isFriday() && !time.isWeekend() && !time.isHolidays()
}

export const shouldIDeployAnswerImage = function (time: Time | null) {
  return shouldIDeploy(time) ? `${HOST}/yes.png` : `${HOST}/no.png`
}

export const shouldIDeployColorTheme = function (time: Time | null) {
  return shouldIDeploy(time) ? '#36a64f' : '#ff4136'
}

export const shouldIDeployFavIcon = function (time: Time | null) {
  return shouldIDeploy(time) ? `${HOST}/dots.png` : `${HOST}/dots-red.png`
}

export const shouldIDeployTitle = (language: string | undefined) => {
  language = language || 'en';

  return titles.filter(x => x.key === language)[0].value;
}

export const getRandom = function ranDay(list: string | string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Return a list of reasons according of time parameter and language
 * @param time Time
 * @param language string
 */
export function dayHelper(time: Time, language: string) {
  time = time || new Time(time);
  language = language || 'en';

  if (time.isDayBeforeChristmas()) {
    return REASONS_FOR_DAY_BEFORE_CHRISTMAS.filter(x => x.key === language)[0].values;
  }

  if (time.isChristmas()) {
    return REASONS_FOR_CHRISTMAS.filter(x => x.key === language)[0].values;
  }

  if (time.isNewYear()) {
    return REASONS_NEW_YEAR.filter(x => x.key === language)[0].values;
  }

  if (time.isFriday13th()) {
    return REASONS_FOR_FRIDAY_13TH.filter(x => x.key === language)[0].values;
  }

  if (time.isFridayAfternoon()) {
    return REASONS_FOR_FRIDAY_AFTERNOON.filter(x => x.key === language)[0].values;
  }

  if (time.isFriday()) {
    return REASONS_TO_NOT_DEPLOY.filter(x => x.key === language)[0].values;
  }

  if (time.isThursdayAfternoon()) {
    return REASONS_FOR_THURSDAY_AFTERNOON.filter(x => x.key === language)[0].values;
  }

  if (time.isAfternoon() && !time.isWeekend()) {
    return REASONS_FOR_AFTERNOON.filter(x => x.key === language)[0].values;
  }

  if (time.isWeekend()) {
    return REASONS_FOR_WEEKEND.filter(x => x.key === language)[0].values;
  }

  return REASONS_TO_DEPLOY.filter(x => x.key === language)[0].values;
}
