import { t } from '../i18n.js'
import { lawFx } from './laws.js'
// Ilu kolonistów jest zdolnych do pracy. Bazowo 60% – reszta to dzieci, seniorzy i ich opiekunowie.
// Odsetek zmieniają morale, szpitale, technologia Zautomatyzowane żłobki i choroby po epidemiach.
export const WORK_BASE = 0.6, WORK_MIN = 0.4, WORK_MAX = 0.8
export const SICK_DAYS = 14 // tyle dni po epidemii część kolonistów choruje

// s.hospRed – skuteczność szpitali z poprzedniego dnia (0..1), zapisywana w endTurn
export function workParts(s) {
  const hosp = s.hospRed || 0, parts = [{ k: 'base', n: t('work.base'), v: WORK_BASE }]
  const mor = Math.max(-0.1, Math.min(0.1, ((s.mor ?? 50) - 50) / 50 * 0.1))
  if (Math.abs(mor) >= 0.001) parts.push({ k: 'mor', n: t('tile.mor'), v: mor })
  if (hosp > 0.001) parts.push({ k: 'hosp', n: t('work.hosp'), v: 0.05 * hosp })
  if (s.tech && s.tech.creche) parts.push({ k: 'creche', n: t('tech.creche.n'), v: 0.05 })
  { const w = lawFx(s, 'work'); if (w) parts.push({ k: 'law', n: t('law.part'), v: w }) }
  if (s.sick > 0) parts.push({ k: 'sick', n: t('work.sick', { d: t('fmt.days', { n: Math.ceil(s.sick) }) }), v: -0.1 * Math.min(1, s.sick / SICK_DAYS) * (1 - 0.5 * hosp) })
  return parts
}

export function workRate(s) {
  return Math.max(WORK_MIN, Math.min(WORK_MAX, workParts(s).reduce((a, x) => a + x.v, 0)))
}

// epidemia: przez kilka dni część kolonistów nie może pracować
export function addSick(s, days = SICK_DAYS) { s.sick = Math.max(s.sick || 0, days) }
