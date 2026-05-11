import {
  getBaseUrl,
  shouldIDeploy,
  shouldIDeployColorTheme,
  shouldIDeployFontTheme,
  shouldIDeployFavIcon,
  getRandom,
  dayHelper
} from '../helpers/constants'
import Time from '../helpers/time'
import { Theme } from '../helpers/themes'

describe('getBaseUrl', () => {
  const originalWindow = global.window
  const originalEnv = process.env

  beforeEach(() => {
    // @ts-ignore
    delete global.window
    process.env = { ...originalEnv }
    delete process.env.VERCEL_URL
    delete process.env.PORT
  })

  afterEach(() => {
    global.window = originalWindow
    process.env = originalEnv
  })

  it('returns empty string when window is defined', () => {
    // @ts-ignore
    global.window = {}
    expect(getBaseUrl()).toBe('')
  })

  it('returns Vercel URL when VERCEL_URL is set', () => {
    process.env.VERCEL_URL = 'shouldideploy.vercel.app'
    expect(getBaseUrl()).toBe('https://shouldideploy.vercel.app')
  })

  it('returns production URL in production', () => {
    process.env.NODE_ENV = 'production'
    expect(getBaseUrl()).toBe('https://shouldideploy.today')
  })

  it('returns localhost URL by default', () => {
    process.env.NODE_ENV = 'development'
    expect(getBaseUrl()).toBe('http://localhost:3001')
  })

  it('respects custom PORT', () => {
    process.env.NODE_ENV = 'development'
    process.env.PORT = '8080'
    expect(getBaseUrl()).toBe('http://localhost:8080')
  })
})

describe('shouldIDeploy', () => {
  afterEach(() => jest.useRealTimers())

  it('returns false for null time', () => {
    expect(shouldIDeploy(null)).toBe(false)
  })

  it('returns false when date does not match', () => {
    const time = new Time('UTC', '2023-01-09')
    const differentDate = new Date('2023-12-25T00:00:00Z')
    expect(shouldIDeploy(time, differentDate)).toBe(false)
  })

  it('returns true on a safe Monday morning', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    expect(shouldIDeploy(new Time('UTC'))).toBe(true)
  })

  it('returns false on Friday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(shouldIDeploy(new Time('UTC'))).toBe(false)
  })

  it('returns false in the afternoon', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T16:00:00Z'))
    expect(shouldIDeploy(new Time('UTC'))).toBe(false)
  })

  it('returns false on weekend', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-14T10:00:00Z'))
    expect(shouldIDeploy(new Time('UTC'))).toBe(false)
  })

  it('returns false on Christmas', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-25T10:00:00Z'))
    expect(shouldIDeploy(new Time('UTC'))).toBe(false)
  })
})

describe('shouldIDeployColorTheme', () => {
  afterEach(() => jest.useRealTimers())

  it('returns white for safe day in light theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    expect(shouldIDeployColorTheme(new Time('UTC'), Theme.Light)).toBe('#fff')
  })

  it('returns red for unsafe day in light theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(shouldIDeployColorTheme(new Time('UTC'), Theme.Light)).toBe('#ff4136')
  })

  it('returns dark bg for safe day in dark theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    expect(shouldIDeployColorTheme(new Time('UTC'), Theme.Dark)).toBe('#121212')
  })

  it('returns gradient for unsafe day in dark theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(shouldIDeployColorTheme(new Time('UTC'), Theme.Dark)).toBe(
      'linear-gradient(135deg, #4a0000 0%, #2b0000 100%)'
    )
  })
})

describe('shouldIDeployFontTheme', () => {
  afterEach(() => jest.useRealTimers())

  it('returns dark text for safe day in light theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    expect(shouldIDeployFontTheme(new Time('UTC'), Theme.Light)).toBe('#111')
  })

  it('returns white text for unsafe day in light theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(shouldIDeployFontTheme(new Time('UTC'), Theme.Light)).toBe('#fff')
  })

  it('returns white text for safe day in dark theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    expect(shouldIDeployFontTheme(new Time('UTC'), Theme.Dark)).toBe('#fff')
  })

  it('returns light red text for unsafe day in dark theme', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(shouldIDeployFontTheme(new Time('UTC'), Theme.Dark)).toBe('#ffdad9')
  })
})

describe('shouldIDeployFavIcon', () => {
  afterEach(() => jest.useRealTimers())

  it('returns dots.png on safe day', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    expect(shouldIDeployFavIcon(new Time('UTC'))).toContain('dots.png')
    expect(shouldIDeployFavIcon(new Time('UTC'))).not.toContain('dots-red')
  })

  it('returns dots-red.png on unsafe day', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(shouldIDeployFavIcon(new Time('UTC'))).toContain('dots-red.png')
  })
})

describe('getRandom', () => {
  it('returns an item from the array', () => {
    const list = ['a', 'b', 'c']
    expect(list).toContain(getRandom(list))
  })

  it('works with single item array', () => {
    expect(getRandom(['only'])).toBe('only')
  })
})

describe('dayHelper', () => {
  afterEach(() => jest.useRealTimers())

  it('returns to_deploy reasons on safe Monday morning', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns afternoon reasons on Monday afternoon', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T16:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns thursday_afternoon reasons on Thursday afternoon', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-12T16:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns friday reasons on Friday morning', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-06T10:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns friday_afternoon reasons on Friday afternoon', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-06T16:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns friday_13th reasons on Friday the 13th', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    expect(new Time('UTC').isFriday13th()).toBe(true)
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns weekend reasons on Saturday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-14T10:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns new_year reasons on New Year', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01T10:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns christmas reasons on Christmas', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-25T10:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('returns day_before_christmas reasons on Christmas Eve afternoon', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-24T16:00:00Z'))
    const reasons = dayHelper(new Time('UTC'))
    expect(Array.isArray(reasons)).toBe(true)
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('supports lang parameter', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const reasonsEn = dayHelper(new Time('UTC'), 'en')
    const reasonsEs = dayHelper(new Time('UTC'), 'es')
    expect(Array.isArray(reasonsEn)).toBe(true)
    expect(Array.isArray(reasonsEs)).toBe(true)
  })

  it('handles null time by creating new Time', () => {
    // @ts-ignore
    const reasons = dayHelper(null)
    expect(Array.isArray(reasons)).toBe(true)
  })
})
