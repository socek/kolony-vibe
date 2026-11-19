import { BLD } from './constants.js'

// Zdarzenia losowe – zmieniają stan i zwracają opis albo null, gdy nie mają zastosowania.
export const EVENTS = [
  s => {
    if (s.b.shield > 0) { s.b.shield--; return 'Deszcz meteorytów! Osłona orbitalna przechwyciła uderzenie i uległa zniszczeniu. Pozostało osłon: ' + s.b.shield + '.' }
    const ks = Object.keys(BLD).filter(k => s.b[k] > 0)
    if (!ks.length) return null
    const k = ks[Math.floor(Math.random() * ks.length)]
    s.b[k]--; s.mor -= 4
    return 'DESZCZ METEORYTÓW! Zniszczony budynek: ' + BLD[k].n + '.'
  },
  s => { const d = s.pop * (s.tech.med ? 0.03 : 0.08); s.pop -= d; s.mor -= 5; return 'EPIDEMIA! Zmarło ' + Math.round(d) + ' kolonistów.' },
  s => { s.food += 100; s.min += 60; return 'Statek zaopatrzeniowy z Ziemi: +100 t żywności, +60 t minerałów.' },
  s => { const l = Math.round(s.energy * 0.5); if (l < 5) return null; s.energy -= l; return 'Rozbłysk słoneczny! Utracono ' + l + ' kWh energii.' },
  s => { s.min += 150; return 'Geolodzy odkryli złoże kryształów: +150 t minerałów.' },
  s => {
    if (s.cr <= 0) return null
    const l = Math.min(s.cr, Math.max(50, Math.round(s.cr * 0.15)))
    s.cr -= l; s.mor -= 3
    return 'ATAK PIRATÓW! Zrabowano ' + l + ' kredytów.'
  },
  s => { s.mor += 8; return 'Święto Założenia Kolonii – morale rośnie.' },
  s => { s.food += 120; return 'Przechwycono lodową kometę: +120 t żywności.' },
  s => {
    const free = Math.floor(s.b.house * 60 - s.pop)
    if (free < 1) return null
    const w = 15 + Math.floor(Math.random() * 15), n = Math.min(w, free)
    s.pop += n
    return 'Przybyli uchodźcy z upadłej stacji: +' + n + ' kolonistów.' + (n < w ? ' Dla ' + (w - n) + ' zabrakło miejsca – polecieli dalej.' : '')
  },
  s => { s.energy = Math.max(0, s.energy - 60); s.mor -= 4; return 'Awaria zasilania: −60 kWh energii.' }
]

export const EVNAMES = ['Deszcz meteorytów', 'Epidemia', 'Statek zaopatrzeniowy', 'Rozbłysk słoneczny', 'Złoże kryształów', 'Atak piratów', 'Święto Założenia', 'Lodowa kometa', 'Uchodźcy', 'Awaria zasilania']
