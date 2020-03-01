import React, { useState } from "react";
import { getRandom, dayHelper, IS_FRIDAY } from "../helpers/constans";
import Footer from "./footer";

function getData() {
  return new Promise(resolve => setTimeout(() => resolve(getRandom(dayHelper())), 1000));
}

function Widget() {
  const [data, setData] = useState(getRandom(dayHelper()));

  function onClick() {
    getData().then(setData);
  }

  return (
    <div className={`wrapper ${IS_FRIDAY && "its-friday"}`}>
      <div className="aligner">
        <div className="item">
          <h3 className="tagline">Should I Deploy Today?</h3>
          <h2 id="text">{data}</h2>
          <button type="button" id="reload" onClick={onClick}>
            Hit me again
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Widget;
