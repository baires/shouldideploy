import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import HeadElements from '../component/head'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <HeadElements />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
