// Złoża minerałów i wyprawy poszukiwawcze

export const START_DEPOSIT = 1200
export const MIN_POP_LEFT = 20 // tylu kolonistów musi zostać w kolonii

// Cele wypraw: czas, bazowa szansa na znalezisko, wielkość złoża [min, max] i ryzyko strat
export const RANGES = [
  { k: 'near', n: 'Bliska okolica', days: 5, chance: 0.45, size: [200, 500], risk: 0, places: ['w pobliskim kraterze', 'przy starym kanionie', 'pod Równiną Lądowania'] },
  { k: 'mid', n: 'Dalsze wzgórza', days: 10, chance: 0.6, size: [400, 1000], risk: 0.05, places: ['na Rdzawych Wzgórzach', 'w Dolinie Echa', 'pod Grzbietem Burz'] },
  { k: 'far', n: 'Odległe pustkowia', days: 20, chance: 0.75, size: [800, 2000], risk: 0.12, places: ['na Pustkowiach Szkła', 'za Morzem Pyłu', 'w Górach Cienia'] }
]
// Liczebność ekipy: premia do szansy i mnożnik wielkości złoża
export const TEAMS = [{ n: 5, bonus: 0, mult: 1 }, { n: 10, bonus: 0.1, mult: 1.2 }, { n: 20, bonus: 0.2, mult: 1.5 }]
const ORES = ['żelaza', 'tytanu', 'krzemu', 'kryształów', 'niklu', 'miedzi']

export const rangeOf = k => RANGES.find(r => r.k === k)
export const teamOf = n => TEAMS.find(t => t.n === n)
export const expChance = (r, t) => Math.min(0.95, r.chance + t.bonus)
// koszt: kredyty na sprzęt i żywność na prowiant (0,2 t na osobę dziennie)
export const expCost = (r, t) => ({ cr: t.n * r.days, food: Math.ceil(t.n * r.days * 0.2) })

export const depTotal = s => (s.dep || []).reduce((a, d) => a + d.t, 0)

export function depositName(place) {
  return 'Złoże ' + ORES[Math.floor(Math.random() * ORES.length)] + ' ' + place
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

export function canSend(s, rk, team) {
  const r = rangeOf(rk), t = teamOf(team), cost = expCost(r, t)
  if (s.cr < cost.cr) return 'Brakuje kredytów na sprzęt.'
  if (s.food < cost.food) return 'Brakuje żywności na prowiant.'
  if (s.pop - t.n < MIN_POP_LEFT) return 'W kolonii musi zostać co najmniej ' + MIN_POP_LEFT + ' osób.'
  return ''
}

export function sendExpedition(s, rk, team) {
  if (canSend(s, rk, team)) return false
  const r = rangeOf(rk), t = teamOf(team), cost = expCost(r, t)
  s.cr -= cost.cr; s.food -= cost.food; s.pop -= t.n
  s.exp.push({ r: rk, team: t.n, left: r.days })
  return true
}

// Jeden dzień wypraw; note(tekst, klasa) dopisuje do raportu. Zwraca liczbę wypraw, które wróciły.
export function tickExpeditions(s, note) {
  let back = 0
  for (const x of s.exp) x.left--
  s.exp = s.exp.filter(x => {
    if (x.left > 0) return true
    back++
    const r = rangeOf(x.r), t = teamOf(x.team)
    let alive = x.team
    if (Math.random() < r.risk) alive -= Math.max(1, Math.round(x.team * (0.1 + Math.random() * 0.2)))
    s.pop += alive
    const lost = x.team - alive, lostTxt = lost ? ' Zginęło ' + lost + ' z ' + x.team + ' uczestników.' : ''
    if (Math.random() < expChance(r, t)) {
      const name = depositName(r.places[Math.floor(Math.random() * r.places.length)])
      const size = addDeposit(s, name, (r.size[0] + Math.random() * (r.size[1] - r.size[0])) * t.mult)
      note('★ Wyprawa (' + r.n + ') wróciła: odkryto ' + name + ' – ' + size + ' t.' + lostTxt, lost ? 'warn' : 'pos')
    } else {
      note('Wyprawa (' + r.n + ') wróciła z niczym.' + lostTxt, lost ? 'neg' : 'warn')
    }
    return false
  })
  return back
}
