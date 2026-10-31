import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Widget from '../component/widget'
import { LanguageProvider } from '../helpers/i18n'
import Time from '../helpers/time'
import en from '../locales/en.json'

describe('initial message rendering', () => {
  it('includes the deployment message in server HTML before effects run', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <Widget now={new Time('UTC', '2026-11-02')} reasonSeed={0} />
      </LanguageProvider>
    )
    const message = html.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1]
    expect(message).toBeTruthy()
    expect(message).toBe(renderToStaticMarkup(<>{en.reasons.to_deploy[0]}</>))
  })
})


describe('server-rendered deployment scenarios', () => {
  it.each([
    ['2026-12-24', 17, 'day_before_christmas'],
    ['2026-12-25', 10, 'christmas'],
    ['2027-01-01', 10, 'new_year'],
    ['2026-11-13', 10, 'friday_13th'],
    ['2026-11-06', 17, 'friday_afternoon'],
    ['2026-11-06', 10, 'to_not_deploy'],
    ['2026-11-05', 17, 'thursday_afternoon'],
    ['2026-11-07', 10, 'weekend'],
    ['2026-11-02', 17, 'afternoon'],
  ])('renders %s at %s:00 using %s reasons', (date, hour, category) => {
    const time = new Time('UTC', date)
    time.customDate!.setHours(hour)
    const html = renderToStaticMarkup(
      <LanguageProvider><Widget now={time} reasonSeed={0} /></LanguageProvider>
    )
    const message = en.reasons[category as keyof typeof en.reasons][0]
    expect(html).toContain(renderToStaticMarkup(<h2 id="text" className="reason">{message}</h2>))
  })
})
