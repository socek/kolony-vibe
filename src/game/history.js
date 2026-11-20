import { localize } from '../i18n.js'
import { calc, techPct } from './calc.js'
import { depTotal } from './expeditions.js'

// Serie danych na wykresach (to, co pokazują kafelki u góry)
export const SERIES = [
  { k: 'pop', color: '#ffffff' },
  { k: 'mor', color: '#E3EA9A' },
  { k: 'food', color: '#FF9F90' },
  { k: 'energy', color: '#E3EA9A' },
  { k: 'min', color: '#9ADCE8' },
  { k: 'deps', color: '#9ADCE8' },
  { k: 'cr', color: '#E3EA9A' },
  { k: 'res', color: '#A6E08F' },
  { k: 'work', color: '#B3ADFF' }
]

// Rodzaje znaczników wydarzeń na wykresach (klucze to powody zatrzymania przewijania)
export const MARKS = [
  { k: 'build', color: '#A6E08F', of: ['build'] },
  { k: 'research', color: '#9ADCE8', of: ['research'] },
  { k: 'bad', color: '#FF9F90', of: ['evBad', 'hunger', 'black', 'emig', 'depleted', 'nodep', 'orderFail', 'broke', 'collapse', 'faunaBad', 'anomalyBad', 'storm', 'breach'] },
  { k: 'good', color: '#E3EA9A', of: ['evGood', 'exp', 'camp', 'order', 'faunaGood', 'anomalyGood'] },
  { k: 'choice', color: '#ffffff', of: ['choice'] }
]
const markOf = reason => MARKS.find(m => m.of.includes(reason))

// zapisuje stan kolonii po dniu i znaczniki ważnych wydarzeń
export function record(s, reasons) {
  if (!s.hist) s.hist = []
  if (!s.marks) s.marks = []
  const c = calc(s), d = s.m - 1
  s.hist.push({
    d, pop: Math.round(s.pop), mor: Math.round(s.mor), food: Math.round(s.food), energy: Math.round(s.energy),
    min: Math.round(s.min), deps: Math.round(depTotal(s)), cr: Math.round(s.cr),
    res: s.rs ? Math.round(techPct(s, s.rs)) : 0, work: Math.round(c.workforce)
  })
  for (const r of new Set(reasons.map(markOf).filter(Boolean).map(m => m.k))) s.marks.push({ d, k: r })
}

// nazwy serii i rodzajów wydarzeń ze słowników (hist.s.<k>, hist.m.<k>)
localize(Object.fromEntries(SERIES.map(x => [x.k, x])), 'hist.s', ['n'])
localize(Object.fromEntries(MARKS.map(x => [x.k, x])), 'hist.m', ['n'])
