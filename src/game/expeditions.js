// Złoża minerałów i wyprawy poszukiwawcze
import { bumpStat } from './badges.js'
import { TECH, techReady, houseCapOf } from './constants.js'

export const START_DEPOSIT = 1200
export const MIN_POP_LEFT = 20 // tylu kolonistów musi zostać w kolonii

// Cele wypraw: czas, bazowa szansa na znalezisko, wielkość złoża [min, max] i ryzyko strat
export const RANGES = [
  { k: 'near', n: 'Bliska okolica', days: 5, chance: 0.45, size: [200, 500], risk: 0, places: ['w pobliskim kraterze', 'przy starym kanionie', 'pod Równiną Lądowania'] },
  { k: 'caves', n: 'Jaskinie lawowe', days: 7, chance: 0.5, size: [300, 700], risk: 0.03, places: ['w Tunelach Bazaltowych', 'w Grocie Szeptów', 'pod Kopułą Lawy'] },
  { k: 'mid', n: 'Dalsze wzgórza', days: 10, chance: 0.6, size: [400, 1000], risk: 0.05, places: ['na Rdzawych Wzgórzach', 'w Dolinie Echa', 'pod Grzbietem Burz'] },
  { k: 'canyon', n: 'Wielki Kanion', days: 12, chance: 0.55, size: [600, 1400], risk: 0.08, places: ['na dnie Wielkiego Kanionu', 'w Rozpadlinie Wiatrów', 'na Półce Pionierów'] },
  { k: 'ice', n: 'Czapa polarna', days: 15, chance: 0.5, size: [900, 1800], risk: 0.1, places: ['pod Lodowcem Północnym', 'w Szczelinie Mrozu', 'na Białym Płaskowyżu'] },
  { k: 'volcano', n: 'Pas wulkaniczny', days: 18, chance: 0.7, size: [1200, 2500], risk: 0.2, req: 'rover', places: ['u stóp Ognistej Góry', 'w Polu Gejzerów', 'na Siarkowych Stokach'] },
  { k: 'far', n: 'Odległe pustkowia', days: 20, chance: 0.75, size: [800, 2000], risk: 0.12, places: ['na Pustkowiach Szkła', 'za Morzem Pyłu', 'w Górach Cienia'] },
  { k: 'meteor', n: 'Pole meteorytowe', days: 25, chance: 0.85, size: [1500, 3000], risk: 0.15, req: 'rover', places: ['w Kraterze Upadłej Gwiazdy', 'na Żelaznym Polu', 'w Dolinie Odłamków'] }
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
  return 'Złoże minerałów ' + place
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
  { k: 'dep', n: 'ZŁOŻA', d: 'nowe złoże minerałów' },
  { k: 'ruins', n: 'RUINY', d: 'punkty badań z ruin dawnych osadników' },
  { k: 'wreck', n: 'WRAKI', d: 'kredyty, minerały albo części do technologii' },
  { k: 'settlers', n: 'OSADNICY', d: 'kontakt z innymi osadnikami' }
]
export const OTHER_CHANCE = 0.05
export const MAX_SPEC_IN_TEAM = 2
const NB_NAMES = ['Nowe Bajoro', 'Osada Pod Skałą', 'Przystań Uparciuchów', 'Kolonia Wieczny Poniedziałek', 'Wioska Zagubionych Bagaży']

export function canSend(s, rk, team, sol = 0, eng = 0) {
  const r = rangeOf(rk), t = teamOf(team), cost = expCost(r, t, s), sp = s.spec || {}
  if (r.req && !s.tech[r.req]) return 'Ten cel wymaga technologii.'
  if (s.cr < cost.cr) return 'Brakuje kredytów na sprzęt.'
  if (s.food < cost.food) return 'Brakuje żywności na prowiant.'
  if (s.pop - t.n < MIN_POP_LEFT) return 'W kolonii musi zostać co najmniej ' + MIN_POP_LEFT + ' osób.'
  if (sol > (sp.sol || 0)) return 'Za mało żołnierzy.'
  if (eng > (sp.eng || 0)) return 'Za mało inżynierów.'
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
  const k = s.rs || Object.keys(TECH).find(t => !s.tech[t] && techReady(s, t))
  if (!k) { s.cr += pts * 5; return pts * 5 + ' kr (nie było czego badać)' }
  s.rp[k] = (s.rp[k] || 0) + pts
  return pts + ' pkt badań (' + TECH[k].n + ')'
}

