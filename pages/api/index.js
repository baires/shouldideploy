import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constants'

export default (req, res) => {
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
    message: getRandom(dayHelper(time)).reason
  })
}
