import { BLD, TECH, techReady, techIn, houseCapOf } from './constants.js'

// Zlecenia Ludzkiej Unii Jedności (LUJ). Co jakiś czas przychodzi oferta; przyjęte zlecenie
// ma termin, nagrodę i karę za niewykonanie. Reputacja u LUJ zmienia wysokość nagród.
const R = Math.round, rnd = () => Math.random()
const pick = a => a[Math.floor(rnd() * a.length)]

export const ORDER_KINDS = {
  food: { n: 'Dostawa żywności', unit: 't', what: 't żywności', have: s => s.food, take: (s, n) => { s.food -= n } },
  min: { n: 'Dostawa minerałów', unit: 't', what: 't minerałów', have: s => s.min, take: (s, n) => { s.min -= n } },
  energy: { n: 'Dostawa energii', unit: 'kWh', what: 'kWh energii (przez port kosmiczny)', have: s => s.energy, take: (s, n) => { s.energy -= n }, need: s => s.b.port ? '' : 'Wymaga portu kosmicznego.' },
  people: { n: 'Wysłanie kolonistów', unit: 'os.', what: 'osób do innej kolonii', have: s => Math.max(0, s.pop - 20), take: (s, n) => { s.pop -= n } },
  tech: { n: 'Badania dla LUJ', unit: '', what: '', auto: true }
}

const WHO = ['Komitet Jubileuszowy LUJ', 'Ministerstwo Zaopatrzenia Bankietów', 'Biuro Kolonii Zamorskich', 'Kancelaria Imperialnych Prezentów', 'Departament Spraw Bardzo Pilnych']
const WHY = {
  food: ['na próbny bankiet jubileuszowy', 'dla głodujących chórzystów orkiestry jubileuszowej', 'na tort w kształcie Imperatora'],
  min: ['na pomnik Imperatora w skali 1:1', 'na fundamenty trybun jubileuszowych', 'na medale okolicznościowe'],
  energy: ['do zasilenia iluminacji jubileuszowej', 'na pokaz laserów nad stolicą', 'do podgrzania basenu Imperatora'],
  people: ['do obsługi szatni na Jubileuszu', 'jako statyści do parady', 'do nowej kolonii na pograniczu'],
  tech: ['bo Imperator usłyszał o tym w radiu', 'do raportu dla Rady Unii', 'na wystawę osiągnięć ludzkości']
}

const repMul = s => 0.5 + (s.ord ? s.ord.rep : 50) / 100 // reputacja 0..100 → nagrody ×0,5..×1,5

export function ensureOrders(s) {
  if (!s.ord) s.ord = { rep: 50, next: 15, offers: [], active: [], seq: 0 }
  return s.ord
}

// tworzy nową ofertę dopasowaną do wielkości kolonii
export function makeOffer(s) {
  const o = ensureOrders(s), scale = Math.max(1, s.pop / 100)
  const kinds = ['food', 'min', 'people', 'tech', ...(s.b.port ? ['energy'] : [])]
  let kind = pick(kinds), tech = null
  if (kind === 'tech') {
    tech = pick(Object.keys(TECH).filter(k => techIn(s, k) && !s.tech[k] && k !== s.rs)) || null
    if (!tech) kind = 'food'
  }
  const amount = { food: R(120 * scale / 10) * 10, min: R(100 * scale / 10) * 10, energy: R(80 * scale / 10) * 10, people: R(5 + 5 * scale), tech: 0 }[kind]
  const days = kind === 'tech' ? 40 + R(rnd() * 30) : 15 + R(rnd() * 20)
  const value = kind === 'tech' ? TECH[tech].c * 8 : amount * { food: 2.5, min: 3, energy: 3, people: 40 }[kind]
  const rewards = pick([['cr'], ['cr', 'pop'], ['techpts'], ['building'], ['cr', 'building']])
  const penalty = pick(['none', 'cr', 'mor', 'rep'])
  const offer = {
    id: ++o.seq, kind, tech, amount, days, expires: s.m + 5,
    who: pick(WHO), why: pick(WHY[kind]),
    reward: { cr: rewards.includes('cr') ? R(value * 1.6 * repMul(s) / 10) * 10 : 0, pop: rewards.includes('pop') ? R(5 + scale * 3) : 0, techpts: rewards.includes('techpts') ? R(value / 8) : 0, building: rewards.includes('building') ? pick(['farm', 'power', 'house', 'fridge', 'store', 'battery']) : null },
    penalty: { kind: penalty, cr: R(value * 0.6 / 10) * 10, mor: 8, rep: 15 }
  }
  o.offers.push(offer)
  return offer
}

