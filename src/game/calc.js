import { BLD, TECH, BATCAP, MAINT, INFRA, JOBS, HUNGER_MAX, prioOf, capOf } from './constants.js'
import { daysTxt } from './format.js'
import { depTotal } from './expeditions.js'

// Wylicza wszystko, co dzieje się w ciągu jednego dnia, bez zmieniania stanu.
export function calc(s) {
  const t = s.tech, b = s.b, cap = b.house * 60, workforce = s.pop * 0.6, enCap = (b.battery || 0) * BATCAP
  const af = t.auto ? 0.75 : 1, wNeed = {}, E = {}
  let avail = workforce, nb = 0
  for (const k in BLD) { wNeed[k] = b[k] * BLD[k].w * af; nb += b[k] }
  wNeed.build = s.q.reduce((a, x) => a + BLD[x.k].crew * af, 0)

  // przydział pracowników: najpierw infrastruktura, potem wg priorytetów
  const take = ks => {
    const n = ks.reduce((a, k) => a + wNeed[k], 0), r = n > 0 ? Math.min(1, avail / n) : 1
    ks.forEach(k => E[k] = r)
    avail -= Math.min(avail, n)
  }
  take(INFRA)
  for (const L of [3, 2, 1]) take(JOBS.filter(k => prioOf(s, k) === L))
  JOBS.filter(k => prioOf(s, k) === 0).forEach(k => E[k] = 0)

  // budowniczowie trafiają na place budowy w kolejności kolejki
  const builders = wNeed.build * E.build
  let bl = builders
  const sites = s.q.map(x => {
    const B = BLD[x.k], need = B.crew * af, a = Math.min(bl, need), r = need > 0 ? a / need : 0, rate = r * B.crew
    bl -= a
    return { a, need, rate, pct: Math.min(100, x.d / B.bt * 100), eta: rate > 0 ? Math.ceil((B.bt - x.d) / rate) : Infinity }
  })

  let needed = 0, enNeed = s.pop * 0.033
  for (const k in wNeed) if (prioOf(s, k) > 0) needed += wNeed[k]
  for (const k in BLD) enNeed += b[k] * BLD[k].en * E[k]
  const e = needed > 0 ? Math.min(1, workforce / needed) : 1
  // produkcja z budynku: liczba × wydajność × obsada
  const out = k => (b[k] || 0) * BLD[k].p * E[k]
  const enProd = out('power') + out('power2')
  const f = enNeed > 0 ? Math.min(1, (s.energy + enProd) / enNeed) : 1
  const foodProd = (out('farm') + out('farm2')) * f, foodCons = s.pop * 0.2 * s.ration
  const minPot = (out('mine') + out('mine2')) * f, deps = depTotal(s), minProd = Math.min(minPot, deps), resProd = b.lab * BLD.lab.p * E.lab * f
  const taxInc = s.pop * s.tax * 0.0167, trade = b.port * BLD.port.p * E.port * f, maint = nb * MAINT
  const unemp = avail
  const foodAfter = s.food + foodProd - foodCons
  const shortRatio = foodAfter < 0 && foodCons > 0 ? Math.min(1, -foodAfter / foodCons) : 0
  // głód: każdy dzień niedoboru wydłuża okres głodu i zabija coraz więcej osób; dnia HUNGER_MAX giną wszyscy.
  // Dzień pełnego jedzenia kończy głód, ale przy racjach głodowych tylko wstrzymuje umieranie.
  const hd = s.hungerDays || 0, starving = shortRatio > 0
  const hungerNext = starving ? hd + 1 : (s.ration >= 1 ? 0 : hd)
  const hungerDeaths = !starving ? 0 : hungerNext >= HUNGER_MAX ? s.pop : s.pop * 0.012 * hungerNext * (0.5 + 0.5 * shortRatio)
  const recB = 20 * (1 - Math.pow(0.75, b.rec * E.rec * f))
  // obrona: obsadzone i zasilone działa; każde kolejne daje coraz mniej
  const def = (b.gun || 0) * E.gun * f, defRed = 1 - Math.pow(0.75, def)
  const crowd = s.pop > cap ? Math.min(40, (s.pop - cap) / Math.max(cap, 1) * 60) : 0
  const unempPen = s.pop > 0 ? unemp / s.pop * 30 : 0, black = (1 - f) * 30, starv = shortRatio * 40
  let mt = 55 - (s.tax - 10) * 1.5 + (s.ration - 1) * 40 + recB - crowd - unempPen - black - starv - (s.cr < 0 ? 10 : 0)
  mt = Math.max(0, Math.min(100, mt))
  const foodCap = capOf(s, 'food'), minCap = capOf(s, 'min'), foodWaste = Math.max(0, foodAfter - foodCap), minWaste = Math.max(0, s.min + minProd - minCap)
  const enStore = Math.max(0, Math.min(enCap, s.energy + enProd - enNeed * f)), enWaste = Math.max(0, s.energy + enProd - enNeed * f - enCap)
  return { E, wNeed, builders, sites, foodCap, minCap, foodWaste, minWaste, enCap, enStore, enWaste, cap, workforce, needed, e, f, enProd, enNeed, foodProd, foodCons, minPot, deps, minProd, resProd, taxInc, trade, maint, unemp, shortRatio, hungerNext, hungerDeaths, mt, crowd, unempPen, black, starv, recB, def, defRed }
}

export const nextTech = s => Object.entries(TECH).filter(([k]) => !s.tech[k]).map(e => e[1]).sort((a, b) => a.c - b.c)[0]
export const techPct = (s, k) => Math.min(100, (s.rp[k] || 0) / TECH[k].c * 100)
export function techEta(s, k, c) {
  if (c.resProd <= 0) return 'stoi – brak naukowców'
  return 'jeszcze ' + daysTxt(Math.ceil((TECH[k].c - (s.rp[k] || 0)) / c.resProd))
}
