import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import '../style.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp
