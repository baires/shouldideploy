// We test the handler logic directly by constructing a Request and reading the Response
async function callCli(
  tz?: string,
  lang?: string
): Promise<{ status: number; body: string; headers: Headers }> {
  const url = new URL('http://localhost/api/cli')
  if (tz) url.searchParams.set('tz', tz)
  if (lang) url.searchParams.set('lang', lang)

  const { default: handler } = await import('../pages/api/cli')
  const res = await handler(new Request(url.toString()))
  const body = await res.text()
  return { status: res.status, body, headers: res.headers }
}

describe('/api/cli', () => {
  afterEach(() => jest.useRealTimers())

  it('returns 200 and YES line on a safe day', async () => {
    // Monday 10am UTC — safe to deploy
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { status, body, headers } = await callCli('UTC')
    expect(status).toBe(200)
    expect(body).toMatch(/^\[shouldideploy\] YES: .+$/)
    expect(headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
    expect(headers.get('Cache-Control')).toMatch(/public/)
  })

  it('returns 425 and NO line on Friday', async () => {
    // Friday 10am UTC
    jest.useFakeTimers().setSystemTime(new Date('2023-01-13T10:00:00Z'))
    const { status, body, headers } = await callCli('UTC')
    expect(status).toBe(425)
    expect(body).toMatch(/^\[shouldideploy\] NO: .+$/)
    expect(headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
    expect(headers.get('Cache-Control')).toMatch(/public/)
  })

  it('returns 425 and NO line on any afternoon (>= 16:00)', async () => {
    // Monday 4pm UTC
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T16:00:00Z'))
    const { status, body } = await callCli('UTC')
    expect(status).toBe(425)
    expect(body).toMatch(/^\[shouldideploy\] NO: .+$/)
  })

  it('defaults timezone to UTC when none provided', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { status } = await callCli()
    expect(status).toBe(200)
  })

  it('returns 400 for invalid timezone', async () => {
    const { status, body, headers } = await callCli('Invalid/Timezone')
    expect(status).toBe(400)
    expect(body).toContain('does not exist')
    expect(headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns a valid response format when ?lang=es is provided', async () => {
    // Monday 10am UTC — safe to deploy
    jest.useFakeTimers().setSystemTime(new Date('2023-01-09T10:00:00Z'))
    const { status, body } = await callCli('UTC', 'es')
    expect(status).toBe(200)
    expect(body).toMatch(/^\[shouldideploy\] (YES|NO): .+$/)
  })
})
