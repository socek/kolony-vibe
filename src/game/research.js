import { TECH, techReady } from './constants.js'

// Kolejka badań: s.rs – badany projekt, s.rq – technologie czekające w kolejce.

// stan technologii: done / active / queued / ready (można badać) / locked (brak wymagań)
export function techState(s, k) {
  if (s.tech[k]) return 'done'
  if (s.rs === k) return 'active'
  if ((s.rq || []).includes(k)) return 'queued'
  return techReady(s, k) ? 'ready' : 'locked'
}

// technologię można dodać do kolejki, jeśli każde jej wymaganie jest odkryte, badane albo już w kolejce
export function canQueue(s, k) {
  const st = techState(s, k)
  if (st === 'done' || st === 'active' || st === 'queued') return false
  const planned = new Set([s.rs, ...(s.rq || [])])
  return TECH[k].req.every(r => s.tech[r] || planned.has(r))
}

// jeśli nic nie jest badane, bierze pierwszą technologię z kolejki, której wymagania są już odkryte
export function nextResearch(s) {
  if (s.rs) return
  const i = (s.rq || []).findIndex(k => techReady(s, k))
  if (i >= 0) s.rs = s.rq.splice(i, 1)[0]
}

export function queueTech(s, k) {
  if (!canQueue(s, k)) return false
  if (!s.rq) s.rq = []
  s.rq.push(k)
  nextResearch(s)
  return true
}

// usuwa technologię z kolejki razem z technologiami, które od niej zależą
export function unqueueTech(s, k) {
  const drop = new Set([k])
  let changed = true
  while (changed) {
    changed = false
    for (const q of s.rq) if (!drop.has(q) && TECH[q].req.some(r => drop.has(r))) { drop.add(q); changed = true }
  }
  s.rq = s.rq.filter(q => !drop.has(q))
  if (drop.has(s.rs)) { s.rs = null; nextResearch(s) }
}

// zaczyna badać od razu (postęp poprzedniego projektu zostaje, a on sam wraca na początek kolejki)
export function researchNow(s, k) {
  if (!techReady(s, k) || s.tech[k] || s.rs === k) return false
  s.rq = (s.rq || []).filter(q => q !== k)
  if (s.rs) s.rq.unshift(s.rs)
  s.rs = k
  return true
}

// głębokość w drzewie: 0 dla technologii bez wymagań, potem 1 + najgłębsze wymaganie
export function techDepth(k) {
  const r = TECH[k].req
  return r.length ? 1 + Math.max(...r.map(techDepth)) : 0
}
