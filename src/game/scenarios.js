// Scenariusze: każdy ma własny cel, historię, stały poziom trudności (mnożnik wyniku) i może zmieniać zasady.
// Wspólna fabuła: przygotowania do setnych urodzin Imperatora Gały, władcy Ludzkiej Unii Jedności.
import { BLD, TECH, DAYS } from './constants.js'
import { t, localize } from '../i18n.js'
import { addDeposit, depositName } from './expeditions.js'

export const DIFF = {
  easy: { mult: 1, color: 'var(--green)' },
  normal: { mult: 1.5, color: 'var(--yellow)' },
  hard: { mult: 2, color: 'var(--red)' },
  // tryb swobodny (Piaskownica): bez wyniku
  free: { mult: 0, color: 'var(--cyan)' }
}

// Początek fabuły (ekran startowy) i wstęp do wyboru scenariusza są w słownikach: story.boot, story.prologue

const R = Math.round, rnd = () => Math.random()
const pct = (v, n) => Math.min(100, v / n * 100)
const popGoal = n => ({
  get text () { return t('sc.goal.pop', { n }) }, get short () { return t('sc.goal.popShort', { n }) },
  progress: s => pct(s.pop, n), done: s => s.pop >= n, status: s => t('sc.st.pop', { a: R(s.pop), n })
})
const instances = s => { const out = []; for (const k in s.cond || {}) for (const x of s.cond[k]) out.push([k, x]); return out }

// pory roku (dzień roku → pora); wpływają na elektrownie słoneczne, plony i ogrzewanie
export const SEASONS = {
  winter: { solar: 0.7, food: 0.8, heat: 0.02 },
  spring: { solar: 1, food: 1, heat: 0 },
  summer: { solar: 1.2, food: 1.1, heat: 0 },
  autumn: { solar: 0.9, food: 1.3, heat: 0 }
}
const SEASON_STARTS = [[1, 'winter'], [60, 'spring'], [152, 'summer'], [244, 'autumn'], [335, 'winter']]
export function yearSeason(day) {
  const d = ((day - 1) % DAYS) + 1
  let cur = 'winter'
  for (const [from, k] of SEASON_STARTS) if (d >= from) cur = k
  const nxt = SEASON_STARTS.find(([from, k]) => from > d && k !== cur) || [DAYS + 60, 'spring']
  return { k: cur, ...SEASONS[cur], next: SEASONS[nxt[1]].n, inDays: nxt[0] - d }
}

