import { DAYS, MDAYS, MNAMES, YEAR } from './constants.js'

export const fmt = n => Math.floor(n).toLocaleString('pl-PL')
export const num = n => (Math.round(n * 10) / 10).toLocaleString('pl-PL')
export const daysTxt = n => n === 1 ? '1 dzień' : n + ' dni'
export const plDays = n => n === 1 ? 'DZIEŃ' : 'DNI'

export function dateOf(day) {
  let d = Math.min(day, DAYS), m = 0
  while (d > MDAYS[m]) { d -= MDAYS[m]; m++ }
  return d + ' ' + MNAMES[m] + ' ' + YEAR
}

export const pct = (v, max) => max > 0 ? Math.max(0, Math.min(100, v / max * 100)) : 0
