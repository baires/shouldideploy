import moment from 'moment-timezone';

export default class Time {

    constructor(timezone) {
        this.timezone = timezone || 'UTC';
    }

    /**
     * Return current date
     * @return moment.Moment
     */
    now() {
        return moment.tz(this.timezone);
    }

    /**
     * Today is Friday
     * @return bool
     */
    isFriday() {
        return this.now().day() === 5;
    }

    /**
     * Are we in the afternoon?
     * @return bool
     */
    isAfternoon() {
        return this.now().hour() >= 16;
    }

    /**
     * Are we friday afternoon?
     * @return bool
     */
    isFridayAfternoon() {
        return this.isFriday() && this.isAfternoon();
    }

    /**
     * Are we the weekend (Saturday, Sunday)
     * @return bool
     */
    isWeekend() {
        return this.now().day() > 5;
    }
}