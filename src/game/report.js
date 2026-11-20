import { t, has } from '../i18n.js'
import { HUNGER_MAX } from './constants.js'

// Raport przechowuje dane zamiast gotowych zdań, żeby przy wielu dniach liczby się sumowały.
// Pola zaczynające się od "_" nie są sumowane – zostaje wartość z ostatniego dnia.
// Treść: słownik rep.<k> (funkcja od { v, d }: v – dane, d – liczba dni), rada: rep.<k>.tip
// (pomijana w trybie skróconych komunikatów). c – kolor wpisu.
export const REP = {
  nobat: { c: 'warn' }, batFull: { c: '' },
  waste: { c: 'warn' }, // dawny wpis (zapisy sprzed 0.4 mogą go jeszcze mieć w raporcie)
  hunger: { c: 'neg' }, hungerHold: { c: 'warn' }, stall: { c: 'warn' }, short: { c: 'warn' }, black: { c: 'neg' },
  crowd: { c: 'warn' }, born: { c: '' }, imm: { c: '' }, emig: { c: 'neg' }, debt: { c: 'neg' }, loss: { c: 'warn' },
  nodep: { c: 'neg' }, trained: { c: 'pos' }, nosci: { c: 'warn' }, broke: { c: 'warn' }, tamed: { c: 'pos' }, ice: { c: 'pos' },
  nores: { c: 'warn' }
}
for (const k in REP) {
  REP[k].f = (v, d) => t('rep.' + k, { v, d, max: HUNGER_MAX })
  Object.defineProperty(REP[k], 'tip', { get: () => has('rep.' + k + '.tip') ? t('rep.' + k + '.tip') : null })
}

export function mergeRep(old, neu) {
  for (const e of neu) {
    const o = e.k === 'txt' ? null : old.find(x => x.k === e.k)
    if (!o) { old.push(e); continue }
    o.d++
    for (const f in e.v) o.v[f] = f[0] === '_' ? e.v[f] : (o.v[f] || 0) + e.v[f]
  }
}

// Zwraca linie raportu do wyświetlenia: [{ cls, text }]; short – skrócone komunikaty (bez rad, co zrobić)
const withTip = (text, tip, short) => text && (tip && !short ? text + ' ' + tip : text)
export function repLines(s, short = false) {
  const D = s.repDays || 1, rp = s.report || []
  const L = [...rp.filter(e => e.top), ...rp.filter(e => !e.top)].map(e => {
    if (typeof e === 'string') return { cls: '', text: e.replace(/<[^>]+>/g, '') }
    if (e.k === 'txt') return { cls: e.c || '', text: (D > 1 && e.day ? t('rep.dayPrefix', { d: e.day }) : '') + withTip(e.t, e.tip, short) }
    const x = withTip(REP[e.k].f(e.v, e.d), REP[e.k].tip, short)
    return x && { cls: REP[e.k].c, text: x }
  }).filter(Boolean)
  return L.length ? L : [{ cls: '', text: t(D > 1 ? 'rep.calmDays' : 'rep.calmDay') }]
}
