import React from 'react'
import { useTranslation } from '../helpers/i18n'
import Timezone from './timezone'

interface IFooter {
  changeTimezone: (timezone: string) => void
  timezone: string
  theme: string
  toggleTheme: () => void
}

const Footer = (props: IFooter) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation()

  return (
    <>
      <ul className="footer-list">
        <li>
          {t('footer.share')}{' '}
          <a
            href="https://x.com/intent/tweet?source=http%3A%2F%2Fshouldideploy.today%2F&text=Should%20I%20Deploy%20Today%3F:%20http%3A%2F%2Fshouldideploy.today"
            target="_blank"
            rel="noopener noreferrer"
            title="Xed? Share on X"
          >
            X
          </a>
        </li>
        <li>
          {t('footer.source')}{' '}
          <a
            href="http://github.com/baires/shouldideploy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </li>
        <li>
          {t('footer.timezone')}{' '}
          <Timezone onChange={props.changeTimezone} timezone={props.timezone} />
        </li>
        <li>
          {t('footer.theme')}{' '}
          <button
            onClick={props.toggleTheme}
            className="theme-toggle"
            title={`Current: ${props.theme}. Click to toggle light/dark`}
          >
            {props.theme}
          </button>
        </li>
        <li>
          {t('footer.language')}{' '}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              cursor: 'pointer'
            }}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </li>
      </ul>
      <ul className="footer-list">
        <li>
          <a href="/api" target="_blank">
            {t('footer.api')}
          </a>
        </li>
        <li>
          <a href="/api/slack" target="_blank">
            {t('footer.slack_api')}
          </a>
        </li>
      </ul>
    </>
  )
}

export default Footer
