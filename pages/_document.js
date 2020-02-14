import React from 'react';
import Document, { Html, Head, Main, NextScript } from "next/document";
import HeadElements from "../component/head";
import { IS_FRIDAY } from "../helpers/constans";
import BodyColor from "../component/body_color";

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
        <BodyColor bodyClass={IS_FRIDAY ? "its-friday" : null}>
          <Main />
          <NextScript />
        </BodyColor>
      </Html>
    );
  }
}

export default MyDocument;
