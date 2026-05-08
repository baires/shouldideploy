import { resolveDeployContext } from '../../helpers/deploy-context'

export const config = { runtime: 'edge' }

const CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
const LEFT_WIDTH = 110
const CHAR_WIDTH = 6.5
const PADDING = 20
export const MAX_REASON_CHARS = 37

type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

const VALID_STYLES: BadgeStyle[] = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social']

export type BadgeSegment = {
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

export function buildSegments(verdict: string, reason: string, canDeploy: boolean, style: BadgeStyle = 'flat'): BadgeSegment[] {
  const isFtB = style === 'for-the-badge'
  const rightText = `${isFtB ? verdict.toUpperCase() : verdict} · ${truncate(reason)}`
  const rightWidth = Math.round(rightText.length * CHAR_WIDTH + PADDING)
  const leftText = isFtB ? 'SHOULDIDELOY' : 'shouldideploy'
  return [
    { label: leftText, color: '#555', x: 0, width: LEFT_WIDTH },
    { label: rightText, color: canDeploy ? '#4c1' : '#ff4136', x: LEFT_WIDTH, width: rightWidth }
  ]
}

function renderTexts(
  segments: BadgeSegment[],
  opts: {
    y: number
    shadowY?: number
    shadowColor?: string
    textColor: string
    bold?: boolean
  }
): string {
  const { y, shadowY, shadowColor = '#010101', textColor, bold } = opts
  const boldAttr = bold ? ' font-weight="bold"' : ''

  return segments
    .map(s => {
      const cx = s.x + s.width / 2
      const label = xmlEscape(s.label)
      const shadow =
        shadowY !== undefined
          ? `    <text x="${cx}" y="${shadowY}" fill="${shadowColor}" fill-opacity=".3" text-anchor="middle">${label}</text>`
          : ''
      const shadowNewline = shadow ? '\n' : ''
      return `${shadow}${shadowNewline}    <text x="${cx}" y="${y}" fill="${textColor}" text-anchor="middle"${boldAttr}>${label}</text>`
    })
    .join('\n')
}

function renderFlat(segments: BadgeSegment[]): string {
  const totalWidth = segments.reduce((sum, s) => sum + s.width, 0)
  const rects = segments
    .map(s => `<rect x="${Math.round(s.x)}" width="${Math.round(s.width)}" height="20" fill="${xmlEscape(s.color)}"/>`)
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(totalWidth)}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${Math.round(totalWidth)}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.round(totalWidth)}" height="20" fill="#555"/>
    ${rects}
    <rect width="${Math.round(totalWidth)}" height="20" fill="url(#s)"/>
  </g>
  <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
${renderTexts(segments, { y: 14, shadowY: 15, textColor: '#fff' })}
  </g>
</svg>`
}

function renderFlatSquare(segments: BadgeSegment[]): string {
  const totalWidth = segments.reduce((sum, s) => sum + s.width, 0)
  const rects = segments
    .map(s => `<rect x="${Math.round(s.x)}" width="${Math.round(s.width)}" height="20" fill="${xmlEscape(s.color)}"/>`)
    .join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(totalWidth)}" height="20">
  ${rects}
  <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11" shape-rendering="crispEdges">
${renderTexts(segments, { y: 14, textColor: '#fff' })}
  </g>
</svg>`
}

function renderPlastic(segments: BadgeSegment[]): string {
  const totalWidth = segments.reduce((sum, s) => sum + s.width, 0)
  const rects = segments
    .map(s => `<rect x="${Math.round(s.x)}" width="${Math.round(s.width)}" height="18" fill="${xmlEscape(s.color)}"/>`)
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(totalWidth)}" height="18">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".5"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${Math.round(totalWidth)}" height="18" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${Math.round(totalWidth)}" height="18" fill="#555"/>
    ${rects}
    <rect width="${Math.round(totalWidth)}" height="18" fill="url(#s)"/>
  </g>
  <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
${renderTexts(segments, { y: 12, shadowY: 13, textColor: '#fff' })}
  </g>
</svg>`
}

function renderForTheBadge(segments: BadgeSegment[]): string {
  const totalWidth = segments.reduce((sum, s) => sum + s.width, 0)
  const rects = segments
    .map(s => `<rect x="${Math.round(s.x)}" width="${Math.round(s.width)}" height="28" fill="${xmlEscape(s.color)}"/>`)
    .join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(totalWidth)}" height="28">
  ${rects}
  <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11" shape-rendering="crispEdges" font-weight="bold">
${renderTexts(segments, { y: 19, textColor: '#fff', bold: true })}
  </g>
</svg>`
}

function renderSocial(segments: BadgeSegment[]): string {
  const gutter = 6
  const left = segments[0]
  const right = segments[1]
  const totalWidth = left.width + gutter + right.width

  const leftCx = Math.round(left.width / 2)
  const rightCx = Math.round(left.width + gutter + right.width / 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(totalWidth)}" height="20">
  <style>
    a:hover #llink{fill:url(#b);stroke:#ccc}
  </style>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#fcfcfc" stop-opacity="0"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#ccc" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect id="llink" x="0.5" y="0.5" width="${Math.round(left.width)}" height="19" rx="2" fill="url(#a)" stroke="#d5d5d5"/>
  <rect x="${Math.round(left.width + gutter + 0.5)}" y="0.5" width="${Math.round(right.width)}" height="19" rx="2" fill="#fafafa" stroke="#d5d5d5"/>
  <g font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="11" font-weight="bold">
    <text x="${leftCx}" y="15" fill="#fff" text-anchor="middle">${xmlEscape(left.label)}</text>
    <text x="${leftCx}" y="14" fill="#333" text-anchor="middle">${xmlEscape(left.label)}</text>
    <text x="${rightCx}" y="15" fill="#fff" text-anchor="middle">${xmlEscape(right.label)}</text>
    <text x="${rightCx}" y="14" fill="#333" text-anchor="middle">${xmlEscape(right.label)}</text>
  </g>
</svg>`
}

export function renderSvg(segments: BadgeSegment[], style: BadgeStyle = 'flat'): string {
  switch (style) {
    case 'flat':
      return renderFlat(segments)
    case 'flat-square':
      return renderFlatSquare(segments)
    case 'plastic':
      return renderPlastic(segments)
    case 'for-the-badge':
      return renderForTheBadge(segments)
    case 'social':
      return renderSocial(segments)
    default:
      return renderFlat(segments)
  }
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
    const ctx = resolveDeployContext(searchParams)

    if ('type' in ctx) {
      return new Response('Timezone does not exist', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    const styleParam = searchParams.get('style')
    const style: BadgeStyle = VALID_STYLES.includes(styleParam as BadgeStyle)
      ? (styleParam as BadgeStyle)
      : 'flat'

    const { canDeploy, reason, verdict } = ctx
    const segments = buildSegments(verdict, reason, canDeploy, style)
    const svg = renderSvg(segments, style)

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
