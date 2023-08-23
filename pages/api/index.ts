import { NextApiRequest, NextApiResponse } from 'next'
import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constants'

type ApiResponse = {
  error?: { message: string; type: string; code: number }
  timezone?: string
  date?: string
  shouldideploy?: boolean | null
  message?: string
}

const allowCors =
  (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    return await fn(req, res)
  }

const handler = async (
  req: NextApiRequest,
  res: {
    status: (response: number) => {
      json: (response: ApiResponse) => void
    }
  }
) => {
  const timezone = (req.query.tz as string) || Time.DEFAULT_TIMEZONE
  const customDate = req.query.date as string

  if (!Time.zoneExists(timezone)) {
    return res.status(400).json({
      error: {
        message: `Timezone \`${timezone}\` does not exist`,
        type: 'Bad Request',
        code: 400
      }
    })
  }

  const parsedDate = customDate
    ? new Date(customDate).toISOString().split('T')[0]
    : undefined
  const time = parsedDate ? new Time(timezone, parsedDate) : new Time(timezone)

  res.status(200).json({
    timezone: timezone,
    date: customDate
      ? new Date(customDate).toISOString()
      : time.now().toISOString(),
    shouldideploy: shouldIDeploy(time),
    message: getRandom(dayHelper(time))
  })
}

export default allowCors(handler)
