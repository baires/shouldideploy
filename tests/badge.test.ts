async function callBadge(tz?: string, lang?: string): Promise<{ status: number; body: string; contentType: string | null }> {
  const url = new URL('http://localhost/api/badge')
  if (tz) url.searchParams.set('tz', tz)
  if (lang) url.searchParams.set('lang', lang)

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
    jest.useRealTimers()
  })

  it('uses green color on safe day', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { body } = await callBadge('UTC')
    expect(body).toContain('#4c1')
    jest.useRealTimers()
  })

  it('uses red color on Friday', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    const { body } = await callBadge('UTC')
    expect(body).toContain('#ff4136')
    jest.useRealTimers()
  })

  it('shows shouldideploy label in left segment', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { body } = await callBadge('UTC')
    expect(body).toContain('shouldideploy')
    jest.useRealTimers()
  })

  it('truncates long reason text to 40 chars', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { body } = await callBadge('UTC')
    // SVG should not contain any text node longer than 40 chars (excluding tag markup)
    const textMatches = body.match(/<text[^>]*>([^<]+)<\/text>/g) || []
    textMatches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '')
      expect(text.length).toBeLessThanOrEqual(40)
    })
    jest.useRealTimers()
  })

  it('returns 400 for invalid timezone', async () => {
    const { status } = await callBadge('Invalid/Timezone')
    expect(status).toBe(400)
  })
})
