export default class Time {
  static DEFAULT_TIMEZONE = 'UTC'
  timezone: string

  constructor(timezone?: string) {
    this.timezone = timezone || Time.DEFAULT_TIMEZONE
  }

  /**
   * Check if a timezone exist
   * @param {string} timeZone
   * @return {bool}
   */
  static zoneExists(timeZone: string): boolean {
    try {
      Intl.DateTimeFormat('en-US', { timeZone }).format(Date.now())
      return true
    } catch (error) {
      return false
    }
  }

  static validOrNull(timezone: string) {
    if (!timezone) {
      timezone = Time.DEFAULT_TIMEZONE
    }

    return this.zoneExists(timezone) ? new Time(timezone) : null
  }

  /**
   * Return current date
   * @return {Date}
   */
  now(): Date {
    let timeZoneDate = new Date().toLocaleString('en-US', {
      timeZone: this.timezone
    })
    return new Date(timeZoneDate)
  }

  /**
   * Today is Thursday
   * @return boolean
   */
  isThursday(): boolean {
    return this.now().getDay() === 4
  }

  /**
   * Today is Friday
   * @return boolean
   */
  isFriday(): boolean {
    return this.now().getDay() === 5
  }

  /**
   * Today is day 13
   * @return boolean
   */
  is13th(): boolean {
    return this.now().getDate() === 13
  }

  /**
   * Are we in the afternoon?
   * @return boolean
   */
  isAfternoon(): boolean {
    return this.now().getHours() >= 16
  }

  /**
   * Are we Thursday afternoon?
   * @return boolean
   */
  isThursdayAfternoon(): boolean {
    return this.isThursday() && this.isAfternoon()
  }

  /**
   * Are we Friday afternoon?
   * @return boolean
   */
  isFridayAfternoon(): boolean {
    return this.isFriday() && this.isAfternoon()
  }

  /**
   * Are we Friday the 13th?
   * @return boolean
   */
  isFriday13th(): boolean {
    return this.isFriday() && this.is13th()
  }

  /**
   * Are we the weekend (Saturday, Sunday)
   * @return boolean
   */
  isWeekend(): boolean {
    return this.now().getDay() === 6 || this.now().getDay() === 0
  }

  /**
   * Is it Christmas eve?
   * @returns boolean
   */
  isDayBeforeChristmas(): boolean {
    return (
      this.now().getMonth() === 11 &&
      this.now().getDate() === 24 &&
      this.now().getHours() >= 16
    )
  }

  /**
   * Is it Christmas?
   * @returns boolean
   */
  isChristmas(): boolean {
    return this.now().getMonth() === 11 && this.now().getDate() === 25
  }

  /**
   * Is it New Years eve or New Year?
   * @returns boolean
   */
  isNewYear(): boolean {
    return (
      (this.now().getMonth() === 11 &&
        this.now().getDate() === 31 &&
        this.now().getHours() >= 16) ||
      (this.now().getMonth() === 0 && this.now().getDate() === 1)
    )
  }

  /**
   * Combine if holidays
   * @returns boolean
   */
  isHolidays(): boolean {
    return this.isDayBeforeChristmas() || this.isChristmas() || this.isNewYear()
  }
}
