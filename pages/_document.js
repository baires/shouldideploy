import React from 'react';
import Document, { Html, Head, Main, NextScript } from "next/document";
import HeadElements from "../component/head";
import { IS_FRIDAY } from "../helpers/constans";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/png" href={IS_FRIDAY ? "/dots-red.png": "/dots.png"} sizes="32x32" />
          <meta name="og:image" content={IS_FRIDAY ? "no.png" : "yes.png"} />
          <HeadElements />
        </Head>
        <body className={IS_FRIDAY ? "its-friday" : null}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
