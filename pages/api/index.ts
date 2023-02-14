import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constans'

export default (
  req: { query: { tz: string } },
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
  let time = new Time(timezone)

  res.status(200).json({
    timezone: timezone,
    shouldideploy: shouldIDeploy(time),
    message: getRandom(dayHelper(time))
  })
}
