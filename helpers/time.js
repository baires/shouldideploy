import moment from 'moment-timezone'

export default class Time {
  constructor(timezone) {
    this.timezone = timezone || 'UTC'
  }

  /**
   * Check if a timezone exist
   * @param {string} timezone
   * @return {bool}
   */
  static zoneExists(timezone) {
    return moment.tz.zone(timezone) !== null
  }

  /**
   * Return current date
   * @return moment.Moment
   */
  now() {
    return moment.tz(this.timezone)
  }

  /**
   * Today is Thursday
   * @return bool
   */
  isThursday() {
    return this.now().day() === 4
  }

  /**
   * Today is Friday
   * @return bool
   */
  isFriday() {
    return this.now().day() === 5
  }

  /**
   * Today is day 13
   * @return bool
   */
  is13th() {
    return this.now().date() === 13
  }

  /**
   * Are we in the afternoon?
   * @return bool
   */
  isAfternoon() {
    return this.now().hour() >= 16
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
    return this.now().day() > 5
  }
}
