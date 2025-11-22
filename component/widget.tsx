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
  const { t } = useTranslation()

  /**
   * Get the reason key based on current time
   * @return string
   */
  const getReasonKey = React.useCallback(() => {
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
  }, [props.now])

  /**
   * Get reasons according to current time
   * @return string[]
   */
  const getReasons = React.useCallback(() => {
    // Get reasons from translation based on current language
    return t(`reasons.${getReasonKey()}`)
  }, [t, getReasonKey])

  /**
   * update and get random reasons
   * @return void
   */
  const updateReasons = React.useCallback(() => {
    let reasons = getReasons()
    setReasons(getRandom(reasons))
  }, [getReasons])

  React.useEffect(() => {
    // Update reasons when language changes
    updateReasons()
  }, [updateReasons])

  /**
   * On hitting Space reload reasons
   * @return void
   */
  const onSpacePressOrClick = React.useCallback(
    (event: any) => {
      if (event.type === 'click' || event?.keyCode == 32) {
        // Prevent default space bar behavior (scrolling, dropdown triggering)
        if (event?.keyCode == 32) {
          event.preventDefault()
        }
        updateReasons()
      }
    },
    [updateReasons]
  )

  React.useEffect(() => {
    document.addEventListener('keydown', onSpacePressOrClick)

    return () => {
      document.removeEventListener('keydown', onSpacePressOrClick)
    }
  }, [onSpacePressOrClick])

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
