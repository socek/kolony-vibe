import { BLD, TECH, RES, MORK, DAYS, SPEC, HUNGER_MAX, prioOf, jobName, capOf, batCapOf } from './constants.js'
import { calc, nextTech } from './calc.js'
import { EVENTS, EVENT_BAD } from './events.js'
import { mergeRep } from './report.js'
import { beep } from './audio.js'
import { extract, tickExpeditions } from './expeditions.js'
import { tickCampaigns } from './campaigns.js'
import { nextResearch } from './research.js'
import { scenarioOf } from './scenarios.js'

import { CHOICES, CHOICE_KEYS, resolveChoice } from './choices.js'
import { record } from './history.js'
import { tickOrders } from './orders.js'
import { syncCond, tickWear } from './wear.js'
import { trackStats, bumpStat } from './badges.js'

export function clampStore(s) {
  const l = { food: Math.max(0, s.food - capOf(s, 'food')), min: Math.max(0, s.min - capOf(s, 'min')) }
  s.food -= l.food; s.min -= l.min
  return l
}

export const specCount = s => s.spec ? s.spec.sci + s.spec.eng + s.spec.sol : 0

export const snapshot = s => ({ pop: s.pop, food: s.food, energy: s.energy, min: s.min, cr: s.cr, mor: s.mor })

