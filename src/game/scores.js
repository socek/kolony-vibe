import { reactive } from 'vue'
import { scenarioOf, diffOf } from './scenarios.js'
import { score, baseScore } from './state.js'
import { DAYS } from './constants.js'

// Lokalna tabela wyników i zdobyte odznaki (wspólne dla wszystkich gier i scenariuszy)
const SCORES = 'kolony-vibe-scores', BADGES = 'kolony-vibe-badges'
const read = (k, def) => { try { return JSON.parse(localStorage.getItem(k) || 'null') || def } catch (e) { return def } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { /* brak zapisu */ } }

export const hall = reactive({ scores: read(SCORES, []), badges: read(BADGES, {}) })

// zapisuje zakończoną grę do tabeli; zwraca miejsce w tabeli (1 = najlepszy wynik)
export function recordGame(s) {
  if (!s.over || s.recorded || scenarioOf(s).noScore) return null
  const sc = scenarioOf(s), entry = {
    date: new Date().toISOString(), sc: sc.k, scn: sc.n, diff: diffOf(s).n, mult: diffOf(s).mult,
    score: score(s), base: baseScore(s), win: !!s.over.win, end: s.over.t,
    pop: Math.round(s.pop), day: Math.min(s.m, DAYS), mor: Math.round(s.mor), cr: Math.round(s.cr),
    tech: Object.keys(s.tech).length, badges: [...(s.earned || [])]
  }
  hall.scores.push(entry)
  hall.scores.sort((a, b) => b.score - a.score)
  write(SCORES, hall.scores)
  s.recorded = true
  return hall.scores.indexOf(entry) + 1
}

export function placeOf(s) {
  if (!s.recorded) return null
  const sc = score(s)
  return hall.scores.filter(x => x.score > sc).length + 1
}

export function grantBadges(keys) {
  const now = new Date().toISOString()
  for (const k of keys) hall.badges[k] = now
  if (keys.length) write(BADGES, hall.badges)
}
