import { t } from '../i18n.js'
import { BLD, houseCapOf } from './constants.js'
import { calc } from './calc.js'
import { addSick } from './workforce.js'
import { bumpStat } from './badges.js'
import { addDeposit, depositName } from './expeditions.js'

// Zdarzenia losowe – zmieniają stan i zwracają opis albo null, gdy nie mają zastosowania.
// Z daną szansą niszczy jedno działo (lub dwa, gdy jest ich dużo); zwraca opis do komunikatu
function gunLoss(s, chance) {
  if (!s.b.gun || Math.random() >= chance) return ''
  const n = Math.min(s.b.gun, s.b.gun >= 4 ? 2 : 1)
  s.b.gun -= n
  return ' ' + t('ev.gunLoss', { n })
}

export const EVENTS = [
  s => {
    if (s.b.shield > 0) { s.b.shield--; return t('ev.meteorShield', { n: s.b.shield }) }
    const { defRed } = calc(s), gunHit = gunLoss(s, 0.2)
    if (defRed > 0 && Math.random() < defRed) { s.mor -= 1; return t('ev.meteorGuns') + gunHit }
    const ks = Object.keys(BLD).filter(k => s.b[k] > 0)
    if (!ks.length) return null
    const k = ks[Math.floor(Math.random() * ks.length)]
    s.b[k]--; s.mor -= 4
    return t('ev.meteor', { n: BLD[k].n }) + (defRed > 0 ? ' ' + t('ev.meteorGunsFail') : '') + gunHit
  },
  s => { const d = s.pop * (s.tech.med ? 0.03 : 0.08) * (1 - 0.5 * calc(s).hospRed); s.pop -= d; s.mor -= 5; addSick(s); return t('ev.epidemic', { n: Math.round(d) }) },
  s => { s.food += 100; s.min += 60; return t('ev.supply') },
  s => { const l = Math.round(s.energy * 0.5); if (l < 5) return null; s.energy -= l; return t('ev.flare', { n: l }) },
  s => { const n = depositName(t('ev.nearby')), a = addDeposit(s, n, 150 + Math.random() * 250); return t('ev.deposit', { n, a }) },
  s => {
    if (s.cr <= 0) return null
    const base = Math.min(s.cr, Math.max(50, Math.round(s.cr * 0.15)))
    const { defRed } = calc(s), l = Math.round(base * (1 - defRed))
    s.cr -= l; s.mor -= 3 * (1 - defRed)
    const gunHit = gunLoss(s, 0.35)
    if (defRed > 0) bumpStat(s, 'repelled')
    if (defRed > 0) return t('ev.piratesGuns', { l, base }) + gunHit
    return t('ev.pirates', { l }) + (s.b.gun ? ' ' + t('ev.gunsIdle') : '') + gunHit
  },
  s => { s.mor += 8; return t('ev.holiday') },
  s => { s.food += 120; return t('ev.comet') },
  s => {
    const free = Math.floor(houseCapOf(s) - s.pop)
    if (free < 1) return null
    const w = 15 + Math.floor(Math.random() * 15), n = Math.min(w, free)
    s.pop += n
    return t('ev.refugees', { n }) + (n < w ? ' ' + t('ev.refugeesLeft', { n: w - n }) : '')
  },
  s => { s.energy = Math.max(0, s.energy - 60); s.mor -= 4; return t('ev.power') }
]

// które zdarzenia są złe (do ustawień zatrzymywania przewijania)
export const EVENT_BAD = [true, true, false, true, false, true, false, false, false, true]

// nazwy zdarzeń (menu deweloperskie) – z tłumaczeń ev.name.<i>
export const EVNAMES = new Proxy([...Array(EVENTS.length).keys()], { get: (a, k) => /^\d+$/.test(k) ? t('ev.name.' + k) : a[k] })
