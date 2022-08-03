export default class Time {
  static DEFAULT_TIMEZONE = 'UTC'

  constructor(timezone) {
    this.timezone = timezone || Time.DEFAULT_TIMEZONE
  }

  /**
   * Check if a timezone exist
   * @param {string} timezone
   * @return {bool}
   */
  static zoneExists(timeZone) {
    try {
      Intl.DateTimeFormat('en-US', { timeZone }).format(Date.now())
      return true
    } catch (error) {
      return false
    }
  }

  static validOrNull(timezone) {
    if (!timezone) {
      timezone = Time.DEFAULT_TIMEZONE
    }

    return this.zoneExists(timezone) ? new Time(timezone) : null
  }

  /**
   * Return current date
   * @return {Date}
   */
  now() {
    let timeZoneDate = new Date().toLocaleString('en-US', {
      timeZone: this.timezone
    })
    return new Date(timeZoneDate)
  }

  /**
   * Today is Thursday
   * @return bool
   */
  isThursday() {
    return this.now().getDay() === 4
  }

  /**
   * Today is Friday
   * @return bool
   */
  isFriday() {
    return this.now().getDay() === 5
  }

  /**
   * Today is day 13
   * @return bool
   */
  is13th() {
    return this.now().getDate() === 13
  }

  /**
   * Are we in the afternoon?
   * @return bool
   */
  isAfternoon() {
    return this.now().getHours() >= 16
  }

  /**
   * Are we Thursday afternoon?
   * @return bool
   */
  isThursdayAfternoon() {
    return this.isThursday() && this.isAfternoon()
  }

  /**
   * Are we Friday afternoon?
   * @return bool
   */
  isFridayAfternoon() {
    return this.isFriday() && this.isAfternoon()
  }

  /**
   * Are we Friday the 13th?
   * @return bool
   */
  isFriday13th() {
    return this.isFriday() && this.is13th()
  }

  /**
   * Are we the weekend (Saturday, Sunday)
   * @return bool
   */
  isWeekend() {
    return this.now().getDay() === 6 || this.now().getDay() === 0
  }

  isDayBeforeChristmas() {
    return (
      this.now().getMonth() === 11 &&
      this.now().getDate() === 24 &&
      this.now().getHours() >= 16
    )
  }

  isChristmas() {
    return this.now().getMonth() === 11 && this.now().getDate() === 25
  }

  isNewYear() {
    return (
      (this.now().getMonth() === 11 &&
        this.now().getDate() === 31 &&
        this.now().getHours() >= 16) ||
      (this.now().getMonth() === 0 && this.now().getDate() === 1)
    )
  }
}
