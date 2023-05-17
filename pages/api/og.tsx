import React from 'react'
import { ImageResponse } from '@vercel/og'
import {
  getRandom,
  dayHelper,
  shouldIDeployColorTheme
} from '../../helpers/constans'
import Time from '../../helpers/time'
export const config = {
  runtime: 'edge'
}

export default function () {
  let timezone = Time.DEFAULT_TIMEZONE
  let time = Time.validOrNull(timezone)
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-.02em',
          fontWeight: 700,
          backgroundColor: shouldIDeployColorTheme(time)
        }}
      >
        <div
          style={{
            left: 42,
            top: 42,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={80}
            height={80}
            viewBox="0 0 670 670"
          >
            <path d="M329.84 300.16c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238 7.273-16.238 16.242-16.238 16.238 7.27 16.238 16.238M399.28 300.16c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M366.24 238c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238 7.27-16.238 16.238-16.238 16.238 7.27 16.238 16.238M324.8 183.68c0 8.969-7.273 16.242-16.242 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M408.24 184.8c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.238 7.273 16.238 16.242M462.56 240.24c0 8.973-7.27 16.242-16.238 16.242s-16.242-7.27-16.242-16.242c0-8.969 7.273-16.238 16.242-16.238s16.238 7.27 16.238 16.238M269.92 240.24c0 8.973-7.273 16.242-16.242 16.242s-16.238-7.27-16.238-16.242c0-8.969 7.27-16.238 16.238-16.238s16.242 7.27 16.242 16.238M462 319.76c0-8.96-7.281-16.238-16.238-15.68-8.96 0-15.68 7.281-15.68 16.238 0 8.96 7.281 15.68 16.238 15.68 8.96 0 16.238-7.281 15.68-16.238zM408.24 376.32c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.238 7.273 16.238 16.242M324.8 376.32c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.242 7.273 16.242 16.242M269.92 319.76c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238c0-8.973 7.27-16.242 16.238-16.242s16.242 7.27 16.242 16.242M286.72 133.84c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238 7.273-16.238 16.242-16.238 16.238 7.27 16.238 16.238M226.24 187.04c0 8.969-7.27 16.242-16.238 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.238 7.27 16.238 16.238M199.36 260.96c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238 7.273-16.242 16.242-16.242 16.238 7.273 16.238 16.242M208.88 342.16c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238 7.273-16.238 16.242-16.238 16.238 7.27 16.238 16.238M254.24 408.8c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.238 7.273 16.238 16.242M324.8 445.76c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238c0-8.973 7.27-16.242 16.238-16.242s16.242 7.27 16.242 16.242M408.24 445.76c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238c0-8.973 7.27-16.242 16.238-16.242s16.238 7.27 16.238 16.242M478.24 408.8c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.238 7.273 16.238 16.242M523.04 342.16c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238 7.273-16.238 16.242-16.238 16.238 7.27 16.238 16.238M533.12 260.96c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.242 7.273 16.242 16.242M504 187.04c0 8.969-7.27 16.242-16.238 16.242-8.973 0-16.242-7.273-16.242-16.242s7.27-16.238 16.242-16.238c8.969 0 16.238 7.27 16.238 16.238M444.64 133.84c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M366.24 114.24c0 8.973-7.27 16.242-16.238 16.242s-16.238-7.27-16.238-16.242c0-8.969 7.27-16.238 16.238-16.238s16.238 7.27 16.238 16.238M248.64 76.719c0 8.969-7.273 16.242-16.242 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M185.92 127.68c0 8.969-7.273 16.242-16.242 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M143.36 198.24c0 8.973-7.27 16.242-16.238 16.242s-16.242-7.27-16.242-16.242c0-8.969 7.273-16.238 16.242-16.238s16.238 7.27 16.238 16.238M130.48 280c0 8.969-7.27 16.238-16.242 16.238-8.969 0-16.238-7.27-16.238-16.238s7.27-16.238 16.238-16.238c8.973 0 16.242 7.27 16.242 16.238M143.36 360.08c0 8.973-7.27 16.242-16.238 16.242s-16.242-7.27-16.242-16.242c0-8.969 7.273-16.238 16.242-16.238s16.238 7.27 16.238 16.238M185.92 432.32c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.242 7.273 16.242 16.242M248.64 485.52c0 8.969-7.273 16.242-16.242 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M324.8 512.4c0 8.969-7.273 16.242-16.242 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M408.24 512.4c0 8.969-7.27 16.242-16.238 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.238 7.27 16.238 16.238M484.96 483.28c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.242 7.273 16.242 16.242M546.56 432.32c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238 7.273-16.242 16.242-16.242 16.238 7.273 16.238 16.242M588.56 360.08c0 8.973-7.27 16.242-16.238 16.242s-16.242-7.27-16.242-16.242c0-8.969 7.273-16.238 16.242-16.238s16.238 7.27 16.238 16.238M602 280c0 8.969-7.27 16.238-16.238 16.238-8.973 0-16.242-7.27-16.242-16.238s7.27-16.238 16.242-16.238c8.969 0 16.238 7.27 16.238 16.238M588.56 199.92c0 8.969-7.27 16.238-16.238 16.238s-16.242-7.27-16.242-16.238c0-8.973 7.273-16.242 16.242-16.242s16.238 7.27 16.238 16.242M546.56 127.68c0 8.969-7.27 16.242-16.238 16.242s-16.242-7.273-16.242-16.242 7.273-16.238 16.242-16.238 16.238 7.27 16.238 16.238M484.96 76.719c0 8.969-7.273 16.242-16.242 16.242s-16.238-7.273-16.238-16.242 7.27-16.238 16.238-16.238 16.242 7.27 16.242 16.238M408.24 47.602c0 8.969-7.27 16.238-16.238 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242 16.238 7.273 16.238 16.242M324.8 47.602c0 8.969-7.273 16.238-16.242 16.238s-16.238-7.27-16.238-16.238 7.27-16.242 16.238-16.242S324.8 38.633 324.8 47.602"></path>
            <use x="70" y="644" xlinkHref="#w"></use>
            <use x="90.551" y="644" xlinkHref="#b"></use>
            <use x="104.359" y="644" xlinkHref="#a"></use>
            <use x="123.348" y="644" xlinkHref="#f"></use>
            <use x="142.242" y="644" xlinkHref="#c"></use>
            <use x="155.629" y="644" xlinkHref="#a"></use>
            <use x="174.617" y="644" xlinkHref="#l"></use>
            <use x="204.41" y="644" xlinkHref="#k"></use>
            <use x="224.453" y="644" xlinkHref="#j"></use>
            <use x="252.453" y="644" xlinkHref="#a"></use>
            <use x="271.441" y="644" xlinkHref="#e"></use>
            <use x="300.617" y="644" xlinkHref="#i"></use>
            <use x="310.215" y="644" xlinkHref="#v"></use>
            <use x="319.813" y="644" xlinkHref="#a"></use>
            <use x="338.805" y="644" xlinkHref="#u"></use>
            <use x="358.844" y="644" xlinkHref="#b"></use>
            <use x="372.656" y="644" xlinkHref="#f"></use>
            <use x="391.547" y="644" xlinkHref="#t"></use>
            <use x="411.594" y="644" xlinkHref="#h"></use>
            <use x="431.523" y="644" xlinkHref="#i"></use>
            <use x="441.125" y="644" xlinkHref="#g"></use>
            <use x="457.719" y="644" xlinkHref="#s"></use>
            <use x="70" y="672" xlinkHref="#r"></use>
            <use x="82.184" y="672" xlinkHref="#b"></use>
            <use x="95.992" y="672" xlinkHref="#d"></use>
            <use x="115.227" y="672" xlinkHref="#e"></use>
            <use x="154.152" y="672" xlinkHref="#c"></use>
            <use x="167.535" y="672" xlinkHref="#h"></use>
            <use x="187.469" y="672" xlinkHref="#a"></use>
            <use x="216.207" y="672" xlinkHref="#q"></use>
            <use x="239.641" y="672" xlinkHref="#d"></use>
            <use x="258.879" y="672" xlinkHref="#p"></use>
            <use x="278.813" y="672" xlinkHref="#o"></use>
            <use x="308.492" y="672" xlinkHref="#n"></use>
            <use x="329.016" y="672" xlinkHref="#b"></use>
            <use x="342.82" y="672" xlinkHref="#d"></use>
            <use x="362.059" y="672" xlinkHref="#m"></use>
            <use x="371.656" y="672" xlinkHref="#a"></use>
            <use x="390.648" y="672" xlinkHref="#g"></use>
            <use x="407.242" y="672" xlinkHref="#c"></use>
          </svg>
          <span
            style={{
              marginLeft: 8,
              fontSize: 20
            }}
          >
            shouldideploy.today
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '20px 50px',
            margin: '0 42px',
            fontSize: 70,
            fontWeight: 900,
            color: '#111',
            fontFamily:
              '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif',
            width: 'auto',
            maxWidth: '80%',
            textAlign: 'center',
            lineHeight: 1.4,
            textTransform: 'uppercase',
            backgroundColor: shouldIDeployColorTheme(time)
          }}
        >
          {getRandom(dayHelper(time))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600
    }
  )
}
