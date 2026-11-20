import { t, localize } from '../i18n.js'
import { houseCapOf } from './constants.js'

// Kampanie reklamowe zachęcające nowych kolonistów do przybycia.
// Gracz zna tylko koszt (cr) i czas trwania (days). Szansa dzienna (chance) i maksymalna
// liczba przybyszów w jednym zdarzeniu (max) są ukryte.
export const CAMPAIGNS = [
  { k: 'posters', cr: 150, days: 10, chance: 0.15, max: 8 },
  { k: 'influencer', cr: 400, days: 7, chance: 0.25, max: 12 },
  { k: 'radio', cr: 300, days: 15, chance: 0.12, max: 15 },
  { k: 'holo', cr: 600, days: 20, chance: 0.1, max: 30 },
  { k: 'lottery', cr: 900, days: 30, chance: 0.06, max: 60, req: 'propa' }
]

export const campOf = k => CAMPAIGNS.find(x => x.k === k)
// koszt kampanii – propaganda holograficzna obniża go o 30%
export const campCost = (s, k) => Math.round(campOf(k).cr * (s.tech.propa ? 0.7 : 1))
export const running = (s, k) => (s.camp || []).find(x => x.k === k)

export function canStart(s, k) {
  const x = campOf(k)
  if (x.req && !s.tech[x.req]) return 'Wymaga technologii.'
  if (running(s, k)) return t('camp.running')
  if (s.cr < campCost(s, k)) return t('ch.lackCr')
  return ''
}

export function startCampaign(s, k) {
  if (canStart(s, k)) return false
  s.cr -= campCost(s, k)
  s.camp.push({ k, left: campOf(k).days, got: 0 })
  return true
}

// Jeden dzień kampanii; note(tekst, klasa) dopisuje do raportu. Zwraca liczbę przybyłych.
export function tickCampaigns(s, note) {
  let total = 0
  for (const x of s.camp) {
    const c = campOf(x.k)
    if (Math.random() < c.chance) {
      const want = Math.max(1, Math.round(c.max * (0.3 + 0.7 * Math.random())))
      const free = Math.max(0, Math.floor(houseCapOf(s) - s.pop))
      const n = Math.min(want, free)
      s.pop += n; x.got += n; total += n
      if (n) note(t('camp.got', { c: c.n, n }) + (n < want ? ' ' + t('camp.noRoom', { n: want - n }) : ''), 'pos')
      else note(t('camp.none', { c: c.n, n: want }), 'warn')
    }
    x.left--
  }
  s.camp = s.camp.filter(x => {
    if (x.left > 0) return true
    note(t('camp.end', { c: campOf(x.k).n, n: x.got }), 'sub')
    return false
  })
  return total
}

// nazwy i opisy ze słowników (camp.<k>.n / .d)
localize(Object.fromEntries(CAMPAIGNS.map(x => [x.k, x])), 'camp', ['n', 'd'])
