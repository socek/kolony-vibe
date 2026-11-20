// Odmiana liczebników (bez zależności – używana przez słowniki i moduł tłumaczeń)
// pl: 1 / 2–4 (bez 12–14) / reszta
export function plForm(n, one, few, many) {
  n = Math.abs(Math.round(n))
  if (n === 1) return one
  const d = n % 10, h = n % 100
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many
}
export const enForm = (n, one, other) => Math.abs(Math.round(n)) === 1 ? one : other
