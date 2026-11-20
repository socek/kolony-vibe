import { localize } from '../i18n.js'
import { TECH } from './constants.js'

// 10 odznak – wspólnych dla wszystkich scenariuszy, jawnych od początku.
// check(s) sprawdza stan bieżącej gry (s.st – liczniki prowadzone w trakcie gry).
export const BADGES = [
  { k: 'firstWin', check: s => !!(s.over && s.over.win) },
  { k: 'fast', check: s => !!(s.over && s.over.win && s.m <= 200) },
  { k: 'pop500', check: s => s.pop >= 500 },
  { k: 'rich', check: s => s.cr >= 10000 },
  { k: 'builder', check: s => Object.values(s.b).reduce((a, n) => a + n, 0) >= 50 },
  { k: 'allTech', check: s => Object.keys(TECH).filter(k => !TECH[k].sc || TECH[k].sc.includes(s.sc || 'moon')).every(k => s.tech[k]) },
  { k: 'hunger', check: s => (s.st && s.st.hungerSurvived) > 0 },
  { k: 'explorer', check: s => (s.st && s.st.expClean) >= 5 },
  { k: 'defender', check: s => (s.st && s.st.repelled) >= 3 },
  { k: 'happy', check: s => (s.st && s.st.happyBest) >= 30 }
]

// liczniki do odznak, aktualizowane po każdym dniu
export function trackStats(s) {
  if (!s.st) s.st = { hungerSurvived: 0, expClean: 0, repelled: 0, happyRun: 0, happyBest: 0 }
  s.st.happyRun = s.mor >= 90 ? s.st.happyRun + 1 : 0
  s.st.happyBest = Math.max(s.st.happyBest, s.st.happyRun)
}
export const bumpStat = (s, k) => { if (!s.st) trackStats(s); s.st[k] = (s.st[k] || 0) + 1 }

// zwraca odznaki zdobyte w tej grze, których gracz jeszcze nie miał
export function newBadges(s, owned) {
  return BADGES.filter(b => !owned[b.k] && b.check(s)).map(b => b.k)
}

// nazwy i opisy ze słowników (badge.<k>.n / .d)
localize(Object.fromEntries(BADGES.map(x => [x.k, x])), 'badge', ['n', 'd'])
