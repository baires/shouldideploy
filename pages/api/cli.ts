import { resolveDeployContext } from '../../helpers/deploy-context'

export const config = { runtime: 'edge' }

const CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET', 'Cache-Control': 'no-store' }
    })
  }

  try {
    const { searchParams } = new URL(req.url)
    const ctx = resolveDeployContext(searchParams)

    if ('type' in ctx) {
      return new Response(`Timezone \`${ctx.timezone}\` does not exist`, {
        status: 400,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    const { canDeploy, reason, verdict } = ctx
    const body = `[shouldideploy] ${verdict}: ${reason}`

    return new Response(body, {
      status: canDeploy ? 200 : 425,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': CACHE,
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch {
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    })
  }
}
