import React from 'react'
import Head from 'next/head'
import {
  shouldIDeploy,
  shouldIDeployFavIcon,
  shouldIDeployAnswerImage,
  getRandom,
  dayHelper
} from '../helpers/constans'
import Time from '../helpers/time'
import Widget from '../component/widget'
import Footer from '../component/footer'
import Router, { useRouter } from 'next/router'

interface IPage {
  tz?: string
}

const Page = ({ tz }: IPage) => {
  const router = useRouter()
  const queryTimezone =
    typeof router.query.tz === 'string' ? router.query.tz : '' // Add type check for router.query.tz
  const initialTimezone = tz || queryTimezone || 'UTC' // Use queryTimezone instead of router.query.tz
  const [timezone, setTimezone] = React.useState<string>(initialTimezone)
  const [now, setNow] = React.useState<any>(Time.validOrNull(initialTimezone))
  const [initialReason, setInitialReason] = React.useState<string>('')

  React.useEffect(() => {
    setInitialReason(getRandom(dayHelper(now)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeTimezone = (timezone: string) => {
    if (!Time.zoneExists(timezone)) {
      return
    }
    let newUrl = new URL(location.toString())
    newUrl.searchParams.set('tz', timezone)

    Router.push(newUrl.pathname + newUrl.search)

    setTimezone(timezone)
    setNow(new Time(timezone))
  }

  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          href={shouldIDeployFavIcon(now)}
          sizes="32x32"
        />
        <meta property="og:image" content={shouldIDeployAnswerImage(now)} />
        <title>Should I Deploy Today?</title>
      </Head>
      <div className={`wrapper ${!shouldIDeploy(now) && 'its-friday'}`}>
        <Widget reason={initialReason} now={now} />
        <div className="meta">
          <Footer timezone={timezone} changeTimezone={changeTimezone} />
        </div>
      </div>
    </>
  )
}

export default Page
