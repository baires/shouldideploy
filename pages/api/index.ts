import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constans'

export default (
  req: { query: { tz: string; date: string } },
  res: {
    status: (response: number) => {
      json: {
        (response: {
          error?: { message: string; type: string; code: number }
          timezone?: string
          date?: string
          shouldideploy?: boolean | null
          message?: string
        }): void
      }
    }
  }
) => {
  let timezone = req.query.tz || Time.DEFAULT_TIMEZONE
  let customDate = req.query.date

  if (!Time.zoneExists(timezone)) {
    return res.status(400).json({
      error: {
        message: `Timezone \`${timezone}\` does not exist`,
        type: 'Bad Request',
        code: 400
      }
    })
  }

  let time = customDate ? new Time(timezone, customDate) : new Time(timezone)

  res.status(200).json({
    timezone: timezone,
    date: customDate
      ? new Date(customDate).toISOString()
      : time.now().toISOString(),
    shouldideploy: shouldIDeploy(time),
    message: getRandom(dayHelper(time))
  })
}
