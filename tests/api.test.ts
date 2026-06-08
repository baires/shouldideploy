
async function callApi(
  tz?: string,
  lang?: string,
  date?: string
): Promise<{ status: number; body: any; headers: Headers }> {
  const url = new URL('http://localhost/api')
  if (tz) url.searchParams.set('tz', tz)
  if (lang) url.searchParams.set('lang', lang)
  if (date) url.searchParams.set('date', date)

  const { default: handler } = await import('../pages/api/index')
  const res = await handler(new Request(url.toString()))
  const body = await res.json()
  return { status: res.status, body, headers: res.headers }
}

describe('/api', () => {
  afterEach(() => jest.useRealTimers())

  it('returns Cache-Control: no-store', async () => {
    const { status, headers } = await callApi('UTC')
    expect(status).toBe(200)
    expect(headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns valid JSON with deploy status and message', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z')) // Monday 10am UTC
    const { status, body } = await callApi('UTC')
    expect(status).toBe(200)
    expect(body).toHaveProperty('timezone', 'UTC')
    expect(body).toHaveProperty('shouldideploy', true)
    expect(body).toHaveProperty('message')
    expect(typeof body.message).toBe('string')
  })

  it('returns 400 for invalid timezone', async () => {
    const url = new URL('http://localhost/api?tz=Invalid/Timezone')
    const { default: handler } = await import('../pages/api/index')
    const res = await handler(new Request(url.toString()))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error.message).toContain('does not exist')
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })
})
