import { truncate, MAX_REASON_CHARS } from '../pages/api/badge'

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
