import { BLD, houseCapOf } from './constants.js'
import { calc } from './calc.js'
import { bumpStat } from './badges.js'
import { addDeposit, depositName } from './expeditions.js'

// Zdarzenia losowe – zmieniają stan i zwracają opis albo null, gdy nie mają zastosowania.
// Z daną szansą niszczy jedno działo (lub dwa, gdy jest ich dużo); zwraca opis do komunikatu
function gunLoss(s, chance) {
  if (!s.b.gun || Math.random() >= chance) return ''
  const n = Math.min(s.b.gun, s.b.gun >= 4 ? 2 : 1)
  s.b.gun -= n
  return n === 1 ? ' Zniszczone zostało 1 działo.' : ' Zniszczone zostały ' + n + ' działa.'
}

export const EVENTS = [
  s => {
    if (s.b.shield > 0) { s.b.shield--; return 'Deszcz meteorytów! Osłona orbitalna przechwyciła uderzenie i uległa zniszczeniu. Pozostało osłon: ' + s.b.shield + '.' }
    const { defRed } = calc(s), gunHit = gunLoss(s, 0.2)
    if (defRed > 0 && Math.random() < defRed) { s.mor -= 1; return 'Deszcz meteorytów! Działa zestrzeliły odłamki – nic nie zostało zniszczone.' + gunHit }
    const ks = Object.keys(BLD).filter(k => s.b[k] > 0)
    if (!ks.length) return null
    const k = ks[Math.floor(Math.random() * ks.length)]
    s.b[k]--; s.mor -= 4
    return 'DESZCZ METEORYTÓW! Zniszczony budynek: ' + BLD[k].n + '.' + (defRed > 0 ? ' Działa nie zdołały zestrzelić odłamków.' : '') + gunHit
  },
  s => { const d = s.pop * (s.tech.med ? 0.03 : 0.08) * (1 - 0.5 * calc(s).hospRed); s.pop -= d; s.mor -= 5; return 'EPIDEMIA! Zmarło ' + Math.round(d) + ' kolonistów.' },
  s => { s.food += 100; s.min += 60; return 'Statek zaopatrzeniowy z Ziemi: +100 t żywności, +60 t minerałów.' },
  s => { const l = Math.round(s.energy * 0.5); if (l < 5) return null; s.energy -= l; return 'Rozbłysk słoneczny! Utracono ' + l + ' kWh energii.' },
  s => { const n = depositName('tuż obok kolonii'), t = addDeposit(s, n, 150 + Math.random() * 250); return 'Geolodzy przypadkiem odkryli nowe złoże: ' + n + ' – ' + t + ' t.' },
  s => {
    if (s.cr <= 0) return null
    const base = Math.min(s.cr, Math.max(50, Math.round(s.cr * 0.15)))
    const { defRed } = calc(s), l = Math.round(base * (1 - defRed))
    s.cr -= l; s.mor -= 3 * (1 - defRed)
    const gunHit = gunLoss(s, 0.35)
    if (defRed > 0) bumpStat(s, 'repelled')
    if (defRed > 0) return 'ATAK PIRATÓW! Działa odparły część ataku – zrabowano ' + l + ' kredytów zamiast ' + base + '.' + gunHit
    return 'ATAK PIRATÓW! Zrabowano ' + l + ' kredytów.' + (s.b.gun ? ' Działa nie były obsadzone!' : '') + gunHit
  },
  s => { s.mor += 8; return 'Święto Założenia Kolonii – morale rośnie.' },
  s => { s.food += 120; return 'Przechwycono lodową kometę: +120 t żywności.' },
  s => {
    const free = Math.floor(houseCapOf(s) - s.pop)
    if (free < 1) return null
    const w = 15 + Math.floor(Math.random() * 15), n = Math.min(w, free)
    s.pop += n
    return 'Przybyli uchodźcy z upadłej stacji: +' + n + ' kolonistów.' + (n < w ? ' Dla ' + (w - n) + ' zabrakło miejsca – polecieli dalej.' : '')
  },
  s => { s.energy = Math.max(0, s.energy - 60); s.mor -= 4; return 'Awaria zasilania: −60 kWh energii.' }
]

// które zdarzenia są złe (do ustawień zatrzymywania przewijania)
export const EVENT_BAD = [true, true, false, true, false, true, false, false, false, true]

export const EVNAMES = ['Deszcz meteorytów', 'Epidemia', 'Statek zaopatrzeniowy', 'Rozbłysk słoneczny', 'Nowe złoże', 'Atak piratów', 'Święto Założenia', 'Lodowa kometa', 'Uchodźcy', 'Awaria zasilania']