export const SCENARIOS = [
  {
    k: 'moon', diff: 'easy', ready: true,
    goal: popGoal(1000),
  },
  {
    k: 'purr', diff: 'normal', ready: true,
    goal: {
      get text () { return t('sc.purr.goal') }, get short () { return t('sc.purr.short') },
      progress: s => (pct(s.pop, 600) + pct(s.tamed || 0, 50)) / 2,
      done: s => s.pop >= 600 && (s.tamed || 0) >= 50,
      status: s => t('sc.purr.status', { a: R(s.pop), b: s.tamed || 0 })
    },
    season: s => yearSeason(s.m),
    hunt: true,
    // gra zaczyna się zimą: więcej farm i zapasów, żeby przetrwać do wiosny
    start: s => { s.tamed = 0; s.tameProg = 0; s.lim.hunt = 0; s.b.farm = 4; s.b.power = 3; s.b.fridge = 2; s.food = 600; s.b.house = 3; s.pop = 130 },
    tick: (s, c, note, add) => {
      const stops = []
      // oswajanie w zagrodach
      s.tameProg = (s.tameProg || 0) + c.tameRate
      while (s.tameProg >= 1 && (s.tamed || 0) < (s.b.pen || 0) * 20) { s.tameProg -= 1; s.tamed = (s.tamed || 0) + 1; add('tamed', { a: 1 }) }
      if (s.tameProg > 1) s.tameProg = 1
      // fauna: wiosną dwa razy częściej, myśliwi ją rozdrażniają
      const sea = yearSeason(s.m), hunting = c.E.hunt > 0 && c.wNeed.hunt > 0
      if (rnd() < 0.06 * (sea.k === 'spring' ? 2 : 1) * (hunting ? 1.5 : 1)) {
        const good = rnd() < ({ spring: 0.5, summer: 0.5, autumn: 0.4, winter: 0.3 }[sea.k]) * (hunting ? 0.7 : 1)
        const red = c.faunaRed, roll = rnd()
        if (good) {
          if (roll < 0.4) { s.food += 60; note(t('sc.purr.f.bugs'), 'pos') }
          else if (roll < 0.7) { const n = depositName(t('sc.purr.f.trail')), a = addDeposit(s, n, 300); note(t('sc.purr.f.dep', { n, a }), 'pos') }
          else if ((s.b.pen || 0) * 20 > (s.tamed || 0)) { s.tamed = (s.tamed || 0) + 1; note(t('sc.purr.f.stray'), 'pos') }
          else { s.mor += 2; note(t('sc.purr.f.purr'), 'pos') }
          stops.push('faunaGood')
        } else {
          let txt
          if (roll < 0.35) { const l = R(s.food * 0.15 * (1 - red)); s.food -= l; txt = t('sc.purr.b.food', { l }) }
          else if (roll < 0.6 && s.cond && s.cond.mine && s.cond.mine.length && rnd() > red) { s.cond.mine[0].broken = true; txt = t('sc.purr.b.mine') }
          else if (roll < 0.75 && s.exp.length) { const x = s.exp[0], l = Math.min(2, x.team - 1); x.team -= l; txt = t('sc.purr.b.exp', { l }) }
          else if (rnd() > red) {
            const ks = Object.keys(BLD).filter(k => s.b[k] > 0), k = ks[Math.floor(rnd() * ks.length)]
            if (k) { s.b[k]--; txt = t('sc.purr.b.bld', { n: BLD[k].n }) } else txt = t('sc.purr.b.empty')
          } else txt = t('sc.purr.b.fence')
          if (s.b.fence && rnd() < 0.25) { s.b.fence--; txt += t('sc.purr.b.fenceLost') }
          note(t('sc.purr.b', { txt }), 'neg'); stops.push('faunaBad')
        }
      }
      return stops
    }
  },
  {
    k: 'ticktock', diff: 'normal', ready: true,
    goal: {
      get text () { return t('sc.ticktock.goal') }, get short () { return t('sc.ticktock.short') },
      progress: s => s.tech.stretch ? pct(s.pop, 300) : Math.min(99, ['chrono1', 'chrono2', 'stretch'].reduce((a, k) => a + (s.tech[k] ? 30 : 0), 0) + (s.rs === 'stretch' ? 9 : 0)),
      done: s => !!s.tech.stretch && s.pop >= 300,
      status: s => t('sc.ticktock.status', { done: !!s.tech.stretch, a: R(s.pop) })
    },
    start: s => { s.dep[0].t = s.dep[0].max = 500; s.b.lab = 2; s.spec.sci = 16; s.b.farm = 4; s.food = 400; s.mods = { farmMul: 0.75 } },
    tick: (s, c, note) => {
      if (rnd() >= 0.05) return []
      // pętle czasowe sprawiają, że anomalie częściej pomagają
      const helpful = rnd() < (s.tech.chrono2 ? 0.7 : 0.5), k = s.rs
      if (helpful) {
        if (rnd() < 0.5) { s.m -= 1; note(t('sc.ticktock.a.repeat'), 'pos') }
        else if (k) { const p = R(TECH[k].c * 0.15); s.rp[k] = (s.rp[k] || 0) + p; note(t('sc.ticktock.a.future', { n: TECH[k].n, p }), 'pos') }
        else { s.m -= 1; note(t('sc.ticktock.a.repeat'), 'pos') }
        return ['anomalyGood']
      }
      if (rnd() < 0.5 || !k) { s.m += 1; note(t('sc.ticktock.a.lost'), 'neg') }
      else { const p = R((s.rp[k] || 0) * 0.2 * (s.tech.chrono1 ? 0.5 : 1)); s.rp[k] = (s.rp[k] || 0) - p; note(t('sc.ticktock.a.back', { n: TECH[k].n, p }), 'neg') }
      return ['anomalyBad']
    }
  },
  {
    k: 'splash', diff: 'hard', ready: true,
    goal: {
      get text () { return t('sc.splash.goal') }, get short () { return t('sc.splash.short') },
      progress: s => (pct(s.b.golf || 0, 18) * 3 + pct(s.pop, 400)) / 4,
      done: s => (s.b.golf || 0) >= 18 && s.pop >= 400,
      status: s => t('sc.splash.status', { a: s.b.golf || 0, b: R(s.pop) })
    },
    slots: { base: 14, per: { platform: 4 }, free: ['platform', 'golf', 'kelp'] },
    start: s => { s.dep[0].t = s.dep[0].max = 300; s.mods = { farmMul: 0.6, depMul: 0.5 } },
    tick: (s, c, note) => {
      if (rnd() >= 0.04) return []
      const hit = instances(s).sort(() => rnd() - 0.5).slice(0, 2)
      for (const [, x] of hit) { x.c = Math.max(1, x.c - 40); if (rnd() < 0.3) x.broken = true }
      let txt = hit.length ? t('sc.splash.storm', { n: hit.map(([k]) => BLD[k].n).join(t('sc.and')) }) : t('sc.splash.stormNone')
      if (s.b.golf && rnd() < 0.2) { s.b.golf--; txt += t('sc.splash.golfLost') }
      note(txt + '.', 'neg')
      return ['storm']
    }
  },
  {
    k: 'sill', diff: 'hard', ready: true,
    goal: {
      get text () { return t('sc.sill.goal') }, get short () { return t('sc.sill.short') },
      progress: s => ((s.b.gallery ? 100 : Math.min(90, ((s.q.find(x => x.k === 'gallery') || {}).d || 0) / BLD.gallery.bt * 90)) * 2 + pct(s.pop, 500)) / 3,
      done: s => (s.b.gallery || 0) >= 1 && s.pop >= 500,
      status: s => t('sc.sill.status', { st: s.b.gallery ? 'done' : s.q.some(x => x.k === 'gallery') ? 'build' : 'no', a: R(s.pop) })
    },
    ban: ['mine', 'mine2'],
    slots: { base: 12, per: { module: 3 }, free: ['module'] },
    start: s => { s.dep = []; s.min = 600; s.b.mine = 0; s.mods = { noMines: true } },
    tick: (s, c, note) => {
      if (rnd() >= 0.03) return []
      const eng = Math.min(0.6, ((s.spec && s.spec.eng) || 0) * 0.05)
      const lost = Math.max(0, R((2 + rnd() * 4) * (1 - eng)))
      s.pop -= Math.min(lost, s.pop); s.mor -= 5
      const all = instances(s); if (all.length) all[Math.floor(rnd() * all.length)][1].broken = true
      note(t('sc.sill.breach', { n: lost }), 'neg')
      return ['breach']
    }
  },
  {
    k: 'ice', diff: 'hard', ready: true,
    goal: {
      get text () { return t('sc.ice.goal') }, get short () { return t('sc.ice.short') },
      progress: s => pct(s.iceSent || 0, 2000), done: s => (s.iceSent || 0) >= 2000,
      status: s => t('sc.ice.status', { a: R(s.iceSent || 0) })
    },
    season: () => ({ k: 'winter', n: t('season.eternal'), solar: 0.25, food: 1, heat: 0.04, next: null }),
    // wieczna zima: na start geotermia i więcej farm, bo słońce i plony są słabe
    start: s => { s.dep[0].t = s.dep[0].max = 4000; s.iceSent = 0; s.b.geo = 2; s.b.farm = 5; s.b.fridge = 2; s.b.house = 3; s.pop = 130; s.food = 700; s.cr = 700; s.mods = { farmMul: 0.7, depMul: 1.5 } },
    tick: (s, c, note, add) => { if (c.iceProd > 0) { s.iceSent = (s.iceSent || 0) + c.iceProd; add('ice', { a: c.iceProd }) } return [] }
  },
  {
    // Piaskownica: bez celu i bez końca kadencji, przegrać można nadal; wynik nie trafia do tabeli
    k: 'sandbox', diff: 'free', ready: true, endless: true, noScore: true,
    goal: {
      get text () { return t('sc.sandbox.goal') }, get short () { return t('sc.sandbox.short') },
      progress: () => null, done: () => false,
      status: s => t('sc.sandbox.status', { n: s.m })
    },
    start: s => { s.food = 500; s.cr = 1000; s.min = 300; s.b.house = 3; s.b.farm = 4 }
  }
]

