import React from "react";
import Head from "next/head";
import { IS_FRIDAY } from "../helpers/constans";
import Widget from "../component/widget";

export default () => (
  <>
    <Head>
      <link rel="icon" type="image/png" href={IS_FRIDAY ? "/dots-red.png" : "/dots.png"} sizes="32x32" />
      <meta name="og:image" content={IS_FRIDAY ? "no.png" : "yes.png"} />
    </Head>
    <Widget />
  </>
);
