import { TECH } from './constants.js'

// 10 odznak – wspólnych dla wszystkich scenariuszy, jawnych od początku.
// check(s) sprawdza stan bieżącej gry (s.st – liczniki prowadzone w trakcie gry).
export const BADGES = [
  { k: 'firstWin', n: 'Pierwsze zwycięstwo', d: 'Wygraj dowolny scenariusz.', check: s => !!(s.over && s.over.win) },
  { k: 'fast', n: 'Ekspres jubileuszowy', d: 'Wygraj scenariusz przed 200. dniem.', check: s => !!(s.over && s.over.win && s.m <= 200) },
  { k: 'pop500', n: 'Miasteczko', d: 'Miej w kolonii 500 mieszkańców naraz.', check: s => s.pop >= 500 },
  { k: 'rich', n: 'Skarbnik', d: 'Zgromadź 10 000 kredytów.', check: s => s.cr >= 10000 },
  { k: 'builder', n: 'Wielki budowniczy', d: 'Miej w kolonii 50 budynków naraz.', check: s => Object.values(s.b).reduce((a, n) => a + n, 0) >= 50 },
  { k: 'allTech', n: 'Encyklopedysta', d: 'Odkryj wszystkie technologie w jednej grze.', check: s => Object.keys(TECH).every(k => s.tech[k]) },
  { k: 'hunger', n: 'Przetrwali głód', d: 'Zakończ okres głodu, zanim pochłonie kolonię.', check: s => (s.st && s.st.hungerSurvived) > 0 },
  { k: 'explorer', n: 'Bezpieczne ścieżki', d: 'Niech 5 wypraw w jednej grze wróci bez strat.', check: s => (s.st && s.st.expClean) >= 5 },
  { k: 'defender', n: 'Postrach piratów', d: 'Odeprzyj działami 3 ataki piratów w jednej grze.', check: s => (s.st && s.st.repelled) >= 3 },
  { k: 'happy', n: 'Kraina szczęśliwości', d: 'Utrzymaj morale co najmniej 90% przez 30 dni z rzędu.', check: s => (s.st && s.st.happyBest) >= 30 }
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
