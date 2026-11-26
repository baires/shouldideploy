import fs from 'fs'
import path from 'path'
import Time from '../helpers/time'
import { shouldIDeploy, dayHelper } from '../helpers/constants'
import { getTranslatedReasons } from '../helpers/i18n-server'
import { availableLanguages } from '../helpers/locale-loading'
import en from '../locales/en.json'

const at = (date: string, hour = 10) => {
  const time = new Time('UTC', date)
  time.customDate!.setHours(hour)
  return time
}

describe('Thanksgiving (fourth Thursday of November)', () => {
  it.each(['2023-11-23', '2024-11-28', '2025-11-27', '2026-11-26', '2029-11-22'])(
    '%s is Thanksgiving',
    (date) => {
      expect(at(date).isThanksgiving()).toBe(true)
    }
  )

  it.each([
    ['2026-11-19', 'third Thursday'],
    ['2029-11-29', 'fifth Thursday'],
    ['2026-11-27', 'the Friday after'],
    ['2026-10-22', 'a Thursday in October']
  ])('%s (%s) is not Thanksgiving', (date) => {
    expect(at(date).isThanksgiving()).toBe(false)
  })
})

describe('Black Friday (day after Thanksgiving)', () => {
  it.each(['2023-11-24', '2024-11-29', '2025-11-28', '2026-11-27', '2029-11-23'])(
    '%s is Black Friday',
    (date) => {
      expect(at(date).isBlackFriday()).toBe(true)
    }
  )

  it.each([
    ['2026-11-20', 'Friday before Thanksgiving'],
    ['2029-11-30', 'last Friday of November, a week after Thanksgiving'],
    ['2026-11-26', 'Thanksgiving']
  ])('%s (%s) is not Black Friday', (date) => {
    expect(at(date).isBlackFriday()).toBe(false)
  })
})

describe('Cyber Monday (Monday after Thanksgiving)', () => {
  it.each(['2023-11-27', '2024-12-02', '2025-12-01', '2026-11-30', '2029-11-26'])(
    '%s is Cyber Monday',
    (date) => {
      expect(at(date).isCyberMonday()).toBe(true)
    }
  )

  it.each([
    ['2026-11-23', 'Monday before Thanksgiving'],
    ['2026-12-07', 'a week after Cyber Monday'],
    ['2026-12-01', 'Tuesday after Cyber Monday']
  ])('%s (%s) is not Cyber Monday', (date) => {
    expect(at(date).isCyberMonday()).toBe(false)
  })
})

describe('shouldIDeploy on shopping holidays', () => {
  it.each([
    ['2026-11-26', 'Thanksgiving'],
    ['2026-11-27', 'Black Friday'],
    ['2026-11-30', 'Cyber Monday'],
    ['2024-12-02', 'Cyber Monday in December']
  ])('says no on %s (%s) morning', (date) => {
    expect(shouldIDeploy(at(date, 9))).toBe(false)
  })

  it('still says yes on a regular Monday morning after the season', () => {
    expect(shouldIDeploy(at('2026-12-07', 9))).toBe(true)
  })
})

describe('dayHelper on shopping holidays', () => {
  it.each([
    ['2026-11-26', 10, 'thanksgiving'],
    ['2026-11-26', 17, 'thanksgiving'],
    ['2026-11-27', 10, 'black_friday'],
    ['2026-11-27', 17, 'black_friday'],
    ['2026-11-30', 10, 'cyber_monday']
  ] as const)('%s at %s:00 uses %s reasons', (date, hour, key) => {
    expect(dayHelper(at(date, hour), 'en')).toEqual(en.reasons[key])
  })
})

describe('shopping holiday translations', () => {
  it.each(availableLanguages)('%s has every shopping holiday key', (lang) => {
    for (const key of ['thanksgiving', 'black_friday', 'cyber_monday']) {
      const reasons = getTranslatedReasons(key, lang)
      const own = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../locales', `${lang}.json`), 'utf8')
      ).reasons[key]
      expect(Array.isArray(own)).toBe(true)
      expect(own.length).toBeGreaterThan(0)
      expect(reasons).toEqual(own)
    }
  })
})
