import {
  getRandom,
  dayHelper,
  shouldIDeployAnswerImage,
  shouldIDeployColorTheme,
  shouldIDeployFavIcon,
  shouldIDeployTitle
} from '../../../helpers/constans'
import Time from '../../../helpers/time'
import Language from '../../../helpers/validations/languages';

export default (
  req: { body: { text: string }; query: { tz: string, lang: string } },
  res: {
    status: (response: number) => {
      json: {
        (response: {
          response_type: string
          attachments: {
            text: string
            color: string
            thumb_url: string
            footer_icon: string
            footer: string
          }[]
        }): void
      }
    }
  }
) => {
  let timezone = req.body.text || req.query.tz || Time.DEFAULT_TIMEZONE
  let time = Time.validOrNull(timezone)
  let language = req.query.lang || Language.DEFAULT_LANGUAGE;

  res.status(200).json({
    response_type: time ? 'in_channel' : 'ephemeral',
    attachments: [
      {
        text: time
          ? getRandom(dayHelper(time, language))
          : `Invalid time zone: '${timezone}'`,
        color: shouldIDeployColorTheme(time),
        thumb_url: shouldIDeployAnswerImage(time),
        footer_icon: shouldIDeployFavIcon(time),
        footer: shouldIDeployTitle(language) + (time ? ` | ${timezone}` : '') + (language ? ` | ${language}` : '')
      }
    ]
  })
}
