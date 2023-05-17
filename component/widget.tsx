import React from 'react';
import { dayHelper, getRandom, shouldIDeployTitle } from '../helpers/constans';
import Time from '../helpers/time';
import { WIDGET_TRANSLATIONS } from './translations/widget';

interface ITranslation {
  hit_text: string;
  space_text: string;
  click_text: string;
}

interface IWidget {
  now: Time;
  reason: string;
  language: string;
}

const Widget = (props: IWidget) => {
  const [reason, setReasons] = React.useState<string>()
  const [timezone, setTimezone] = React.useState<Time>()
  const [language, setLanguage] = React.useState<string>()
  const [translation, setTranslation] = React.useState<ITranslation>()

  React.useEffect(() => {
    if (props.now !== timezone) {
      setTimezone(props.now);
      updateReasons();
    }

    if (props.language !== language) {
      setLanguage(props.language);

      let translation = getTranslation();
      setTranslation(translation);

      updateReasons();
    }

    document.addEventListener('keydown', onSpacePressOrClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language, props.now])

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
    return dayHelper(props.now, props.language);
  }

  const getTranslation = () => {
    return WIDGET_TRANSLATIONS.filter(x => x.key === props.language)[0].value;
  }

  /**
   * update and get random reasons
   * @return void
   */
  const updateReasons = () => {
    let reasons = getReasons();
    setReasons(getRandom(reasons));
  }

  /**
   * Render widget
   * @return JSX.Element
   */
  return (
    <div className="item">
      <h3 className="tagline">{shouldIDeployTitle(language)}</h3>
      <h2 id="text" className="reason">
        {reason}
      </h2>
      <span id="reload" onClick={onSpacePressOrClick}>
        {translation?.hit_text} <span className="space-btn">{translation?.space_text}</span> {translation?.click_text}
      </span>
    </div>
  )
}

export default Widget
