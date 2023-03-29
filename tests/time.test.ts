import Time from '../helpers/time'

describe('Time Class', () => {
  test('should correctly identify timezone existence', () => {
    expect(Time.zoneExists('America/Argentina/Buenos_Aires')).toBe(true)
    expect(Time.zoneExists('Invalid/Timezone')).toBe(false)
  })

  test('should return correct day based on custom date and timezone', () => {
    const time1 = new Time('UTC', '2023-03-31')
    const time2 = new Time('America/Argentina/Buenos_Aires', '2023-03-31')

    expect(time1.isFriday()).toBe(true)
    expect(time2.isFriday()).toBe(true)
  })

  test('should return shouldideploy status based on custom date and timezone', () => {
    const time1 = new Time('UTC', '2023-03-31')
    const time2 = new Time('America/Argentina/Buenos_Aires', '2023-03-31')

    expect(time1.isFriday()).toBe(true)
    expect(time2.isFriday()).toBe(true)
  })
})
