import { SPEC, limOf } from './constants.js'

// Szkolenie specjalistów według celów. s.specTgt[T] = liczba (cel ręczny) albo brak (AUTO).
// AUTO: tylu specjalistów, ile jest dla nich stanowisk w budynkach (bez budów i napraw, których obsada się waha).
const VARIABLE = ['build', 'repair']

export function specPosts(s, c) {
  const r = {}
  for (const T in SPEC) r[T] = Math.ceil(SPEC[T].jobs.filter(k => !VARIABLE.includes(k)).reduce((a, k) => a + Math.min(c.wNeed[k] || 0, limOf(s, k)), 0) - 1e-9)
  return r
}

export const isAuto = (s, T) => !s.specTgt || s.specTgt[T] == null

export function specTargets(s, c) {
  const posts = specPosts(s, c), r = {}
  for (const T in SPEC) r[T] = isAuto(s, T) ? posts[T] : s.specTgt[T]
  return r
}

// ilu specjalistów brakuje do celu (dla każdej specjalizacji i razem)
export function specDeficit(s, c) {
  const tg = specTargets(s, c), by = {}
  let total = 0
  for (const T in SPEC) { by[T] = Math.max(0, tg[T] - ((s.spec && s.spec[T]) || 0)); total += by[T] }
  return { by, total, tg }
}

// kogo szkolić: specjalizację z największym brakiem (względem celu), albo null, gdy cele są osiągnięte
export function trainPick(s, c) {
  const { by, tg } = specDeficit(s, c)
  let best = null, bv = 0
  for (const T in SPEC) { const v = by[T] / Math.max(1, tg[T]); if (by[T] > 0 && v > bv) { best = T; bv = v } }
  return best
}

export function setSpecTarget(s, T, v) {
  if (!s.specTgt) s.specTgt = {}
  if (v == null) delete s.specTgt[T]
  else s.specTgt[T] = Math.max(0, Math.round(v))
}

// zwolnienie: specjalista wraca do zwykłej pracy (cel ręczny nie może być wyższy niż stan, inaczej szkoła wyszkoli go od razu)
export function dismissSpec(s, T) {
  if (!s.spec || !(s.spec[T] > 0)) return false
  s.spec[T]--
  if (!s.specTgt) s.specTgt = {}
  s.specTgt[T] = Math.min(s.specTgt[T] ?? Infinity, s.spec[T])
  return true
}
