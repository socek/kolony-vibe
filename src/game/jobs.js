import { jobOrder } from './constants.js'

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
