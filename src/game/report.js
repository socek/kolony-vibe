import { daysTxt } from './format.js'
import { HUNGER_MAX } from './constants.js'

// Raport przechowuje dane zamiast gotowych zdań, żeby przy wielu dniach liczby się sumowały.
// Pola zaczynające się od "_" nie są sumowane – zostaje wartość z ostatniego dnia.
const R = Math.round, ws = d => d > 1 ? 'w sumie ' : '', dd = d => d > 1 ? ' (przez ' + daysTxt(d) + ')' : ''

export const REP = {
  waste: { c: 'warn', f: (v, d) => R(v.a) < 1 ? null : 'Baterie pełne – zmarnowano ' + ws(d) + R(v.a) + ' kWh energii' + dd(d) + '.' },
  hunger: { c: 'neg', f: (v, d) => 'GŁÓD – dzień ' + v._day + '/' + HUNGER_MAX + '! ' + (R(v.a) === 1 ? 'Zmarł ' + ws(d) + '1 kolonista' : 'Zmarło ' + ws(d) + R(v.a) + ' kolonistów') + dd(d) + '. Dzień pełnego jedzenia (bez racji głodowych) kończy głód.' },
  hungerHold: { c: 'warn', f: (v, d) => 'Racje głodowe' + dd(d) + ' – nikt nie umiera, ale głód trwa (dzień ' + v._day + '/' + HUNGER_MAX + '). Przywróć co najmniej normalne racje, żeby go zakończyć.' },
  stall: { c: 'warn', f: (v, d) => 'Budowa stoi' + dd(d) + ' – nikt nie pracuje na placach budowy. Zmień priorytet budowniczych w zakładce PRACA.' },
  short: { c: 'warn', f: (v, d) => 'Brak rąk do pracy' + dd(d) + ' – brakuje ' + v._miss + ' ' + (v._miss === 1 ? 'pracownika' : 'pracowników') + '. Niedoobsadzone: ' + v._low + '. Priorytety ustawisz w zakładce PRACA.' },
  black: { c: 'neg', f: (v, d) => 'BLACKOUT' + dd(d) + '! Zasilanie pokrywa ' + (d > 1 ? 'średnio ' : '') + R(v.p / d) + '% potrzeb.' },
  crowd: { c: 'warn', f: (v, d) => 'Przeludnienie' + dd(d) + ' – zbuduj moduły mieszkalne.' },
  born: { c: '', f: (v, d) => R(v.a) < 1 ? null : (R(v.a) === 1 ? 'Urodził się ' + ws(d) + '1 nowy kolonista.' : 'Urodziło się ' + ws(d) + R(v.a) + ' nowych kolonistów.') },
  imm: { c: '', f: (v, d) => R(v.a) < 1 ? null : 'Port: ' + (R(v.a) === 1 ? 'przybył ' + ws(d) + '1 imigrant.' : 'przybyło ' + ws(d) + R(v.a) + ' imigrantów.') },
  emig: { c: 'neg', f: (v, d) => R(v.a) < 1 ? null : 'Niezadowoleni koloniści odlatują: ' + ws(d) + '−' + R(v.a) + dd(d) + '.' },
  debt: { c: 'neg', f: (v, d) => 'Kolonia jest zadłużona' + dd(d) + '! Morale spada.' },
  loss: {
    c: 'warn', f: (v, d) => {
      const f = R(v.f), m = R(v.m)
      if (f < 1 && m < 1) return null
      const where = f >= 1 && m >= 1 ? 'Chłodnie i magazyny minerałów pełne' : f >= 1 ? 'Chłodnie pełne' : 'Magazyny minerałów pełne'
      return where + ' – stracono ' + ws(d) + (f >= 1 ? f + ' t żywności' : '') + (f >= 1 && m >= 1 ? ' i ' : '') + (m >= 1 ? m + ' t minerałów' : '') + '.'
    }
  },
  nodep: { c: 'neg', f: (v, d) => 'Kopalnie stoją' + dd(d) + ' – wszystkie złoża są wyczerpane. Wyślij wyprawę w zakładce WYPRAWY.' },
  nores: { c: 'warn', f: (v, d) => 'Laboratoria nie mają projektu' + dd(d) + ' – wybierz technologię w zakładce TECHNOLOGIE.' }
}

export function mergeRep(old, neu) {
  for (const e of neu) {
    const o = e.k === 'txt' ? null : old.find(x => x.k === e.k)
    if (!o) { old.push(e); continue }
    o.d++
    for (const f in e.v) o.v[f] = f[0] === '_' ? e.v[f] : (o.v[f] || 0) + e.v[f]
  }
}

// Zwraca linie raportu do wyświetlenia: [{ cls, text }]
export function repLines(s) {
  const D = s.repDays || 1, rp = s.report || []
  const L = [...rp.filter(e => e.top), ...rp.filter(e => !e.top)].map(e => {
    if (typeof e === 'string') return { cls: '', text: e.replace(/<[^>]+>/g, '') }
    if (e.k === 'txt') return { cls: e.c || '', text: (D > 1 && e.day ? 'Dzień ' + e.day + ': ' : '') + e.t }
    const t = REP[e.k].f(e.v, e.d)
    return t && { cls: REP[e.k].c, text: t }
  }).filter(Boolean)
  return L.length ? L : [{ cls: '', text: D > 1 ? 'Spokojne dni w kolonii.' : 'Spokojny dzień w kolonii.' }]
}
