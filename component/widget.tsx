import React from 'react'
import { getRandom } from '../helpers/constants'
import Time from '../helpers/time'
import { useTranslation } from '../helpers/i18n'

interface IWidget {
  now: Time
  reason: string
}

const Widget = (props: IWidget) => {
  const [reason, setReasons] = React.useState<string>()
  const [timezone, setTimezone] = React.useState<Time>()
  const { t, language } = useTranslation()

  React.useEffect(() => {
    // Initialize reasons on mount
    updateReasons()

    if (props.now !== timezone) {
      setTimezone(props.now)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    document.addEventListener('keydown', onSpacePressOrClick)

    return () => {
      document.removeEventListener('keydown', onSpacePressOrClick)
    }
  }, [language])

  React.useEffect(() => {
    // Update reasons when language changes
    updateReasons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  /**
   * On hitting Space reload reasons
   * @return void
   */
  const onSpacePressOrClick = (event: any) => {
    if (event.type === 'click' || event?.keyCode == 32) {
      // Prevent default space bar behavior (scrolling, dropdown triggering)
      if (event?.keyCode == 32) {
        event.preventDefault()
      }
      updateReasons()
    }
  }

  /**
   * Get reasons according to current time
   * @return string[]
   */
  const getReasons = () => {
    // Get reasons from translation based on current language
    return t(`reasons.${getReasonKey()}`)
  }

  /**
   * Get the reason key based on current time
   * @return string
   */
  const getReasonKey = () => {
    const time = props.now

    if (time.isDayBeforeChristmas()) {
      return 'day_before_christmas'
    }

    if (time.isChristmas()) {
      return 'christmas'
    }

    if (time.isNewYear()) {
      return 'new_year'
    }

    if (time.isFriday13th()) {
      return 'friday_13th'
    }

    if (time.isFridayAfternoon()) {
      return 'friday_afternoon'
    }

    if (time.isFriday()) {
      return 'to_not_deploy'
    }

    if (time.isThursdayAfternoon()) {
      return 'thursday_afternoon'
    }

    if (time.isWeekend()) {
      return 'weekend'
    }

    if (time.isAfternoon()) {
      return 'afternoon'
    }

    return 'to_deploy'
  }

  /**
   * update and get random reasons
   * @return void
   */
  const updateReasons = () => {
    let reasons = getReasons()
    setReasons(getRandom(reasons))
  }

  /**
   * Render widget
   * @return JSX.Element
   */
  return (
    <div className="item">
      <h3 className="tagline">{t('tagline')}</h3>
      <h2 id="text" className="reason">
        {reason}
      </h2>
      <span id="reload" onClick={onSpacePressOrClick}>
        {t('reload.hit')} <span className="space-btn">{t('reload.space')}</span>{' '}
        {t('reload.or_click')}
      </span>
    </div>
  )
}

export default Widget
