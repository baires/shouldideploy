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
