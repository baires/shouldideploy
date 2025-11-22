import {
  getRandom,
  dayHelper,
  getBaseUrl,
  shouldIDeployColorTheme,
  shouldIDeployFavIcon
} from '../../../helpers/constants'
import Time from '../../../helpers/time'
import { translate } from '../../../helpers/i18n-server'

export default (
  req: { body: { text: string }; query: { tz: string; lang?: string } },
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
  let lang = req.query.lang
  let time = Time.validOrNull(timezone)
  const thumb_url = `${getBaseUrl()}/api/og`

  // Get translated footer text (defaults to English)
  const footerText = translate('slack.footer', lang)

  res.status(200).json({
    response_type: time ? 'in_channel' : 'ephemeral',
    attachments: [
      {
        text: time
          ? getRandom(dayHelper(time, lang))
          : `Invalid time zone: '${timezone}'`,
        color: shouldIDeployColorTheme(time),
        thumb_url,
        footer_icon: shouldIDeployFavIcon(time),
        footer: footerText + (time ? ` | ${timezone}` : '')
      }
    ]
  })
}
