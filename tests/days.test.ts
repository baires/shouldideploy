import Time from '../helpers/time'

describe('Time class', () => {
  let time: Time

  beforeEach(() => {
    // Set the timezone to UTC for all tests
    time = new Time('UTC')
  })

  describe('isThursday()', () => {
    it('returns true if today is Thursday', () => {
      const date = new Date('March 30, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isThursday()).toBe(true)
    })

    it('returns false if today is not Thursday', () => {
      const date = new Date('March 29, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isThursday()).toBe(false)
    })
  })

  describe('isFriday()', () => {
    it('returns true if today is Friday', () => {
      const date = new Date('March 31, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isFriday()).toBe(true)
    })

    it('returns false if today is not Friday', () => {
      const date = new Date('March 30, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isFriday()).toBe(false)
    })
  })

  describe('is13th()', () => {
    it('returns true if today is the 13th of the month', () => {
      const date = new Date('April 13, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.is13th()).toBe(true)
    })

    it('returns false if today is not the 13th of the month', () => {
      const date = new Date('April 14, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.is13th()).toBe(false)
    })
  })

  describe('isAfternoon()', () => {
    it('returns true if it is afternoon', () => {
      const date = new Date('April 1, 2023 16:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isAfternoon()).toBe(true)
    })

    it('returns false if it is not afternoon', () => {
      const date = new Date('April 1, 2023 10:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isAfternoon()).toBe(false)
    })
  })

  describe('isThursdayAfternoon()', () => {
    it('returns true if today is Thursday afternoon', () => {
      const date = new Date('March 30, 2023 16:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isThursdayAfternoon()).toBe(true)
    })

    it('returns false if today is not Thursday afternoon', () => {
      const date = new Date('March 30, 2023 10:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isThursdayAfternoon()).toBe(false)
    })
  })

  describe('isChristmas()', () => {
    it('returns true if it is Christmas Day', () => {
      const date = new Date('December 25, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isChristmas()).toBe(true)
    })

    it('returns false if it is not Christmas Day', () => {
      const date = new Date('December 26, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isChristmas()).toBe(false)
    })
  })

  describe('isNewYear()', () => {
    it("returns true if it is New Year's Day", () => {
      const date = new Date('January 1, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isNewYear()).toBe(true)
    })

    it("returns false if it is not New Year's Day", () => {
      const date = new Date('January 2, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isNewYear()).toBe(false)
    })
  })

  describe('isHolidays()', () => {
    it('returns true if it is Christmas Day', () => {
      const date = new Date('December 25, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isHolidays()).toBe(true)
    })

    it("returns true if it is New Year's Day", () => {
      const date = new Date('January 1, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isHolidays()).toBe(true)
    })

    it('returns false if it is not a holiday', () => {
      const date = new Date('January 2, 2023 00:00:00')
      jest.spyOn(time, 'now').mockImplementation(() => date)
      expect(time.isHolidays()).toBe(false)
    })
  })
})
