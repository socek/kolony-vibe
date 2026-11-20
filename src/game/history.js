import { calc, techPct } from './calc.js'
import { depTotal } from './expeditions.js'

// Serie danych na wykresach (to, co pokazują kafelki u góry)
export const SERIES = [
  { k: 'pop', n: 'Koloniści', color: '#ffffff' },
  { k: 'mor', n: 'Morale %', color: '#E3EA9A' },
  { k: 'food', n: 'Żywność t', color: '#FF9F90' },
  { k: 'energy', n: 'Energia kWh', color: '#E3EA9A' },
  { k: 'min', n: 'Minerały t', color: '#9ADCE8' },
  { k: 'deps', n: 'Złoża t', color: '#9ADCE8' },
  { k: 'cr', n: 'Kredyty', color: '#E3EA9A' },
  { k: 'res', n: 'Badania %', color: '#A6E08F' },
  { k: 'work', n: 'Pracownicy', color: '#B3ADFF' }
]

// Rodzaje znaczników wydarzeń na wykresach (klucze to powody zatrzymania przewijania)
export const MARKS = [
  { k: 'build', n: 'Ukończone budowy', color: '#A6E08F', of: ['build'] },
  { k: 'research', n: 'Odkryte technologie', color: '#9ADCE8', of: ['research'] },
  { k: 'bad', n: 'Groźne zdarzenia', color: '#FF9F90', of: ['evBad', 'hunger', 'black', 'emig', 'depleted', 'nodep', 'orderFail', 'broke', 'collapse'] },
  { k: 'good', n: 'Dobre zdarzenia', color: '#E3EA9A', of: ['evGood', 'exp', 'camp', 'order'] },
  { k: 'choice', n: 'Decyzje', color: '#ffffff', of: ['choice'] }
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
