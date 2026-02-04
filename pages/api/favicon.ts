import Time from '../../helpers/time'
import { shouldIDeploy } from '../../helpers/constants'

// Edge runtime configuration for better performance
export const config = {
  runtime: 'edge'
}

/**
 * Unified favicon endpoint that serves the correct icon based on current time
 * This prevents cache invalidation from dynamic URLs in the <link> tag
 *
 * Returns /dots.png when safe to deploy, /dots-red.png otherwise
 * Cache for 5 minutes to balance freshness with reducing requests
 */
export default async function handler(req: Request) {
  // Get timezone from Vercel header or query param
  const url = new URL(req.url)
  const timezoneParam = url.searchParams.get('tz')
  const timezone =
    timezoneParam ||
    req.headers.get('x-vercel-ip-timezone') ||
    Time.DEFAULT_TIMEZONE

  const time = Time.validOrNull(timezone)
  const canDeploy = shouldIDeploy(time)

  // Determine which icon to serve
  const iconPath = canDeploy ? '/dots.png' : '/dots-red.png'
  const iconUrl = new URL(iconPath, req.url)

  // Fetch the actual icon file
  const iconResponse = await fetch(iconUrl)

  if (!iconResponse.ok) {
    return new Response('Icon not found', { status: 404 })
  }

  // Return the icon with appropriate caching
  return new Response(iconResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      // Cache for 5 minutes (300s) - balances freshness with performance
      // s-maxage=300 ensures CDN caches for 5 minutes
      // stale-while-revalidate=60 allows serving stale content for 1 minute while refreshing
      'Cache-Control':
        'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
    }
  })
}
