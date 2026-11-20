// Złoża minerałów i wyprawy poszukiwawcze
import { bumpStat } from './badges.js'
import { TECH, techReady, techIn, houseCapOf } from './constants.js'
import { t as tr, localize } from '../i18n.js'

export const START_DEPOSIT = 1200
export const MIN_POP_LEFT = 20 // tylu kolonistów musi zostać w kolonii

// Cele wypraw: czas, bazowa szansa na znalezisko, wielkość złoża [min, max] i ryzyko strat
export const RANGES = [
  { k: 'near', days: 5, chance: 0.45, size: [200, 500], risk: 0 },
  { k: 'caves', days: 7, chance: 0.5, size: [300, 700], risk: 0.03 },
  { k: 'mid', days: 10, chance: 0.6, size: [400, 1000], risk: 0.05 },
  { k: 'canyon', days: 12, chance: 0.55, size: [600, 1400], risk: 0.08 },
  { k: 'ice', days: 15, chance: 0.5, size: [900, 1800], risk: 0.1 },
  { k: 'volcano', days: 18, chance: 0.7, size: [1200, 2500], risk: 0.2, req: 'rover' },
  { k: 'far', days: 20, chance: 0.75, size: [800, 2000], risk: 0.12 },
  { k: 'meteor', days: 25, chance: 0.85, size: [1500, 3000], risk: 0.15, req: 'rover' }
]
// Liczebność ekipy: premia do szansy i mnożnik wielkości złoża
export const TEAMS = [{ n: 5, bonus: 0, mult: 1 }, { n: 10, bonus: 0.1, mult: 1.2 }, { n: 20, bonus: 0.2, mult: 1.5 }]

export const rangeOf = k => RANGES.find(r => r.k === k)
export const teamOf = n => TEAMS.find(t => t.n === n)
// sonary geologiczne: +15 p.p. szansy; łaziki terenowe: krótsze wyprawy i połowa ryzyka
export const expChance = (r, t, s) => Math.min(0.95, r.chance + t.bonus + (s && s.tech.sonar ? 0.15 : 0))
export const expDays = (r, s) => s && s.tech.rover ? Math.ceil(r.days * 0.7) : r.days
export const expRisk = (r, s) => r.risk * (s && s.tech.rover ? 0.5 : 1)
// koszt: kredyty na sprzęt i żywność na prowiant (0,2 t na osobę dziennie)
export const expCost = (r, t, s) => { const d = expDays(r, s); return { cr: t.n * d, food: Math.ceil(t.n * d * 0.2) } }

export const depTotal = s => (s.dep || []).reduce((a, d) => a + d.t, 0)

export function depositName(place) {
  return tr('exp.depName', { p: place })
}

export function addDeposit(s, name, t) {
  t = Math.round(t)
  s.dep.push({ n: name, t, max: t })
  return t
}

// Zmniejsza złoża o wydobytą ilość; zwraca nazwy wyczerpanych złóż
export function extract(s, amount) {
  const gone = []
  for (const d of s.dep) {
    if (amount <= 0) break
    const take = Math.min(d.t, amount)
    d.t -= take; amount -= take
  }
  s.dep = s.dep.filter(d => { if (d.t > 0.01) return true; gone.push(d.n); return false })
  return gone
}

// Cele poszukiwań: wybrany cel ma wysoką szansę, każdy inny – bardzo niską (OTHER_CHANCE)
export const GOALS = [
  { k: 'dep' }, { k: 'ruins' }, { k: 'wreck' }, { k: 'settlers' }
]
export const OTHER_CHANCE = 0.05
export const MAX_SPEC_IN_TEAM = 2

