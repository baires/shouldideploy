import React from 'react'
import { getRandom, dayHelper } from '../helpers/constans'
import Time from '../helpers/time'

interface IWidget {
  now: Time
  reason: string
}

const Widget = (props: IWidget) => {
  const [reason, setReasons] = React.useState<string>()
  const [timezone, setTimezone] = React.useState<Time>()

  React.useEffect(() => {
    if (props.now !== timezone) {
      setTimezone(props.now)
      updateReasons()
    }
    document.addEventListener('keydown', onSpacePressOrClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * On hitting Space reload reasons
   * @return void
   */
  const onSpacePressOrClick = (event: { type: string; keyCode?: number }) => {
    if (event.type === 'click' || event?.keyCode == 32) {
      updateReasons()
    }
  }

  /**
   * Get reasons according to current time
   * @return string[]
   */
  const getReasons = () => {
    return dayHelper(props.now)
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
      <h3 className="tagline">Should I Deploy Today?</h3>
      <h2 id="text" className="reason">
        {reason}
      </h2>
      <span id="reload" onClick={onSpacePressOrClick}>
        Hit <span className="space-btn">Space</span> or Click
      </span>
    </div>
  )
}

export default Widget
