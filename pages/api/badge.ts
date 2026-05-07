import Time from '../../helpers/time'
import { getRandom, dayHelper, shouldIDeploy } from '../../helpers/constants'

export const config = { runtime: 'edge' }

const CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
const LEFT_WIDTH = 110
const CHAR_WIDTH = 6.5
const PADDING = 20
export const MAX_REASON_CHARS = 37

type BadgeSegment = {
  label: string
  color: string
  x: number
  width: number
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function truncate(text: string, max = MAX_REASON_CHARS): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

export function buildSegments(verdict: string, reason: string, canDeploy: boolean): BadgeSegment[] {
  const rightText = `${verdict} · ${truncate(reason)}`
  const rightWidth = Math.round(rightText.length * CHAR_WIDTH + PADDING)
  return [
    { label: 'shouldideploy', color: '#555', x: 0, width: LEFT_WIDTH },
    { label: rightText, color: canDeploy ? '#4c1' : '#ff4136', x: LEFT_WIDTH, width: rightWidth }
  ]
}

export function renderSvg(segments: BadgeSegment[]): string {
  const totalWidth = segments.reduce((sum, s) => sum + s.width, 0)

  const rects = segments
    .map(s => `<rect x="${Math.round(s.x)}" width="${Math.round(s.width)}" height="20" fill="${xmlEscape(s.color)}"/>`)
    .join('\n  ')

  const texts = segments
    .map(s => {
      const cx = s.x + s.width / 2
      const label = xmlEscape(s.label)
      return `
    <text x="${cx}" y="15" fill="#010101" fill-opacity=".3" text-anchor="middle">${label}</text>
    <text x="${cx}" y="14" fill="#fff" text-anchor="middle">${label}</text>`
    })
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(totalWidth)}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="${Math.round(totalWidth)}" height="20" fill="#555"/>
  ${rects}
  <rect rx="3" width="${Math.round(totalWidth)}" height="20" fill="url(#s)"/>
  <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    ${texts}
  </g>
</svg>`
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET', 'Cache-Control': 'no-store' }
    })
  }

  try {
    const { searchParams } = new URL(req.url)
    const timezone = searchParams.get('tz') || Time.DEFAULT_TIMEZONE
    const lang = searchParams.get('lang') || undefined

    if (!Time.zoneExists(timezone)) {
      return new Response('Timezone does not exist', {
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

    const segments = buildSegments(verdict, reason, canDeploy)
    const svg = renderSvg(segments)

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': CACHE,
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'"
      }
    })
  } catch {
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    })
  }
}