export function canSend(s, rk, team, sol = 0, eng = 0) {
  const r = rangeOf(rk), t = teamOf(team), cost = expCost(r, t, s), sp = s.spec || {}
  if (r.req && !s.tech[r.req]) return tr('exp.why.tech')
  if (s.cr < cost.cr) return tr('exp.why.cr')
  if (s.food < cost.food) return tr('exp.why.food')
  if (s.pop - t.n < MIN_POP_LEFT) return tr('ex.minLeft', { n: MIN_POP_LEFT })
  if (sol > (sp.sol || 0)) return tr('exp.why.sol')
  if (eng > (sp.eng || 0)) return tr('exp.why.eng')
  return ''
}

// sol / eng – żołnierze i inżynierowie w ekipie (wliczani w liczebność ekipy)
export function sendExpedition(s, rk, team, goal = 'dep', sol = 0, eng = 0) {
  if (canSend(s, rk, team, sol, eng)) return false
  const r = rangeOf(rk), t = teamOf(team), cost = expCost(r, t, s)
  s.cr -= cost.cr; s.food -= cost.food; s.pop -= t.n
  if (s.spec) { s.spec.sol -= sol; s.spec.eng -= eng }
  s.exp.push({ r: rk, team: t.n, left: expDays(r, s), days: expDays(r, s), goal, sol, eng })
  return true
}

// punkty badań: do bieżącego projektu albo pierwszej dostępnej technologii (inaczej – kredyty)
function addResearch(s, pts) {
  const k = s.rs || Object.keys(TECH).find(t => techIn(s, t) && !s.tech[t] && techReady(s, t))
  if (!k) { s.cr += pts * 5; return tr('exp.resCr', { n: pts * 5 }) }
  s.rp[k] = (s.rp[k] || 0) + pts
  return tr('exp.resPts', { n: pts, t: TECH[k].n })
}

// znalezisko danego rodzaju; zwraca opis
function find(s, kind, x, r, t) {
  const rnd = Math.random, eng = x.eng || 0, scale = t.mult * (r.days / 10)
  if (kind === 'dep') {
    const mods = s.mods || {}, amount = (r.size[0] + rnd() * (r.size[1] - r.size[0])) * t.mult * (1 + 0.1 * eng) * (mods.depMul || 1)
    // na stacji bez kopalń wyprawa przywozi minerały z asteroidy prosto do magazynu
    if (mods.noMines) { const v = Math.round(amount * 0.5); s.min += v; return tr('exp.f.asteroid', { v }) }
    const places = r.places, name = depositName(places[Math.floor(rnd() * places.length)])
    const size = addDeposit(s, name, amount)
    return tr('exp.f.dep', { n: name, v: size })
  }
  if (kind === 'ruins') return tr('exp.f.ruins') + ' ' + addResearch(s, Math.round((20 + rnd() * 60) * scale))
  if (kind === 'wreck') {
    const m = scale * (1 + 0.5 * eng), roll = rnd()
    if (roll < 0.4) { const v = Math.round((100 + rnd() * 300) * m); s.cr += v; return tr('exp.f.wreckCr', { v }) }
    if (roll < 0.75) { const v = Math.round((80 + rnd() * 220) * m); s.min += v; return tr('exp.f.wreckMin', { v }) }
    return tr('exp.f.wreckRes') + ' ' + addResearch(s, Math.round((15 + rnd() * 45) * m))
  }
  // osadnicy
  const roll = rnd()
  if (!s.nb && roll < 0.25) {
    const names = tr('exp.nbNames')
    s.nb = { n: names[Math.floor(rnd() * names.length)], cd: {} }
    return tr('exp.f.nb', { n: s.nb.n })
  }
  if (roll < 0.55) { s.food += 120; s.cr += 100; return tr('exp.f.trade') }
  if (roll < 0.8) { const n = Math.round(Math.min(5 + rnd() * 10, Math.max(0, houseCapOf(s) - s.pop))); s.pop += n; return n ? tr('exp.f.join', { n }) : tr('exp.f.noRoom') }
  const loss = Math.max(0, Math.round((1 + rnd() * 3) * (1 - 0.4 * (x.sol || 0))))
  s.pop -= Math.min(loss, s.pop)
  return loss ? tr('exp.f.fight', { n: loss }) : tr('exp.f.calm')
}

