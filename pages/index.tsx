import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import React from 'react'
import Footer from '../component/footer'
import Widget from '../component/widget'
import {
  dayHelper,
  getRandom,
  shouldIDeploy,
  shouldIDeployAnswerImage,
  shouldIDeployFavIcon,
  shouldIDeployTitle
} from '../helpers/constans'
import Time from '../helpers/time'
import Language from '../helpers/validations/languages'

interface IPage {
  tz?: string;
  lang?: string;
}

const Page = ({ tz, lang }: IPage) => {
  const router = useRouter()

  const queryTimezone =
    typeof router.query.tz === 'string' ? router.query.tz : '' // Add type check for router.query.tz
  const initialTimezone = tz || queryTimezone || 'UTC' // Use queryTimezone instead of router.query.tz

  const queryLanguage =
    typeof router.query.lang === 'string' ? router.query.lang : '' // Add type check for router.query.lang
  const initialLanguage = lang || queryLanguage || Language.DEFAULT_LANGUAGE;

  const [timezone, setTimezone] = React.useState<string>(initialTimezone)
  const [language, setLanguage] = React.useState<string>(initialLanguage)
  const [now, setNow] = React.useState<any>(Time.validOrNull(initialTimezone))
  const [initialReason, setInitialReason] = React.useState<string>('')

  React.useEffect(() => {
    setInitialReason(getRandom(dayHelper(now, language)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeTimezone = (timezone: string) => {
    if (!Time.zoneExists(timezone)) {
      return;
    }

    navigateWithQueryString('tz', timezone);
    setTimezone(timezone)
    setNow(new Time(timezone))
  }

  const changeLanguage = (language: string) => {
    if (!Language.exists(language)) {
      return;
    }

    navigateWithQueryString('lang', language);
    setLanguage(language);
  }

  const navigateWithQueryString = (parameter: string, value: string) => {
    let newUrl = new URL(location.toString())
    newUrl.searchParams.set(parameter, value)

    Router.push(newUrl.pathname + newUrl.search);
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
        <title>{shouldIDeployTitle(language)}</title>
      </Head>
      <div className={`wrapper ${!shouldIDeploy(now) && 'its-friday'}`}>
        <Widget reason={initialReason} now={now} language={language} />
        <div className="meta">
          <Footer timezone={timezone} language={language} changeTimezone={changeTimezone} changeLanguage={changeLanguage} />
        </div>
      </div>
    </>
  )
}

export default Page
