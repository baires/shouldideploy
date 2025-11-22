import React from 'react'
import type { AppProps } from 'next/app'
import '../style.css'
import { LanguageProvider } from '../helpers/i18n'

function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

export default App