// Jeden dzień wypraw; note(tekst, klasa) dopisuje do raportu. Zwraca liczbę wypraw, które wróciły.
export function tickExpeditions(s, note) {
  let back = 0
  for (const x of s.exp) x.left--
  s.exp = s.exp.filter(x => {
    if (x.left > 0) return true
    back++
    const r = rangeOf(x.r), t = teamOf(x.team), goal = x.goal || 'dep', sol = x.sol || 0, eng = x.eng || 0
    // żołnierze zmniejszają ryzyko strat o 30% każdy
    let alive = x.team
    if (Math.random() < expRisk(r, s) * Math.max(0, 1 - 0.3 * sol)) alive -= Math.max(1, Math.round(x.team * (0.1 + Math.random() * 0.2)))
    const lost = x.team - alive
    // straty najpierw wśród zwykłych uczestników, potem wśród specjalistów
    let specLost = Math.max(0, lost - (x.team - sol - eng))
    const solLost = Math.min(sol, specLost); specLost -= solLost
    const engLost = Math.min(eng, specLost)
    s.pop += alive
    if (s.spec) { s.spec.sol += sol - solLost; s.spec.eng += eng - engLost }
    if (!lost) bumpStat(s, 'expClean')
    const lostTxt = lost ? ' ' + tr('exp.lost', { n: lost, of: x.team }) : ''
    const finds = []
    const main = goal === 'dep' ? expChance(r, t, s) : Math.min(0.95, r.chance + t.bonus)
    if (Math.random() < main) finds.push(find(s, goal, x, r, t))
    for (const g of GOALS) if (g.k !== goal && Math.random() < OTHER_CHANCE) finds.push(tr('exp.also') + ' ' + find(s, g.k, x, r, t))
    const what = GOALS.find(g => g.k === goal).n.toLowerCase()
    if (finds.length) note(tr('exp.back', { r: r.n, g: what, f: finds.join('; ') }) + lostTxt, lost ? 'warn' : 'pos')
    else note(tr('exp.backEmpty', { r: r.n, g: what }) + lostTxt, lost ? 'neg' : 'warn')
    return false
  })
  return back
}

// Handel z osadą sąsiedzką: każda wymiana raz na 7 dni
export const NB_TRADES = [
  { k: 'food', need: s => s.cr < 150 ? tr('ch.lackCr') : '', run: s => { s.cr -= 150; s.food += 50 } },
  { k: 'min', need: s => s.min < 50 ? tr('ch.lackMin') : '', run: s => { s.min -= 50; s.cr += 400 } },
  { k: 'people', need: s => s.cr < 200 ? tr('ch.lackCr') : houseCapOf(s) - s.pop < 8 ? tr('exp.why.room') : '', run: s => { s.cr -= 200; s.pop += 8 } }
]
export function nbWait(s, k) { return s.nb ? Math.max(0, (s.nb.cd[k] || 0) - s.m) : 0 }
export function nbTrade(s, k) {
  const t = NB_TRADES.find(x => x.k === k)
  if (!s.nb || !t || nbWait(s, k) || t.need(s)) return false
  t.run(s); s.nb.cd[k] = s.m + 7
  return true
}

// teksty ze słowników: nazwy i miejsca celów (exp.r.<k>), cele poszukiwań (exp.g.<k>), wymiany z sąsiadami (exp.nb.<k>)
localize(Object.fromEntries(RANGES.map(r => [r.k, r])), 'exp.r', ['n', 'places'])
localize(Object.fromEntries(GOALS.map(g => [g.k, g])), 'exp.g', ['n', 'd'])
localize(Object.fromEntries(NB_TRADES.map(x => [x.k, x])), 'exp.nb', ['n', 'd'])