// Rozgrywa jeden dzień. acc = true dokleja raport do raportu z poprzednich dni.
// Zwraca listę powodów, dla których przewijanie mogłoby się zatrzymać (klucze z STOPS w stops.js).
// auto – automatyczne odpowiedzi na zdarzenia z wyborem: { klucz zdarzenia: numer opcji }
export function endTurn(s, acc, auto = {}) {
  if (s.over) return ['over']
  // gra czeka na decyzję gracza – dzień się nie rozgrywa
  if (s.pending) return ['choice']
  const c = calc(s), r = [], stops = new Set(), was = s.was || {}, now = {}
  // edge: powód tylko w dniu, w którym problem się zaczyna
  const edge = (k, cond) => { now[k] = !!cond; if (cond && !was[k]) stops.add(k) }
  const add = (k, v) => r.push({ k, v: v || {}, d: 1 })
  const note = (t, cl) => r.push({ k: 'txt', t, c: cl, day: s.m, top: 1 })

  syncCond(s)
  s.prev = snapshot(s)
  s.energy = c.enStore
  if (c.enWaste > 0.01) add('waste', { a: c.enWaste })
  s.food += c.foodProd - c.foodCons
  if (s.food < 0) s.food = 0
  const deaths = c.hungerDeaths, hdPrev = s.hungerDays || 0
  s.hungerDays = c.hungerNext
  if (deaths > 0) add('hunger', { a: deaths, _day: c.hungerNext })
  else if (hdPrev > 0 && c.hungerNext === 0) { note('Koniec głodu – koloniści znów jedzą do syta.', 'pos'); bumpStat(s, 'hungerSurvived') }
  else if (hdPrev > 0) add('hungerHold', { _day: c.hungerNext })
  s.min += c.minProd
  for (const n of extract(s, c.minProd)) { note('Wyczerpano: ' + n + '.', 'warn'); stops.add('depleted') }
  edge('nodep', s.b.mine > 0 && !s.dep.length)
  if (s.b.mine > 0 && !s.dep.length) add('nodep')
  s.cr += c.taxInc + c.trade - c.maint
  s.mor += (c.mt - s.mor) * MORK

  // postęp budowy
  if (s.q.length) {
    s.q.forEach((x, i) => x.d += c.sites[i].rate)
    s.q = s.q.filter(x => {
      if (x.d < BLD[x.k].bt) return true
      s.b[x.k]++; stops.add('build')
      note('★ Ukończono budowę: ' + BLD[x.k].n + '.', 'pos'); beep(520, 0.12)
      return false
    })
    if (s.q.length && c.builders < 0.5) add('stall')
  }
  edge('stall', s.q.length && c.builders < 0.5)
  edge('short', c.e < 1)
  if (c.e < 1) {
    const miss = Math.ceil(c.needed - c.workforce)
    const low = [...Object.keys(BLD).filter(k => s.b[k]), ...(c.wNeed.build ? ['build'] : [])]
      .filter(k => prioOf(s, k) > 0 && c.E[k] < 1).map(k => jobName(k) + ' ' + Math.floor(c.E[k] * 100) + '%')
    add('short', { _miss: miss, _low: low.join(', ') })
  }
  edge('black', c.f < 1)
  if (c.f < 1) add('black', { p: c.f * 100 })
  edge('crowd', c.crowd > 0)
  if (c.crowd > 0) add('crowd')
  if (!deaths && !s.hungerDays && s.pop < c.cap) {
    const g = Math.min(s.pop * 0.0082 * (s.mor / 60) * (s.tech.med ? 1.3 : 1), c.cap - s.pop)
    s.pop += g
    if (g > 0) add('born', { a: g })
  }
  if (s.b.port && s.mor > 55 && s.pop < c.cap) {
    const im = Math.min(1.5 + Math.random() * 3.5, c.cap - s.pop)
    s.pop += im
    if (im > 0) add('imm', { a: im })
  }
  edge('emig', s.mor < 25)
  if (s.mor < 25) {
    const em = s.pop * 0.01
    s.pop -= em
    add('emig', { a: em })
  }
  s.pop -= deaths
  // szkoły kształcą specjalistów spośród zwykłych pracowników
  s.trainProg = (s.trainProg || 0) + c.train
  while (s.trainProg >= 1 && s.pop * c.workRate - specCount(s) >= 1) { s.trainProg -= 1; s.spec[s.train || 'sci']++; add('trained', { a: 1, _k: s.train || 'sci' }) }
  if (s.trainProg > 1) s.trainProg = 1
  // gdy ludzi ubywa, specjalistów ubywa proporcjonalnie
  { const tot = specCount(s), max = s.pop * 0.6; if (tot > max && tot > 0) for (const T in s.spec) s.spec[T] = Math.floor(s.spec[T] * max / tot) }
  if (c.sciMissing > 0.5) add('nosci', { _n: Math.ceil(c.sciMissing) })
  if (tickExpeditions(s, note)) stops.add('exp')
  if (tickCampaigns(s, note)) stops.add('camp')
  for (const r of tickOrders(s, note)) stops.add(r)
  // zasady właściwe dla scenariusza (fauna, anomalie, sztormy, rozszczelnienia, lód)
  { const sc = scenarioOf(s); if (sc.tick) for (const r of sc.tick(s, c, note, add)) stops.add(r) }
  // zużycie, awarie, rozpad i naprawy budynków
  { const w = tickWear(s, c.repairPts)
    w.stops.forEach(r => stops.add(r))
    if (w.broke.length) add('broke', { a: w.broke.length, _n: w.broke[w.broke.length - 1] })
    for (const n of w.collapsed) note('Budynek rozpadł się ze starości: ' + n + '. Trzeba zbudować go od nowa.', 'neg') }
  if (s.m > 10 && Math.random() < 0.1) {
    if (Math.random() < 0.4) {
      // zdarzenie z wyborem: odpowiedź automatyczna albo czekanie na decyzję gracza
      const k = CHOICE_KEYS[Math.floor(Math.random() * CHOICE_KEYS.length)]
      const txt = auto[k] != null ? resolveChoice(s, k, auto[k]) : null
      if (txt) note('★ ' + txt + ' (odpowiedź automatyczna)', 'sub')
      else { s.pending = k; stops.add('choice'); note('★ ' + CHOICES[k].t + ' – czeka na twoją decyzję.', 'warn') }
      beep(220, 0.25)
    } else {
      const ei = Math.floor(Math.random() * EVENTS.length), m = EVENTS[ei](s)
      if (m) { stops.add(EVENT_BAD[ei] ? 'evBad' : 'evGood'); note('★ ' + m, 'sub'); beep(220, 0.25) }
    }
  }
  for (const k in s.pr) { const b = RES[k].base; s.pr[k] = Math.max(b * 0.5, Math.min(b * 2, s.pr[k] * (1 + (Math.random() - 0.5) * 0.14))) }
  edge('debt', s.cr < 0)
  if (s.cr < 0) add('debt')
  // szpitale z dzisiaj wpływają na jutrzejszą liczbę zdolnych do pracy; choroby mijają
  s.hospRed = c.hospRed
  if (s.sick > 0) s.sick = Math.max(0, s.sick - 1)
  s.mor = Math.max(0, Math.min(100, s.mor)); s.pop = Math.max(0, s.pop); s.energy = Math.min(s.energy, batCapOf(s))
  { const l = clampStore(s); edge('loss', l.food >= 1 || l.min >= 1); if (l.food > 0 || l.min > 0) add('loss', { f: l.food, m: l.min }) }
  if (s.rs && c.resProd > 0) {
    const k = s.rs, t = TECH[k]
    s.rp[k] = (s.rp[k] || 0) + c.resProd
    if (s.rp[k] >= t.c) {
      stops.add('research'); s.tech[k] = 1; delete s.rp[k]; s.rs = null
      nextResearch(s)
      note('★ Naukowcy ukończyli projekt: ' + t.n + '! ' + t.d + '.' + (s.rs ? ' Teraz badają: ' + TECH[s.rs].n + '.' : ' Kolejka badań jest pusta – wybierz kolejny projekt w zakładce TECHNOLOGIE.'), 'pos'); beep(990, 0.15)
    }
  } else if (!s.rs && c.resProd > 0 && nextTech(s)) add('nores')
  edge('nores', !s.rs && c.resProd > 0 && nextTech(s))
  edge('hunger', deaths > 0)
  s.was = now
  s.m++

  if (acc && Array.isArray(s.report)) { mergeRep(s.report, r); s.repDays = (s.repDays || 1) + 1 }
  else { s.report = r; s.repDays = 1 }

  if (s.hungerDays >= HUNGER_MAX) s.over = { win: false, t: 'ŚMIERĆ GŁODOWA', d: 'Kolonia głodowała przez ' + HUNGER_MAX + ' dni. Nie przeżył nikt.' }
  else if (scenarioOf(s).goal.done(s)) s.over = { win: true, t: 'ZWYCIĘSTWO!', d: scenarioOf(s).win || 'Cel scenariusza osiągnięty.' }
  else if (s.pop < 10) s.over = { win: false, t: 'KOLONIA UPADŁA', d: 'Zostało zbyt mało osadników, by przetrwać.' }
  else if (s.mor <= 5) s.over = { win: false, t: 'BUNT!', d: 'Koloniści przejęli władzę i odesłali cię na Ziemię.' }
  else if (s.cr < -500) s.over = { win: false, t: 'BANKRUCTWO', d: 'Długi przekroczyły 500 kredytów. Korporacja przejmuje kolonię.' }
  else if (s.m > DAYS) s.over = { win: false, t: 'KONIEC KADENCJI', d: 'Minął rok. Nie osiągnąłeś celu, ale kolonia przetrwała.' }
  if (s.over) stops.add('over')
  trackStats(s)
  record(s, [...stops])
  return [...stops]
}