// teksty scenariuszy, poziomów trudności i pór roku ze słowników (sc.<k>.*, diff.<k>, season.<k>)
localize(Object.fromEntries(SCENARIOS.map(x => [x.k, x])), 'sc', ['n', 'patron', 'story', 'win', 'features'])
for (const k in DIFF) Object.defineProperty(DIFF[k], 'n', { get: () => t('diff.' + k), enumerable: true })
for (const k in SEASONS) Object.defineProperty(SEASONS[k], 'n', { get: () => t('season.' + k), enumerable: true })

// scenariusz bez limitu dni i bez wyniku (Piaskownica)
export const endless = s => !!scenarioOf(s).endless

export const scenarioOf = s => SCENARIOS.find(x => x.k === ((s && s.sc) || 'moon')) || SCENARIOS[0]
export const diffOf = s => DIFF[scenarioOf(s).diff]
export const seasonOf = s => { const f = scenarioOf(s).season; return f ? f(s) : null }

// dostępność budynków i technologii w scenariuszu
export const bldAvail = (s, k) => (!BLD[k].sc || BLD[k].sc.includes(scenarioOf(s).k)) && !(scenarioOf(s).ban || []).includes(k)
export const techAvail = (s, k) => !TECH[k].sc || TECH[k].sc.includes(scenarioOf(s).k)

// miejsca na budynki (tylko w scenariuszach z ograniczonym miejscem)
export function slotsInfo(s) {
  const sl = scenarioOf(s).slots
  if (!sl) return null
  const free = k => sl.free.includes(k)
  let max = sl.base, used = 0
  for (const k in BLD) { if (sl.per[k]) max += (s.b[k] || 0) * sl.per[k]; if (!free(k)) used += s.b[k] || 0 }
  used += s.q.filter(x => !free(x.k)).length
  return { max, used, free }
}
export function buildBlock(s, k) {
  if (!bldAvail(s, k)) return t('sc.na')
  const sl = slotsInfo(s)
  if (sl && !sl.free(k) && sl.used >= sl.max) return t(scenarioOf(s).k === 'splash' ? 'sc.noSlotsSplash' : 'sc.noSlotsSill')
  return ''
}