// znalezisko danego rodzaju; zwraca opis
function find(s, kind, x, r, t) {
  const rnd = Math.random, eng = x.eng || 0, scale = t.mult * (r.days / 10)
  if (kind === 'dep') {
    const name = depositName(r.places[Math.floor(rnd() * r.places.length)])
    const size = addDeposit(s, name, (r.size[0] + rnd() * (r.size[1] - r.size[0])) * t.mult * (1 + 0.1 * eng))
    return 'odkryto ' + name + ' – ' + size + ' t'
  }
  if (kind === 'ruins') return 'w ruinach znaleziono zapiski: ' + addResearch(s, Math.round((20 + rnd() * 60) * scale))
  if (kind === 'wreck') {
    const m = scale * (1 + 0.5 * eng), roll = rnd()
    if (roll < 0.4) { const v = Math.round((100 + rnd() * 300) * m); s.cr += v; return 'z wraku odzyskano sprzęt wart ' + v + ' kr' }
    if (roll < 0.75) { const v = Math.round((80 + rnd() * 220) * m); s.min += v; return 'z wraku odzyskano ' + v + ' t minerałów' }
    return 'z wraku wymontowano części do technologii: ' + addResearch(s, Math.round((15 + rnd() * 45) * m))
  }
  // osadnicy
  const roll = rnd()
  if (!s.nb && roll < 0.25) {
    s.nb = { n: NB_NAMES[Math.floor(rnd() * NB_NAMES.length)], cd: {} }
    return 'odkryto stałą osadę sąsiedzką „' + s.nb.n + '” – można z nią handlować (zakładka RYNEK)'
  }
  if (roll < 0.55) { s.food += 120; s.cr += 100; return 'osadnicy wymienili się towarami: +120 t żywności i 100 kr' }
  if (roll < 0.8) { const n = Math.round(Math.min(5 + rnd() * 10, Math.max(0, houseCapOf(s) - s.pop))); s.pop += n; return n ? n + ' osadników postanowiło dołączyć do kolonii' : 'osadnicy chcieli dołączyć, ale nie ma dla nich miejsca' }
  const loss = Math.max(0, Math.round((1 + rnd() * 3) * (1 - 0.4 * (x.sol || 0))))
  s.pop -= Math.min(loss, s.pop)
  return loss ? 'spotkanie z osadnikami skończyło się bójką – zginęło ' + loss + ' kolonistów' : 'osadnicy byli wrogo nastawieni, ale żołnierze załagodzili sytuację'
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
    const lostTxt = lost ? ' Zginęło ' + lost + ' z ' + x.team + ' uczestników.' : ''
    const finds = []
    const main = goal === 'dep' ? expChance(r, t, s) : Math.min(0.95, r.chance + t.bonus)
    if (Math.random() < main) finds.push(find(s, goal, x, r, t))
    for (const g of GOALS) if (g.k !== goal && Math.random() < OTHER_CHANCE) finds.push('przy okazji: ' + find(s, g.k, x, r, t))
    const what = GOALS.find(g => g.k === goal).n.toLowerCase()
    if (finds.length) note('★ Wyprawa (' + r.n + ', cel: ' + what + ') wróciła: ' + finds.join('; ') + '.' + lostTxt, lost ? 'warn' : 'pos')
    else note('Wyprawa (' + r.n + ', cel: ' + what + ') wróciła z niczym.' + lostTxt, lost ? 'neg' : 'warn')
    return false
  })
  return back
}

// Handel z osadą sąsiedzką: każda wymiana raz na 7 dni
export const NB_TRADES = [
  { k: 'food', n: 'Kup 50 t żywności', d: '−150 kr, +50 t żywności', need: s => s.cr < 150 ? 'Brakuje kredytów.' : '', run: s => { s.cr -= 150; s.food += 50 } },
  { k: 'min', n: 'Sprzedaj 50 t minerałów', d: '−50 t minerałów, +400 kr', need: s => s.min < 50 ? 'Brakuje minerałów.' : '', run: s => { s.min -= 50; s.cr += 400 } },
  { k: 'people', n: 'Zaproś rodziny osadników', d: '−200 kr, +8 kolonistów (jeśli jest miejsce)', need: s => s.cr < 200 ? 'Brakuje kredytów.' : houseCapOf(s) - s.pop < 8 ? 'Brak miejsca w modułach mieszkalnych.' : '', run: s => { s.cr -= 200; s.pop += 8 } }
]
export function nbWait(s, k) { return s.nb ? Math.max(0, (s.nb.cd[k] || 0) - s.m) : 0 }
export function nbTrade(s, k) {
  const t = NB_TRADES.find(x => x.k === k)
  if (!s.nb || !t || nbWait(s, k) || t.need(s)) return false
  t.run(s); s.nb.cd[k] = s.m + 7
  return true
}
