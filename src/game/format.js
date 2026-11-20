import { DAYS, MDAYS, YEAR } from './constants.js'
import { t, locale } from '../i18n.js'

export const fmt = n => Math.floor(n).toLocaleString(locale())
export const num = n => (Math.round(n * 10) / 10).toLocaleString(locale())
export const daysTxt = n => t('fmt.days', { n })
export const plDays = n => t('fmt.DAYS', { n })

// endless – gra bez limitu dni (Piaskownica): po 365 dniach zaczyna się kolejny rok
export function dateOf(day, endless = false) {
  if (!endless) day = Math.min(day, DAYS)
  let d = ((day - 1) % DAYS) + 1, m = 0
  while (d > MDAYS[m]) { d -= MDAYS[m]; m++ }
  return d + ' ' + t('fmt.month.' + m) + ' ' + (YEAR + Math.floor((day - 1) / DAYS))
}

export const pct = (v, max) => max > 0 ? Math.max(0, Math.min(100, v / max * 100)) : 0
