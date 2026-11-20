import { BLD, TECH, MAINT, INFRA, JOBS, HUNGER_MAX, SPEC, SPEC_REQ, SPEC_BONUS, prioOf, capOf, batCapOf, houseCapOf } from './constants.js'
import { daysTxt } from './format.js'
import { depTotal } from './expeditions.js'
import { condMul, repairNeed, REPAIR_PER_WORKER } from './wear.js'
import { scenarioOf, seasonOf } from './scenarios.js'

// Wylicza wszystko, co dzieje się w ciągu jednego dnia, bez zmieniania stanu.
export function calc(s) {
  const t = s.tech, b = s.b, cap = houseCapOf(s), workforce = s.pop * 0.6, enCap = batCapOf(s)
  const af = t.auto ? 0.75 : 1, wNeed = {}, E = {}
  let nb = 0
  // systemy celownicze: działa potrzebują połowy obsady
  const wMul = k => k === 'gun' && t.targeting ? 0.5 : 1
  for (const k in BLD) { wNeed[k] = b[k] * BLD[k].w * af * wMul(k); nb += b[k] }
  wNeed.build = s.q.reduce((a, x) => a + BLD[x.k].crew * af, 0)
  wNeed.repair = repairNeed(s) * af
  const scen = scenarioOf(s), sea = seasonOf(s) || { solar: 1, food: 1, heat: 0 }, mods = s.mods || {}
  wNeed.hunt = scen.hunt ? 8 * af : 0 // myśliwi (Mruczysko)

  // 1) specjaliści trafiają na swoje stanowiska wg priorytetów (gdy ich za dużo – liczeni proporcjonalnie)
  const sp = s.spec || { sci: 0, eng: 0, sol: 0 }
  const spTot = sp.sci + sp.eng + sp.sol, spScale = spTot > workforce ? workforce / spTot : 1
  // infrastruktura ma pierwszeństwo: jeśli zwykłych pracowników nie starcza, pomagają w niej specjaliści
  const infraNeed = INFRA.reduce((a, k) => a + wNeed[k], 0), ordinary = workforce - spTot * spScale
  const infraFromSpec = Math.max(0, Math.min(spTot * spScale, infraNeed - ordinary))
  const spLeft = spTot > 0 ? 1 - infraFromSpec / (spTot * spScale) : 0
  const specA = {}
  let specUsed = infraFromSpec
  for (const T in SPEC) {
    let pool = (sp[T] || 0) * spScale * spLeft
    for (const L of [3, 2, 1]) {
      const ks = SPEC[T].jobs.filter(k => prioOf(s, k) === L), n = ks.reduce((a, k) => a + wNeed[k], 0)
      const r = n > 0 ? Math.min(1, pool / n) : 0
      ks.forEach(k => { specA[k] = wNeed[k] * r }); pool -= n * r; specUsed += n * r
    }
  }
  // 2) reszta (zwykli koloniści i wolni specjaliści) – najpierw infrastruktura, potem wg priorytetów;
  //    laboratorium i szpital obsadzają wyłącznie specjaliści
  let avail = workforce - specUsed
  const need = k => SPEC_REQ.includes(k) ? 0 : wNeed[k] - (specA[k] || 0), ordA = {}
  const take = ks => {
    const n = ks.reduce((a, k) => a + need(k), 0), r = n > 0 ? Math.min(1, avail / n) : 1
    ks.forEach(k => { ordA[k] = need(k) * r })
    avail -= Math.min(avail, n)
  }
  avail += infraFromSpec // ci specjaliści pracują w infrastrukturze jak zwykli koloniści
  take(INFRA)
  for (const L of [3, 2, 1]) take(JOBS.filter(k => prioOf(s, k) === L))
  // E – obsada (0..1), M – sprawność z premią specjalistów (stanowiska tylko dla specjalistów bez premii)
  const M = {}
  for (const k of [...INFRA, ...JOBS]) {
    const n = wNeed[k], st = specA[k] || 0, o = ordA[k] || 0
    if (prioOf(s, k) === 0) { E[k] = 0; M[k] = 0; continue }
    E[k] = n > 0 ? (st + o) / n : 1
    M[k] = n > 0 ? (SPEC_REQ.includes(k) ? E[k] : (o + SPEC_BONUS * st) / n) : 1
    // zużyte i zepsute budynki pracują gorzej
    if (BLD[k]) M[k] *= condMul(s, k)
  }
  // punkty napraw dziennie (inżynierowie naprawiają szybciej)
  const repairPts = wNeed.repair * (M.repair || 0) / Math.max(af, 0.01) * REPAIR_PER_WORKER

  // budowniczowie trafiają na place budowy w kolejności kolejki
  const builders = wNeed.build * E.build, bMul = E.build > 0 ? M.build / E.build : 1
  let bl = builders
  const sites = s.q.map(x => {
    const B = BLD[x.k], need = B.crew * af, a = Math.min(bl, need), r = need > 0 ? a / need : 0, rate = r * B.crew * bMul
    bl -= a
    return { a, need, rate, pct: Math.min(100, x.d / B.bt * 100), eta: rate > 0 ? Math.ceil((B.bt - x.d) / rate) : Infinity }
  })

  let needed = 0, enNeed = s.pop * (0.033 + sea.heat) // zimą dochodzi ogrzewanie
  for (const k in wNeed) if (prioOf(s, k) > 0) needed += wNeed[k]
  for (const k in BLD) enNeed += b[k] * BLD[k].en * E[k]
  const e = needed > 0 ? Math.min(1, workforce / needed) : 1
  // produkcja z budynku: liczba × wydajność × obsada
  const out = k => (b[k] || 0) * BLD[k].p * M[k]
  const enProd = (out('power') + out('power2')) * sea.solar + out('geo') // słońce zależy od pory roku
  const f = enNeed > 0 ? Math.min(1, (s.energy + enProd) / enNeed) : 1
  const huntFood = wNeed.hunt * (M.hunt || 0) / af * 1.3 // 1,3 t na myśliwego dziennie
  const foodProd = ((out('farm') + out('farm2')) * sea.food * (mods.farmMul || 1) + out('synth') + out('kelp') + huntFood) * f, foodCons = s.pop * 0.2 * s.ration
  const minPot = (out('mine') + out('mine2')) * f, deps = depTotal(s), minProd = Math.min(minPot, deps), resProd = b.lab * BLD.lab.p * M.lab * f
  const taxInc = s.pop * s.tax * 0.0167, trade = b.port * BLD.port.p * M.port * f, maint = nb * MAINT
  const unemp = avail
  const foodAfter = s.food + foodProd - foodCons
  const shortRatio = foodAfter < 0 && foodCons > 0 ? Math.min(1, -foodAfter / foodCons) : 0
  // głód: każdy dzień niedoboru wydłuża okres głodu i zabija coraz więcej osób; dnia HUNGER_MAX giną wszyscy.
  // Dzień pełnego jedzenia kończy głód, ale przy racjach głodowych tylko wstrzymuje umieranie.
  const hd = s.hungerDays || 0, starving = shortRatio > 0
  const hungerNext = starving ? hd + 1 : (s.ration >= 1 ? 0 : hd)
  // szpitale (obsadzone przez naukowców): słabsze epidemie, mniej zgonów z głodu, szybszy przyrost
  const hospRed = 1 - Math.pow(0.6, (b.hosp || 0) * E.hosp * f)
  const hungerDeaths = !starving ? 0 : hungerNext >= HUNGER_MAX ? s.pop : s.pop * 0.012 * hungerNext * (0.5 + 0.5 * shortRatio) * (1 - 0.3 * hospRed)
  // szkoły: tylu specjalistów dziennie kształcą
  const train = (b.school || 0) * E.school * 0.25
  // brak specjalistów na stanowiskach tylko dla nich
  const sciMissing = SPEC_REQ.reduce((a, k) => a + wNeed[k] - (specA[k] || 0), 0)
  const recB = 20 * (1 - Math.pow(0.75, b.rec * E.rec * f * (t.holo ? 2 : 1)))
  // obrona: obsadzone i zasilone działa; każde kolejne daje coraz mniej
  // fauna (Mruczysko): ogrodzenia soniczne zmniejszają straty; zagrody oswajają mruczki
  const faunaRed = 1 - Math.pow(0.7, (b.fence || 0) * (M.fence || 0) * f), tameRate = (b.pen || 0) * (E.pen || 0) * 0.2
  const tameMor = Math.min(10, (s.tamed || 0) * 0.2), iceProd = out('icefac') * f
  const def = (b.gun || 0) * M.gun * f * (t.targeting ? 1.5 : 1), defRed = 1 - Math.pow(0.75, def)
  const crowd = s.pop > cap ? Math.min(40, (s.pop - cap) / Math.max(cap, 1) * 60) : 0
  const unempPen = s.pop > 0 ? unemp / s.pop * 30 : 0, black = (1 - f) * 30, starv = shortRatio * 40
  let mt = 55 - (s.tax - 10) * 1.5 + (s.ration - 1) * 40 + recB + tameMor - crowd - unempPen - black - starv - (s.cr < 0 ? 10 : 0)
  mt = Math.max(0, Math.min(100, mt))
  const foodCap = capOf(s, 'food'), minCap = capOf(s, 'min'), foodWaste = Math.max(0, foodAfter - foodCap), minWaste = Math.max(0, s.min + minProd - minCap)
  const enStore = Math.max(0, Math.min(enCap, s.energy + enProd - enNeed * f)), enWaste = Math.max(0, s.energy + enProd - enNeed * f - enCap)
  return { faunaRed, tameRate, tameMor, iceProd, huntFood, season: seasonOf(s),  repairPts, E, M, specA, ordA, sciMissing, train, hospRed, spTot, wNeed, builders, sites, foodCap, minCap, foodWaste, minWaste, enCap, enStore, enWaste, cap, workforce, needed, e, f, enProd, enNeed, foodProd, foodCons, minPot, deps, minProd, resProd, taxInc, trade, maint, unemp, shortRatio, hungerNext, hungerDeaths, mt, crowd, unempPen, black, starv, recB, def, defRed }
}

export const nextTech = s => Object.entries(TECH).filter(([k]) => !s.tech[k]).map(e => e[1]).sort((a, b) => a.c - b.c)[0]
export const techPct = (s, k) => Math.min(100, (s.rp[k] || 0) / TECH[k].c * 100)
export function techEta(s, k, c) {
  if (c.resProd <= 0) return 'stoi – brak naukowców'
  return 'jeszcze ' + daysTxt(Math.ceil((TECH[k].c - (s.rp[k] || 0)) / c.resProd))
}
