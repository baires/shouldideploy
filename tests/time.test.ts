import Time from '../helpers/time'

describe('Time Class', () => {
  test('should correctly identify timezone existence', () => {
    expect(Time.zoneExists('America/Argentina/Buenos_Aires')).toBe(true)
    expect(Time.zoneExists('Invalid/Timezone')).toBe(false)
  })

  test('should return correct day based on custom date and timezone', () => {
    const time1 = new Time('UTC', '2023-03-31')
    const time2 = new Time('America/Argentina/Buenos_Aires', '2023-03-31')

    expect(time1.isFriday()).toBe(true)
    expect(time2.isFriday()).toBe(true)
  })

  test('should return shouldideploy status based on custom date and timezone', () => {
    const time1 = new Time('UTC', '2023-03-31')
    const time2 = new Time('America/Argentina/Buenos_Aires', '2023-03-31')

    expect(time1.isFriday()).toBe(true)
    expect(time2.isFriday()).toBe(true)
  })

  it('should change timezone if valid timezone is provided', () => {
    const time = new Time()
    const newTimezone = 'Asia/Tokyo'
    time.setTimezone(newTimezone)
    expect(time.timezone).toBe(newTimezone)
  })

  it('should not change timezone if invalid timezone is provided', () => {
    const initialTimezone = 'UTC'
    const time = new Time(initialTimezone)
    time.setTimezone('Invalid/Timezone')
    expect(time.timezone).toBe(initialTimezone)
  })

  it('should return the custom date if set', () => {
    const customDate = '2023-01-01'
    const utcDate = new Date(customDate + 'T00:00:00Z')
    const offset = utcDate.getTimezoneOffset() * 60 * 1000
    const expectedDate = new Date(utcDate.getTime() + offset)
    const time = new Time(null, customDate)
    expect(time.getDate()).toEqual(expectedDate)
  })

  it('should return the current date in the specified timezone', () => {
    const timezone = 'America/New_York'
    const time = new Time(timezone)
    expect(time.getDate()).toBeInstanceOf(Date)
  })

  it('should return true for a valid timezone', () => {
    expect(Time.zoneExists('Europe/London')).toBeTruthy()
  })

  it('should return false for an invalid timezone', () => {
    expect(Time.zoneExists('Invalid/Timezone')).toBeFalsy()
  })

  it('should return a Time instance for valid timezone or null otherwise', () => {
    expect(Time.validOrNull('Europe/London')).toBeInstanceOf(Time)
    expect(Time.validOrNull('Invalid/Timezone')).toBeNull()
  })

  describe('Day Check Methods', () => {
    let time: Time
    beforeEach(() => {
      time = new Time(null, '2023-01-05')
    })

    it('should correctly identify Thursdays', () => {
      expect(time.isThursday()).toBeTruthy()
      expect(time.isFriday()).toBeFalsy()
    })
  })

  describe('Holiday Check Methods', () => {
    let time = new Time(null, '2023-01-05')
    beforeEach(() => {
      time = new Time(null, '2023-12-25')
    })

    it('should correctly identify Christmas', () => {
      expect(time.isChristmas()).toBeTruthy()
      expect(time.isDayBeforeChristmas()).toBeFalsy()
    })
  })
})
