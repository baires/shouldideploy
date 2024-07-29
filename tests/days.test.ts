import Time from '../helpers/time'

describe('Time class', () => {
  // Helper function to mock the Date class
  function mockDate(dateString: string) {
    const date = new Date(dateString)
    jest.spyOn(global, 'Date').mockImplementation(() => date)
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('isThursday', () => {
    mockDate('2023-03-30T00:00:00') // Thursday, March 30th, 2023
    const time = new Time('UTC')
    expect(time.isThursday()).toBe(true)
  })

  it('isFriday', () => {
    mockDate('2023-03-31T00:00:00') // Friday, March 31st, 2023
    const time = new Time('UTC')
    expect(time.isFriday()).toBe(true)
  })
  it('is13th', () => {
    mockDate('2023-03-13T00:00:00') // March 13th, 2023
    const time = new Time('UTC')
    expect(time.is13th()).toBe(true)
  })

  it('isAfternoon', () => {
    mockDate('2023-03-30T17:00:00') // March 30th, 2023, 17:00 (5 PM)
    const time = new Time('UTC')
    expect(time.isAfternoon()).toBe(true)
  })

  it('isThursdayAfternoon', () => {
    mockDate('2023-03-30T17:00:00') // Thursday, March 30th, 2023, 17:00 (5 PM)
    const time = new Time('UTC')
    expect(time.isThursdayAfternoon()).toBe(true)
  })

  it('isFridayAfternoon', () => {
    mockDate('2023-03-31T17:00:00') // Friday, March 31st, 2023, 17:00 (5 PM)
    const time = new Time('UTC')
    expect(time.isFridayAfternoon()).toBe(true)
  })

  it('isFriday13th', () => {
    mockDate('2023-10-13T00:00:00') // Friday, October 13th, 2023
    const time = new Time('UTC')
    expect(time.isFriday13th()).toBe(true)
  })

  it('isWeekend', () => {
    mockDate('2023-04-01T00:00:00') // Saturday, April 1st, 2023
    const time = new Time('UTC')
    expect(time.isWeekend()).toBe(true)
  })

  it('isDayBeforeChristmas', () => {
    mockDate('2023-12-24T17:00:00') // December 24th, 2023, 17:00 (5 PM)
    const time = new Time('UTC')
    expect(time.isDayBeforeChristmas()).toBe(true)
  })

  it('isChristmas', () => {
    mockDate('2023-12-25T00:00:00') // December 25th, 2023
    const time = new Time('UTC')
    expect(time.isChristmas()).toBe(true)
  })

  it('isNewYear', () => {
    mockDate('2023-12-31T17:00:00') // December 31st, 2023, 17:00 (5 PM)
    const time = new Time('UTC')
    expect(time.isNewYear()).toBe(true)

    mockDate('2024-01-01T00:00:00') // January 1st, 2024
    const time2 = new Time('UTC')
    expect(time2.isNewYear()).toBe(true)
  })

  it('isHolidays', () => {
    mockDate('2023-12-24T17:00:00') // December 24th, 2023, 17:00 (5 PM)
    const time = new Time('UTC')
    expect(time.isHolidays()).toBe(true)

    mockDate('2023-12-25T00:00:00') // December 25th, 2023
    const time2 = new Time('UTC')
    expect(time2.isHolidays()).toBe(true)

    mockDate('2023-12-31T17:00:00') // December 31st, 2023, 17:00 (5 PM)
    const time3 = new Time('UTC')
    expect(time3.isHolidays()).toBe(true)

    mockDate('2024-01-01T00:00:00') // January 1st, 2024
    const time4 = new Time('UTC')
    expect(time4.isHolidays()).toBe(true)
  })
  it('setTimezone - valid timezone', () => {
    const time = new Time('UTC')
    time.setTimezone('America/New_York')
    expect(time.timezone).toBe('America/New_York')
  })

  it('setTimezone - invalid timezone', () => {
    const time = new Time('UTC')
    time.setTimezone('Invalid/Timezone')
    expect(time.timezone).toBe('UTC') // should remain unchanged
  })

  it('validOrNull - valid timezone', () => {
    const time = Time.validOrNull('America/New_York')
    expect(time).not.toBeNull()
    expect(time?.timezone).toBe('America/New_York')
  })

  it('validOrNull - invalid timezone', () => {
    const time = Time.validOrNull('Invalid/Timezone')
    expect(time).toBeNull()
  })

  it('validOrNull - null timezone', () => {
    const time = Time.validOrNull(null)
    expect(time).not.toBeNull()
    expect(time?.timezone).toBe(Time.DEFAULT_TIMEZONE)
  })

  it('isAfternoon - exactly 16:00', () => {
    mockDate('2023-03-30T16:00:00') // March 30th, 2023, 16:00 (4 PM)
    const time = new Time('UTC')
    expect(time.isAfternoon()).toBe(true)
  })

  it('isThursdayAfternoon - exactly 16:00', () => {
    mockDate('2023-03-30T16:00:00') // Thursday, March 30th, 2023, 16:00 (4 PM)
    const time = new Time('UTC')
    expect(time.isThursdayAfternoon()).toBe(true)
  })

  it('isFridayAfternoon - exactly 16:00', () => {
    mockDate('2023-03-31T16:00:00') // Friday, March 31st, 2023, 16:00 (4 PM)
    const time = new Time('UTC')
    expect(time.isFridayAfternoon()).toBe(true)
  })

  it('isNewYear - exactly 16:00 on Dec 31st', () => {
    mockDate('2023-12-31T16:00:00') // December 31st, 2023, 16:00 (4 PM)
    const time = new Time('UTC')
    expect(time.isNewYear()).toBe(true)
  })

  it('isNewYear - exactly midnight on Jan 1st', () => {
    mockDate('2024-01-01T00:00:00') // January 1st, 2024, 00:00 (midnight)
    const time = new Time('UTC')
    expect(time.isNewYear()).toBe(true)
  })
})
