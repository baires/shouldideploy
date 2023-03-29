import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constans'

export default (
  req: { query: { tz: string; date?: string } },
  res: {
    status: (response: number) => {
      json: {
        (response: {
          error?: { message: string; type: string; code: number }
          timezone?: string
          shouldideploy?: boolean | null
          message?: string
        }): void
      }
    }
  }
) => {
  let timezone = req.query.tz || Time.DEFAULT_TIMEZONE

  if (!Time.zoneExists(timezone)) {
    return res.status(400).json({
      error: {
        message: `Timezone \`${timezone}\` does not exist`,
        type: 'Bad Request',
        code: 400
      }
    })
  }

  let time: Time

  if (req.query.date) {
    const inputDate = new Date(req.query.date)

    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({
        error: {
          message: `Invalid date format. Expected a valid date string.`,
          type: 'Bad Request',
          code: 400
        }
      })
    }

    // Extend the Time class to accept the optional date parameter
    class CustomTime extends Time {
      constructor(timezone: string, date?: Date) {
        super(timezone)
        if (date) {
          this.now = () =>
            new Date(date.toLocaleString('en-US', { timeZone: timezone }))
        }
      }
    }

    time = new CustomTime(timezone, inputDate)
  } else {
    time = new Time(timezone)
  }

  res.status(200).json({
    timezone: timezone,
    shouldideploy: shouldIDeploy(time),
    message: getRandom(dayHelper(time))
  })
}
