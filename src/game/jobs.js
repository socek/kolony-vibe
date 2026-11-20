import { jobOrder, pwrOrder } from './constants.js'

// Kolejność zadań i limity ludzi (zakładka PRACOWNICY)

// przesuwa zadanie k tuż przed zadanie before (albo na koniec, gdy before = null)
export function moveJob(s, k, before) {
  if (k === before) return
  const o = jobOrder(s).filter(x => x !== k), i = before == null ? -1 : o.indexOf(before)
  o.splice(i < 0 ? o.length : i, 0, k)
  s.order = o
}

// przesuwa zadanie o d pozycji wśród podanych (widocznych) zadań
export function shiftJob(s, k, d, visible) {
  const v = jobOrder(s).filter(x => visible.includes(x)), i = v.indexOf(k), j = i + d
  if (i < 0 || j < 0 || j >= v.length) return false
  moveJob(s, k, d < 0 ? v[j] : (v[j + 1] ?? null))
  return true
}

// limit ludzi: liczba (0 = STOP) albo null – bez limitu
export function setLim(s, k, v) {
  if (!s.lim) s.lim = {}
  if (v == null) delete s.lim[k]
  else s.lim[k] = Math.max(0, Math.round(v))
}

// Place budowy: kolejność w kolejce s.q to priorytet (pierwszy dostaje budowniczych jako pierwszy),
// lim – limit budowniczych na placu (0 = budowa wstrzymana, brak = bez limitu); id – do przeciągania
export const siteCap = (x, need) => Math.min(need, x.lim ?? Infinity)
export function newSite(s, k) { s.qid = (s.qid || 0) + 1; return { k, d: 0, id: s.qid } }
// nadaje id placom ze starych zapisów
export function siteIds(s) { for (const x of s.q || []) if (x.id == null) x.id = s.qid = (s.qid || 0) + 1 }
export function moveSite(s, id, before) {
  const i = s.q.findIndex(x => x.id === id)
  if (i < 0 || id === before) return false
  const [x] = s.q.splice(i, 1), j = before == null ? -1 : s.q.findIndex(y => y.id === before)
  s.q.splice(j < 0 ? s.q.length : j, 0, x)
  return true
}
export function shiftSite(s, id, d) {
  const i = s.q.findIndex(x => x.id === id), j = i + d
  if (i < 0 || j < 0 || j >= s.q.length) return false
  return moveSite(s, id, d < 0 ? s.q[j].id : (s.q[j + 1] ? s.q[j + 1].id : null))
}
export function setSiteLim(s, id, v) {
  const x = s.q.find(y => y.id === id)
  if (!x) return
  if (v == null) delete x.lim
  else x.lim = Math.max(0, Math.round(v))
}

// Prąd: kolejność odbiorców (s.pwr) i liczba zasilanych budynków danego typu (s.plim; brak = wszystkie)
export function movePwr(s, k, before) {
  if (k === before) return
  const o = pwrOrder(s).filter(x => x !== k), i = before == null ? -1 : o.indexOf(before)
  o.splice(i < 0 ? o.length : i, 0, k)
  s.pwr = o
}
export function shiftPwr(s, k, d, visible) {
  const v = pwrOrder(s).filter(x => visible.includes(x)), i = v.indexOf(k), j = i + d
  if (i < 0 || j < 0 || j >= v.length) return false
  movePwr(s, k, d < 0 ? v[j] : (v[j + 1] ?? null))
  return true
}
export function setPlim(s, k, v) {
  if (!s.plim) s.plim = {}
  if (v == null) delete s.plim[k]
  else s.plim[k] = Math.max(0, Math.round(v))
}
