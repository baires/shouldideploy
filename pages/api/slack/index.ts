import {
  getRandom,
  dayHelper,
  getBaseUrl,
  shouldIDeployColorTheme,
  shouldIDeployFavIcon
} from '../../../helpers/constants'
import Time from '../../../helpers/time'
import { translate } from '../../../helpers/i18n-server'

// Edge runtime configuration
export const config = {
  runtime: 'edge'
}

type SlackResponse = {
  response_type: string
  attachments: {
    text: string
    color: string
    thumb_url: string
    footer_icon: string
    footer: string
  }[]
}

export default async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url)

  // Parse body for POST requests (Slack sends form data)
  let bodyText = ''
  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      bodyText = body.text || ''
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.text()
      const params = new URLSearchParams(formData)
      bodyText = params.get('text') || ''
    }
  }

  const timezone = bodyText || searchParams.get('tz') || Time.DEFAULT_TIMEZONE
  const lang = searchParams.get('lang') || undefined
  const time = Time.validOrNull(timezone)
  const thumb_url = `${getBaseUrl()}/api/og`

  // Get translated footer text (defaults to English)
  const footerText = translate('slack.footer', lang)

  const response: SlackResponse = {
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
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
