import React from 'react'
import Time from '../helpers/time'
import { useTranslation } from '../helpers/i18n'

interface IWidget {
  now: Time
  reasonSeed: number
}

const Widget = (props: IWidget) => {
  const [reasonSeed, setReasonSeed] = React.useState(props.reasonSeed)
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
  }, [props.now.timezone, props.now.customDate])

  // The seed is serialized with the page so SSR and hydration choose the
  // same message. Language/time changes derive a message without another render.
  const reasons: string[] = t(`reasons.${getReasonKey()}`)
  const reason = reasons[Math.floor(reasonSeed * reasons.length)]
  const updateReasons = React.useCallback(() => {
    setReasonSeed(Math.random())
  }, [])

  /**
   * On hitting Space reload reasons
   * @return void
   */
  const onSpacePressOrClick = React.useCallback(
    (event: React.MouseEvent | KeyboardEvent) => {
      if (event.type === 'click' || ('key' in event && event.key === ' ')) {
        // Prevent default space bar behavior (scrolling, dropdown triggering)
        if ('key' in event && event.key === ' ') {
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
