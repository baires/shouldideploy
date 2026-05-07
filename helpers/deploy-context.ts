import Time from './time'
import { getRandom, dayHelper, shouldIDeploy } from './constants'

export type DeployContext = {
  time: Time
  canDeploy: boolean
  reason: string
  verdict: 'YES' | 'NO'
}

export type DeployContextError = {
  type: 'invalid_timezone'
  timezone: string
}

export function resolveDeployContext(
  searchParams: URLSearchParams
): DeployContext | DeployContextError {
  const timezone = searchParams.get('tz') || Time.DEFAULT_TIMEZONE
  const lang = searchParams.get('lang') || undefined

  if (!Time.zoneExists(timezone)) {
    return { type: 'invalid_timezone', timezone }
  }

  const time = new Time(timezone)
  const canDeploy = shouldIDeploy(time)
  const reason = getRandom(dayHelper(time, lang))
  const verdict = canDeploy ? 'YES' : 'NO'

  return { time, canDeploy, reason, verdict }
}
