import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constants'

// Edge runtime configuration
export const config = {
  runtime: 'edge'
}

type ApiResponse = {
  error?: { message: string; type: string; code: number }
  timezone?: string
  date?: string
  shouldideploy?: boolean | null
  message?: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  const { searchParams } = new URL(req.url)
  const timezone = searchParams.get('tz') || Time.DEFAULT_TIMEZONE
  const customDate = searchParams.get('date')
  const lang = searchParams.get('lang') || undefined

  if (!Time.zoneExists(timezone)) {
    return new Response(
      JSON.stringify({
        error: {
          message: `Timezone \`${timezone}\` does not exist`,
          type: 'Bad Request',
          code: 400
        }
      } as ApiResponse),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  const parsedDate = customDate
    ? new Date(customDate).toISOString().split('T')[0]
    : undefined
  const time = parsedDate ? new Time(timezone, parsedDate) : new Time(timezone)

  return new Response(
    JSON.stringify({
      timezone: timezone,
      date: customDate
        ? new Date(customDate).toISOString()
        : time.now().toISOString(),
      shouldideploy: shouldIDeploy(time),
      message: getRandom(dayHelper(time, lang))
    } as ApiResponse),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control':
          'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
      }
    }
  )
}

export default handler
