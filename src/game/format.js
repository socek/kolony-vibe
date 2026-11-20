import { DAYS, MDAYS, YEAR } from './constants.js'
import { t, locale } from '../i18n.js'

export const fmt = n => Math.floor(n).toLocaleString(locale())
export const num = n => (Math.round(n * 10) / 10).toLocaleString(locale())
export const daysTxt = n => t('fmt.days', { n })
export const plDays = n => t('fmt.DAYS', { n })

export function dateOf(day) {
  let d = Math.min(day, DAYS), m = 0
  while (d > MDAYS[m]) { d -= MDAYS[m]; m++ }
  return d + ' ' + t('fmt.month.' + m) + ' ' + YEAR
}

export const pct = (v, max) => max > 0 ? Math.max(0, Math.min(100, v / max * 100)) : 0
