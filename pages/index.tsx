// index.tsx
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  shouldIDeploy,
  shouldIDeployFavIcon,
  getBaseUrl
} from '../helpers/constants'
import Time from '../helpers/time'
import Widget from '../component/widget'
import { useTranslation } from '../helpers/i18n'
import Footer from '../component/footer'
import Router from 'next/router'
import { Theme, ThemeType } from '../helpers/themes'

interface IPage {
  tz: string
  now: { timezone: string; customDate: string }
  initialReason: string
}

const Page: React.FC<IPage> = ({ tz, now: initialNow, initialReason }) => {
  const [timezone, setTimezone] = useState<string>(tz)
  const [now, setNow] = useState<any>(
    new Time(initialNow.timezone, initialNow.customDate)
  )
  const [theme, setTheme] = useState<ThemeType>(Theme.Light)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? Theme.Dark
        : Theme.Light
      setTheme(systemTheme)
      applyTheme(systemTheme)
    }
  }, [])

  const applyTheme = (newTheme: ThemeType) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = theme === Theme.Light ? Theme.Dark : Theme.Light

    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    applyTheme(nextTheme)
  }

  const changeTimezone = (newTimezone: string) => {
    if (!Time.zoneExists(newTimezone)) {
      return
    }

    const newUrl = new URL(window.location.toString())
    newUrl.searchParams.set('tz', newTimezone)
    Router.push(newUrl.pathname + newUrl.search)

    setTimezone(newTimezone)
    setNow(new Time(newTimezone))
  }

  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="icon" href={shouldIDeployFavIcon(now)} />
        <meta property="og:image" content={`${getBaseUrl()}/api/og`} />
      </Head>
      <div className={`wrapper ${!shouldIDeploy(now) && 'its-friday'}`}>
        <Widget reason={initialReason} now={now} />
        <div className="meta">
          <Footer
            timezone={timezone}
            changeTimezone={changeTimezone}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const timezone = Time.DEFAULT_TIMEZONE
  const time = Time.validOrNull(timezone)

  return {
    props: {
      tz: timezone,
      now: time ? time.toObject() : null
    },
    revalidate: 3600
  }
}

export default Page
