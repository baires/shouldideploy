// index.tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { shouldIDeploy, getBaseUrl } from '../helpers/constants'
import Time from '../helpers/time'
import Widget from '../component/widget'
import { useTranslation } from '../helpers/i18n'
import Footer from '../component/footer'
import { Theme, ThemeType } from '../helpers/themes'

interface IPage {
  tz: string
  now: { timezone: string; customDate: string }
  reasonSeed: number
}

const isValidCustomDate = (date?: string): date is string => {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false
  }

  const parsedDate = new Date(`${date}T00:00:00Z`)
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(date)
}

const Page: React.FC<IPage> = ({ tz, now: initialNow, reasonSeed }) => {
  const router = useRouter()
  const queryTz = router.query.tz
  const resolvedTz =
    typeof queryTz === 'string' && Time.zoneExists(queryTz) ? queryTz : tz
  const [timezone, setTimezone] = useState<string>(resolvedTz)
  const [now, setNow] = useState<any>(new Time(resolvedTz, initialNow.customDate))
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

  useEffect(() => {
    const customDate =
      typeof router.query.date === 'string' && isValidCustomDate(router.query.date)
        ? router.query.date
        : undefined

    setNow(new Time(timezone, customDate))
  }, [router.query.date])

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
    router.push(newUrl.pathname + newUrl.search)

    setTimezone(newTimezone)
    setNow(new Time(newTimezone))
  }

  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="icon" href="/api/favicon" />
        <meta property="og:image" content={`${getBaseUrl()}/api/og`} />
      </Head>
      <div className={`wrapper ${!shouldIDeploy(now) && 'its-friday'}`}>
        <Widget reasonSeed={reasonSeed} now={now} />
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
      reasonSeed: Math.random(),
      tz: timezone,
      now: time ? time.toObject() : null
    },
    revalidate: 3600
  }
}

export default Page
