import { BLD } from './constants.js'

// Zużycie budynków: każdy egzemplarz ma stan c (0..100) i może mieć awarię (broken).
// s.cond = { farm: [{ c: 100, broken: false }, ...], ... }
export const WEAR_PER_DAY = 0.35
export const REPAIR_PER_WORKER = 1.5 // punkty stanu dziennie na konserwatora
export const FIXED_AT = 40 // awaria jest usunięta, gdy stan wróci do tej wartości

// pilnuje, żeby liczba egzemplarzy zgadzała się z liczbą budynków (nowe – 100%, ubyłe – najgorsze)
export function syncCond(s) {
  if (!s.cond) s.cond = {}
  for (const k in BLD) {
    const a = s.cond[k] || (s.cond[k] = []), n = s.b[k] || 0
    while (a.length < n) a.push({ c: 100, broken: false })
    if (a.length > n) { a.sort((x, y) => y.c - x.c); a.length = n }
  }
  return s.cond
}

// mnożnik sprawności budynków danego typu: zużycie obniża sprawność do 60%, awaria – do zera
export function condMul(s, k) {
  const a = (s.cond && s.cond[k]) || [], n = s.b[k] || 0
  if (!n) return 1
  // egzemplarze jeszcze bez zapisanego stanu liczą się jak nowe
  const known = a.slice(0, n)
  return (known.reduce((t, x) => t + (x.broken ? 0 : 0.6 + 0.4 * x.c / 100), 0) + (n - known.length)) / n
}

// ile konserwatorów potrzeba: pół osoby na każdy egzemplarz poniżej 95% (awaria – jedna osoba)
export function repairNeed(s) {
  let n = 0
  for (const k in BLD) for (const x of (s.cond && s.cond[k]) || []) n += x.broken ? 1 : x.c < 95 ? 0.5 : 0
  return n
}

export const avgCond = s => {
  let t = 0, n = 0
  for (const k in BLD) for (const x of (s.cond && s.cond[k]) || []) { t += x.c; n++ }
  return n ? t / n : 100
}
export const brokenCount = s => Object.values(s.cond || {}).reduce((t, a) => t + a.filter(x => x.broken).length, 0)

// Jeden dzień: zużycie, awarie, rozpad i naprawy (points – punkty napraw na dziś).
// Zwraca { stops, broke: [nazwy], collapsed: [nazwy] }.
export function tickWear(s, points) {
  syncCond(s)
  const broke = [], collapsed = [], stops = []
  for (const k in BLD) {
    const a = s.cond[k]
    for (const x of a) {
      x.c -= WEAR_PER_DAY * (0.6 + Math.random() * 0.8)
      // im gorszy stan, tym większa szansa awarii
      if (!x.broken && Math.random() < 0.03 * Math.pow(1 - Math.max(0, x.c) / 100, 2)) { x.broken = true; broke.push(BLD[k].n) }
    }
    const gone = a.filter(x => x.c <= 0).length
    if (gone) { s.cond[k] = a.filter(x => x.c > 0); s.b[k] -= gone; for (let i = 0; i < gone; i++) collapsed.push(BLD[k].n) }
  }
  // naprawy: najpierw awarie, potem budynki w najgorszym stanie
  const all = []
  for (const k in BLD) for (const x of s.cond[k]) all.push(x)
  all.sort((x, y) => (y.broken - x.broken) || (x.c - y.c))
  for (const x of all) {
    if (points <= 0) break
    const d = Math.min(points, 100 - x.c)
    x.c += d; points -= d
    if (x.broken && x.c >= FIXED_AT) x.broken = false
  }
  if (broke.length) stops.push('broke')
  if (collapsed.length) stops.push('collapse')
  return { stops, broke, collapsed }
}
