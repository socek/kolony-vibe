import { localize } from '../i18n.js'

// Ustawy (zakładka POLITYKA): każda ma zalety i wady. Najwyżej MAX_LAWS naraz; uchwalenie kosztuje LAW_FEE kr,
// uchylenie jest darmowe. fx – efekty: work (pkt proc. zdolnych do pracy), eff (sprawność budynków),
// food (zużycie żywności), mor (morale docelowe), cr (koszt kr/dzień), growth (przyrost), tax (podatki),
// res (badania), def (siła obrony), orders (nagrody kredytowe za zlecenia LUJ)
export const LAWS = {
  overtime: { fx: { work: 0.05, mor: -6 } },
  gym: { fx: { eff: 0.05, mor: -3 } },
  meatless: { fx: { food: -0.1, mor: -3 } },
  fest: { fx: { mor: 6, cr: 8 } },
  pioneer: { fx: { growth: 0.25, tax: -0.2 } },
  nightlab: { fx: { res: 0.2, mor: -3 } },
  guard: { fx: { def: 0.25, work: -0.03 } },
  milk: { fx: { orders: 0.2, mor: -2 } }
}
export const MAX_LAWS = 3, LAW_FEE = 100

// suma efektu danego rodzaju ze wszystkich uchwalonych ustaw
export const lawFx = (s, key) => (s.laws || []).reduce((a, k) => a + ((LAWS[k] && LAWS[k].fx[key]) || 0), 0)
export const isLaw = (s, k) => (s.laws || []).includes(k)

// powód, dla którego nie da się uchwalić ustawy (albo '')
export function lawBlock(s, k, t) {
  if (isLaw(s, k)) return ''
  if ((s.laws || []).length >= MAX_LAWS) return t('law.max', { n: MAX_LAWS })
  if (s.cr < LAW_FEE) return t('ch.lackCr')
  return ''
}
// uchwala albo uchyla ustawę; zwraca true, jeśli coś się zmieniło
export function toggleLaw(s, k, t) {
  if (!LAWS[k]) return false
  if (!s.laws) s.laws = []
  if (isLaw(s, k)) { s.laws = s.laws.filter(x => x !== k); return true }
  if (lawBlock(s, k, t)) return false
  s.cr -= LAW_FEE; s.laws.push(k)
  return true
}

localize(LAWS, 'law', ['n', 'd'])
