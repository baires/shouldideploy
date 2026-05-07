import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constants'

export const config = { runtime: 'edge' }

const CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const timezone = searchParams.get('tz') || Time.DEFAULT_TIMEZONE
  const lang = searchParams.get('lang') || undefined

  if (!Time.zoneExists(timezone)) {
    return new Response(`Timezone \`${timezone}\` does not exist`, {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  const time = new Time(timezone)
  const canDeploy = shouldIDeploy(time)
  const reason = getRandom(dayHelper(time, lang))
  const verdict = canDeploy ? 'YES' : 'NO'
  const body = `[shouldideploy] ${verdict}: ${reason}`

  return new Response(body, {
    status: canDeploy ? 200 : 425,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': CACHE,
      'Access-Control-Allow-Origin': '*'
    }
  })
}
