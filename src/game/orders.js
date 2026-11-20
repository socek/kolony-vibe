import { BLD, TECH, techReady, techIn, houseCapOf } from './constants.js'
import { t, localize } from '../i18n.js'
import { lawFx } from './laws.js'

// Zlecenia Ludzkiej Unii Jedności (LUJ). Co jakiś czas przychodzi oferta; przyjęte zlecenie
// ma termin, nagrodę i karę za niewykonanie. Reputacja u LUJ zmienia wysokość nagród.
const R = Math.round, rnd = () => Math.random()
const pick = a => a[Math.floor(rnd() * a.length)]

export const ORDER_KINDS = {
  food: { unit: 't', have: s => s.food, take: (s, n) => { s.food -= n } },
  min: { unit: 't', have: s => s.min, take: (s, n) => { s.min -= n } },
  energy: { unit: 'kWh', have: s => s.energy, take: (s, n) => { s.energy -= n }, need: s => s.b.port ? '' : t('ord.needPort') },
  people: { have: s => Math.max(0, s.pop - 20), take: (s, n) => { s.pop -= n } },
  tech: { unit: '', auto: true }
}

// zleceniodawcy i powody zleceń – w słownikach (ord.who, ord.why.<rodzaj>)

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
    who: pick(t('ord.who')), why: pick(t('ord.why.' + kind)),
    reward: { cr: rewards.includes('cr') ? R(value * 1.6 * repMul(s) * (1 + lawFx(s, 'orders')) / 10) * 10 : 0, pop: rewards.includes('pop') ? R(5 + scale * 3) : 0, techpts: rewards.includes('techpts') ? R(value / 8) : 0, building: rewards.includes('building') ? pick(['farm', 'power', 'house', 'fridge', 'store', 'battery']) : null },
    penalty: { kind: penalty, cr: R(value * 0.6 / 10) * 10, mor: 8, rep: 15 }
  }
  o.offers.push(offer)
  return offer
}

export const orderTitle = x => x.kind === 'tech' ? t('ord.techTitle', { n: TECH[x.tech].n }) : ORDER_KINDS[x.kind].n + ': ' + x.amount + ' ' + ORDER_KINDS[x.kind].what

export function rewardText(x) {
  const r = x.reward, p = []
  if (r.cr) p.push(t('ord.r.cr', { n: r.cr }))
  if (r.pop) p.push(t('ord.r.pop', { n: r.pop }))
  if (r.techpts) p.push(t('ord.r.pts', { n: r.techpts }))
  if (r.building) p.push(t('ord.r.bld', { n: BLD[r.building].n }))
  return p.join(' + ')
}
export function penaltyText(x) {
  const p = x.penalty
  return t('ord.p.' + p.kind, p)
}

export function canAccept(s, id) {
  const o = ensureOrders(s)
  if (o.active.length >= 3) return t('ord.max3')
  return o.offers.some(x => x.id === id) ? '' : t('ord.expired')
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
  if (!x || x.kind === 'tech') return t('ord.auto')
  const k = ORDER_KINDS[x.kind]
  if (k.need && k.need(s)) return k.need(s)
  return k.have(s) >= x.amount ? '' : t('ord.few', { n: R(k.have(s)), u: k.unit })
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
  return t('ord.done', { n: orderTitle(x), r: rewardText(x) })
}

// codzienny przegląd zleceń; note(tekst, klasa); zwraca listę powodów zatrzymania przewijania
export function tickOrders(s, note) {
  const o = ensureOrders(s), stops = []
  o.offers = o.offers.filter(x => x.expires >= s.m)
  for (const x of [...o.active]) {
    if (x.kind === 'tech' && s.tech[x.tech]) { grant(s, x); note(t('ord.doneTech', { n: TECH[x.tech].n, r: rewardText(x) }), 'pos'); continue }
    if (s.m > x.deadline) {
      const p = x.penalty
      if (p.kind === 'cr') s.cr -= p.cr
      if (p.kind === 'mor') s.mor -= p.mor
      o.rep = Math.max(0, o.rep - 8 - (p.kind === 'rep' ? p.rep : 0))
      o.active = o.active.filter(y => y.id !== x.id)
      note(t('ord.fail', { n: orderTitle(x), p: penaltyText(x) }), 'neg')
      stops.push('orderFail')
    }
  }
  if (s.m >= o.next) {
    const x = makeOffer(s)
    o.next = s.m + 15 + R(rnd() * 15)
    note(t('ord.new', { n: orderTitle(x) }), 'sub', t('ord.newTip'))
    stops.push('order')
  }
  return stops
}

// nazwy rodzajów zleceń (ord.k.<rodzaj>.n), opis ilości (.what) i jednostka osób (people.unit)
localize(ORDER_KINDS, 'ord.k', ['n', 'what'])
Object.defineProperty(ORDER_KINDS.people, 'unit', { get: () => t('ord.k.people.unit'), enumerable: true })