export const orderTitle = x => x.kind === 'tech' ? 'Zbadaj technologię: ' + TECH[x.tech].n : ORDER_KINDS[x.kind].n + ': ' + x.amount + ' ' + ORDER_KINDS[x.kind].what

export function rewardText(x) {
  const r = x.reward, p = []
  if (r.cr) p.push(r.cr + ' kr')
  if (r.pop) p.push(r.pop + ' kolonistów')
  if (r.techpts) p.push(r.techpts + ' pkt badań')
  if (r.building) p.push('darmowy budynek: ' + BLD[r.building].n)
  return p.join(' + ')
}
export function penaltyText(x) {
  const p = x.penalty
  return { none: 'brak (tylko utrata nagrody)', cr: 'grzywna ' + p.cr + ' kr', mor: '−' + p.mor + ' morale', rep: '−' + p.rep + ' reputacji u LUJ' }[p.kind]
}

export function canAccept(s, id) {
  const o = ensureOrders(s)
  if (o.active.length >= 3) return 'Możesz mieć najwyżej 3 zlecenia naraz.'
  return o.offers.some(x => x.id === id) ? '' : 'Oferta wygasła.'
}
export function accept(s, id) {
  if (canAccept(s, id)) return false
  const o = s.ord, x = o.offers.find(y => y.id === id)
  o.offers = o.offers.filter(y => y.id !== id)
  x.deadline = s.m + x.days
  o.active.push(x)
  return true
}

export function canDeliver(s, id) {
  const x = ensureOrders(s).active.find(y => y.id === id)
  if (!x || x.kind === 'tech') return 'Wykonuje się samo po odkryciu technologii.'
  const k = ORDER_KINDS[x.kind]
  if (k.need && k.need(s)) return k.need(s)
  return k.have(s) >= x.amount ? '' : 'Za mało: masz ' + R(k.have(s)) + ' ' + k.unit + '.'
}

function grant(s, x) {
  const r = x.reward, o = s.ord
  s.cr += r.cr
  if (r.pop) s.pop += Math.min(r.pop, Math.max(0, houseCapOf(s) - s.pop))
  if (r.techpts) { if (s.rs) s.rp[s.rs] = (s.rp[s.rs] || 0) + r.techpts; else { const k = Object.keys(TECH).find(t => techIn(s, t) && !s.tech[t] && techReady(s, t)); if (k) s.rp[k] = (s.rp[k] || 0) + r.techpts } }
  if (r.building) s.b[r.building]++
  o.rep = Math.min(100, o.rep + 6)
  o.active = o.active.filter(y => y.id !== x.id)
}

export function deliver(s, id) {
  if (canDeliver(s, id)) return null
  const x = s.ord.active.find(y => y.id === id)
  ORDER_KINDS[x.kind].take(s, x.amount)
  grant(s, x)
  return 'Zlecenie wykonane (' + orderTitle(x) + '). Nagroda: ' + rewardText(x) + '.'
}

// codzienny przegląd zleceń; note(tekst, klasa); zwraca listę powodów zatrzymania przewijania
export function tickOrders(s, note) {
  const o = ensureOrders(s), stops = []
  o.offers = o.offers.filter(x => x.expires >= s.m)
  for (const x of [...o.active]) {
    if (x.kind === 'tech' && s.tech[x.tech]) { grant(s, x); note('★ LUJ: zlecenie wykonane – odkryto ' + TECH[x.tech].n + '. Nagroda: ' + rewardText(x) + '.', 'pos'); continue }
    if (s.m > x.deadline) {
      const p = x.penalty
      if (p.kind === 'cr') s.cr -= p.cr
      if (p.kind === 'mor') s.mor -= p.mor
      o.rep = Math.max(0, o.rep - 8 - (p.kind === 'rep' ? p.rep : 0))
      o.active = o.active.filter(y => y.id !== x.id)
      note('LUJ: minął termin zlecenia „' + orderTitle(x) + '”. Kara: ' + penaltyText(x) + '.', 'neg')
      stops.push('orderFail')
    }
  }
  if (s.m >= o.next) {
    const x = makeOffer(s)
    o.next = s.m + 15 + R(rnd() * 15)
    note('★ LUJ: nowa oferta zlecenia – ' + orderTitle(x) + '.', 'sub', 'Szczegóły w zakładce IMPERIUM.')
    stops.push('order')
  }
  return stops
}
