import { truncate, buildSegments, renderSvg, MAX_REASON_CHARS } from '../pages/api/badge'

async function callBadge(
  tz?: string,
  lang?: string,
  style?: string
): Promise<{ status: number; body: string; contentType: string | null }> {
  const url = new URL('http://localhost/api/badge')
  if (tz) url.searchParams.set('tz', tz)
  if (lang) url.searchParams.set('lang', lang)
  if (style) url.searchParams.set('style', style)

  const { default: handler } = await import('../pages/api/badge')
  const res = await handler(new Request(url.toString()))
  const body = await res.text()
  return { status: res.status, body, contentType: res.headers.get('Content-Type') }
}

describe('/api/badge', () => {
  afterEach(() => jest.useRealTimers())

  it('returns SVG with correct content-type', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { status, body, contentType } = await callBadge('UTC')
    expect(status).toBe(200)
    expect(contentType).toContain('image/svg+xml')
    expect(body).toContain('<svg')
    expect(body).toContain('YES')
  })

  it('shows NO verdict on Friday', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z')) // Friday
    const { body } = await callBadge('UTC')
    expect(body).toContain('NO')
  })

  it('uses green color on safe day', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { body } = await callBadge('UTC')
    expect(body).toContain('#4c1')
  })

  it('uses red color on Friday', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    const { body } = await callBadge('UTC')
    expect(body).toContain('#ff4136')
  })

  it('shows shouldideploy label in left segment', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { body } = await callBadge('UTC')
    expect(body).toContain('shouldideploy')
  })

  it('returns 400 for invalid timezone', async () => {
    const { status } = await callBadge('Invalid/Timezone')
    expect(status).toBe(400)
  })

  describe('style parameter', () => {
    it('defaults to flat style', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
      const { body } = await callBadge('UTC')
      expect(body).toContain('height="20"')
      expect(body).toContain('fill="url(#s)"')
      expect(body).toContain('clip-path="url(#r)"')
    })

    it('supports flat-square style', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
      const { body } = await callBadge('UTC', undefined, 'flat-square')
      expect(body).toContain('shape-rendering="crispEdges"')
      expect(body).not.toContain('fill="url(#s)"')
      expect(body).not.toContain('clip-path')
    })

    it('supports plastic style', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
      const { body } = await callBadge('UTC', undefined, 'plastic')
      expect(body).toContain('height="18"')
      expect(body).toContain('stop-color="#fff"')
      expect(body).toContain('rx="4"')
    })

    it('supports for-the-badge style', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
      const { body } = await callBadge('UTC', undefined, 'for-the-badge')
      expect(body).toContain('height="28"')
      expect(body).toContain('font-weight="bold"')
      expect(body).toContain('SHOULDIDELOY')
      expect(body).toContain('YES')
    })

    it('supports social style', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
      const { body } = await callBadge('UTC', undefined, 'social')
      expect(body).toContain('Helvetica Neue')
      expect(body).toContain('#fafafa')
      expect(body).toContain('#d5d5d5')
    })

    it('falls back to flat for invalid style', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
      const { body } = await callBadge('UTC', undefined, 'invalid')
      expect(body).toContain('height="20"')
      expect(body).toContain('fill="url(#s)"')
    })
  })
})

describe('truncate', () => {
  it('truncate caps long input at MAX_REASON_CHARS + ellipsis', () => {
    expect(truncate('x'.repeat(100))).toBe('x'.repeat(37) + '…')
    expect(truncate('short')).toBe('short')
    expect(truncate('x'.repeat(37))).toBe('x'.repeat(37)) // exactly at boundary, no ellipsis
  })

  it('MAX_REASON_CHARS is 37', () => {
    expect(MAX_REASON_CHARS).toBe(37)
  })
})

describe('renderSvg / xmlEscape', () => {
  it('xmlEscape: renderSvg escapes XML-special characters in segment labels', () => {
    const segments = buildSegments('NO', 'A & B <test>', false)
    const svg = renderSvg(segments)
    expect(svg).not.toContain('A & B')
    expect(svg).toContain('&amp;')
    expect(svg).not.toContain('<test>')
    expect(svg).toContain('&lt;test&gt;')
  })

  it('renderSvg produces flat output by default', () => {
    const segments = buildSegments('YES', 'It is safe', true)
    const svg = renderSvg(segments)
    expect(svg).toContain('height="20"')
    expect(svg).toContain('fill="url(#s)"')
    expect(svg).toContain('clip-path="url(#r)"')
  })

  it('renderSvg produces flat-square output', () => {
    const segments = buildSegments('YES', 'It is safe', true)
    const svg = renderSvg(segments, 'flat-square')
    expect(svg).toContain('shape-rendering="crispEdges"')
    expect(svg).not.toContain('fill="url(#s)"')
  })

  it('renderSvg produces plastic output', () => {
    const segments = buildSegments('YES', 'It is safe', true)
    const svg = renderSvg(segments, 'plastic')
    expect(svg).toContain('height="18"')
  })

  it('renderSvg produces for-the-badge output', () => {
    const segments = buildSegments('YES', 'It is safe', true, 'for-the-badge')
    const svg = renderSvg(segments, 'for-the-badge')
    expect(svg).toContain('height="28"')
    expect(svg).toContain('SHOULDIDELOY')
  })

  it('renderSvg produces social output', () => {
    const segments = buildSegments('YES', 'It is safe', true)
    const svg = renderSvg(segments, 'social')
    expect(svg).toContain('Helvetica Neue')
  })
})
