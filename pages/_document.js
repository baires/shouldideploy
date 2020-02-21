import React from "react";
import fetch from "isomorphic-unfetch";
import Document, { Html, Head, Main, NextScript } from "next/document";
import HeadElements from "../component/head";
import { IS_FRIDAY } from "../helpers/constans";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const res = await fetch("https://shouldideploy.today/api");
    const json = await res.json();
    console.log(json.shouldideploy);
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, shouldideploy: json.shouldideploy };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/png" href={IS_FRIDAY ? "/dots-red.png" : "/dots.png"} sizes="32x32" />
          <meta name="og:image" content={IS_FRIDAY ? "no.png" : "yes.png"} />
          <HeadElements />
        </Head>
        <body className={!this.props.shouldideploy ? "its-friday" : null}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
