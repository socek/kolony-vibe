import { reactive, computed } from 'vue'
import { BLD, TECH, DAYS, batCapOf } from './game/constants.js'
import { calc } from './game/calc.js'
import { newState, save, load } from './game/state.js'
import { endTurn, clampStore, snapshot } from './game/turn.js'
import { EVENTS } from './game/events.js'
import { dateOf } from './game/format.js'
import { beep } from './game/audio.js'
import { settings, stopWhy } from './game/stops.js'
import { sendExpedition, addDeposit, nbTrade } from './game/expeditions.js'
import { startCampaign } from './game/campaigns.js'
import { accept, deliver, makeOffer, ensureOrders } from './game/orders.js'
import { queueTech, unqueueTech, researchNow, nextResearch } from './game/research.js'
import { resolveChoice } from './game/choices.js'
import { syncCond } from './game/wear.js'
import { pickHint } from './game/hints.js'
import { BADGES, newBadges } from './game/badges.js'
import { hall, recordGame, grantBadges } from './game/scores.js'

const loaded = load(), saved = loaded.s
const resumable = saved && !saved.over ? saved : null

// game.s – stan gry (zapisywany), ui – stan interfejsu
export const game = reactive({ s: resumable || newState() })
export const ui = reactive({
  tab: 'raport', qty: 50, expRange: 'near', expTeam: 5, expGoal: 'dep', expSol: 0, expEng: 0, screen: 'boot', busy: false, turn: null, devMsg: '',
  savedDay: resumable ? resumable.m : null, saveDropped: loaded.dropped, lastPlace: null, hint: null, reasons: []
})
export const c = computed(() => calc(game.s))

const persist = () => save(game.s)

export function setTab(t) { ui.tab = t; beep(880, 0.03) }
export function showScreen(name) { ui.screen = name }
export function closeScreen() { ui.screen = null }

// NOWA GRA prowadzi do wyboru scenariusza, a wybór scenariusza – do wstępu fabularnego
export function newGame() { ui.screen = 'scenarios' }
export function startScenario(k) { game.s = newState(k); ui.tab = 'raport'; ui.saveDropped = false; persist(); ui.screen = 'intro' }

export function build(k) {
  const s = game.s, x = BLD[k]
  s.cr -= x.cr; s.min -= x.mi; s.q.push({ k, d: 0 })
  beep(520, 0.08); persist()
}
export function cancelSite(i) {
  const s = game.s, x = s.q.splice(i, 1)[0]
  if (x) { s.cr += Math.round(BLD[x.k].cr / 2); s.min += Math.round(BLD[x.k].mi / 2); clampStore(s) }
  beep(180, 0.08); persist()
}
export function siteFirst(i) {
  const s = game.s, x = s.q.splice(i, 1)[0]
  if (x) s.q.unshift(x)
  beep(600, 0.03); persist()
}
export function demolish(k) {
  const s = game.s
  s.b[k]--; syncCond(s); s.energy = Math.min(s.energy, batCapOf(s)); clampStore(s)
  beep(180, 0.08); persist()
}

export function prices(k) {
  const s = game.s, p = s.pr[k]
  const ex = s.tech.exchange
  return { sell: p * (s.b.port ? 1.15 : 1) * (ex ? 1.1 : 1), buy: p * 1.3 * (s.b.port ? 0.9 : 1) * (ex ? 0.9 : 1) }
}
export function sell(k) { const s = game.s; s[k] -= ui.qty; s.cr += prices(k).sell * ui.qty; beep(740, 0.05); persist() }
export function buy(k) { const s = game.s; s.cr -= prices(k).buy * ui.qty; s[k] += ui.qty; beep(740, 0.05); persist() }

export function setRation(r) { game.s.ration = r; persist() }
export function setTax(v) { game.s.tax = v }
export const saveNow = persist
export function setPrio(k, l) { game.s.prio[k] = l; beep(600, 0.03); persist() }
export function sendExp() { if (sendExpedition(game.s, ui.expRange, ui.expTeam, ui.expGoal, ui.expSol, ui.expEng)) { ui.expSol = 0; ui.expEng = 0; beep(440, 0.12); persist() } }
export function neighborTrade(k) { if (nbTrade(game.s, k)) { beep(740, 0.05); persist() } }
export function campaign(k) { if (startCampaign(game.s, k)) { beep(700, 0.1); persist() } }
// decyzja w zdarzeniu z wyborem
export function decide(i) {
  const s = game.s
  if (!s.pending) return
  const txt = resolveChoice(s, s.pending, i)
  if (!txt) return
  if (!Array.isArray(s.report)) s.report = []
  s.report.unshift({ k: 'txt', t: '★ ' + txt, c: 'sub', day: s.m - 1, top: 1 })
  s.pending = null
  beep(600, 0.08); persist(); closeScreen()
}
export function acceptOrder(id) { if (accept(game.s, id)) { beep(700, 0.08); persist() } }
export function deliverOrder(id) {
  const txt = deliver(game.s, id)
  if (!txt) return
  game.s.report.unshift({ k: 'txt', t: '★ LUJ: ' + txt, c: 'pos', day: game.s.m - 1, top: 1 })
  beep(990, 0.12); persist()
}
export function research(k) { if (queueTech(game.s, k)) { beep(880, 0.08); persist() } }
export function unresearch(k) { unqueueTech(game.s, k); beep(300, 0.05); persist() }
export function researchFirst(k) { if (researchNow(game.s, k)) { beep(990, 0.08); persist() } }

// po każdym dniu: nowe odznaki; po końcu gry: zapis do tabeli wyników
function checkBadges() {
  const s = game.s, nb = newBadges(s, hall.badges)
  if (!nb.length) return
  grantBadges(nb)
  s.earned = [...(s.earned || []), ...nb]
  for (const k of nb) s.report.unshift({ k: 'txt', t: '★ Zdobyto odznakę: ' + BADGES.find(b => b.k === k).n + '!', c: 'pos', top: 1 })
  beep(1200, 0.12)
}
function afterTurns() {
  checkBadges()
  if (game.s.over) ui.lastPlace = recordGame(game.s) || ui.lastPlace
  persist(); ui.tab = 'raport'
  if (game.s.over) { ui.screen = 'end'; beep(game.s.over.win ? 880 : 150, 0.4) }
  else showHint()
  ui.reasons = []
}
// podpowiedź kontekstowa przy pierwszym wystąpieniu sytuacji (decyzja i koniec gry mają pierwszeństwo)
function showHint() {
  const s = game.s
  if (!settings.hints || s.pending) return
  const k = pickHint(ui.reasons, s.hintsShown || [], settings.hintOff)
  if (!k) return
  s.hintsShown = [...(s.hintsShown || []), k]
  ui.hint = k; ui.screen = 'hint'
}
export function closeHint(never) { if (never && ui.hint) settings.hintOff[ui.hint] = true; ui.hint = null; persist(); closeScreen() }
export function showStats() { ui.tab = 'statystyki'; closeScreen() }

// Rozgrywa n dni z animacją; przy n > 1 zatrzymuje się na ważnych wydarzeniach.
export function advance(n) {
  const s = game.s
  if (ui.busy || s.over) return
  ui.busy = true
  const p0 = snapshot(s)
  const label = () => ({ day: Math.min(game.s.m + 1, DAYS), date: dateOf(game.s.m + 1) })
  ui.turn = { ...label(), fill: 0, out: false }
  let i = 0, why = []
  const step = () => {
    const raw = endTurn(game.s, i > 0, settings.auto)
    ui.reasons.push(...raw)
    why = raw.filter(k => k === 'over' || k === 'choice' || (n > 1 && settings.stops[k]))
    i++
    persist() // zapis od razu, nie dopiero po animacji
    ui.tab = 'raport'
    ui.turn.fill = n > 1 ? i / n * 100 : 100
    beep(330 + i * 60, 0.04)
    if (i < n && !why.length) { Object.assign(ui.turn, label()); setTimeout(step, 90) } else finish()
  }
  const finish = () => {
    if (n > 1) {
      game.s.prev = p0
      if (i < n && !game.s.over) game.s.report.unshift({ k: 'txt', t: 'Przewijanie zatrzymane po ' + i + ' ' + (i === 1 ? 'dniu' : 'dniach') + ' – ' + why.map(stopWhy).join(', ') + '.', c: 'stop', top: 1 })
    }
    beep(660, 0.06)
    setTimeout(() => {
      ui.turn.out = true
      setTimeout(() => { ui.turn = null; ui.busy = false; afterTurns(); if (game.s.pending && !game.s.over) ui.screen = 'choice' }, 200)
    }, n > 1 ? 150 : 200)
  }
  setTimeout(step, n > 1 ? 120 : 200)
}

// --- menu deweloperskie ---
export function devAct(a) {
  const s = game.s
  ui.devMsg = ''
  if (a === 'finish') { s.q.forEach(x => s.b[x.k]++); ui.devMsg = 'Ukończono budów: ' + s.q.length + '.'; s.q = [] }
  else if (a === 'fill') { const cc = calc(s); s.food = cc.foodCap; s.min = cc.minCap; s.energy = cc.enCap; ui.devMsg = 'Magazyny pełne.' }
  else if (a === 'cash') { s.cr += 1000; ui.devMsg = '+1000 kr.' }
  else if (a === 'alltech') { for (const k in TECH) s.tech[k] = 1; s.rs = null; s.rp = {}; s.rq = []; ui.devMsg = 'Odkryto wszystkie technologie.' }
  else if (a === 'repairall') { syncCond(s); for (const k in s.cond) for (const x of s.cond[k]) { x.c = 100; x.broken = false } ui.devMsg = 'Wszystkie budynki naprawione.' }
  else if (a === 'order') { ensureOrders(s); makeOffer(s); ui.devMsg = 'Nowa oferta zlecenia LUJ (zakładka RYNEK).' }
  else if (a === 'dep') { addDeposit(s, 'Złoże deweloperskie', 1000); ui.devMsg = 'Dodano złoże 1000 t.' }
  else if (a === 'expback') { s.exp.forEach(x => x.left = 1); ui.devMsg = 'Wyprawy wrócą na koniec dnia.' }
  else if (a.startsWith('ch:')) { if (!s.pending) { s.pending = a.slice(3); ui.screen = 'choice'; persist(); return } ui.devMsg = 'Najpierw rozstrzygnij bieżącą decyzję.' }
  else if (a === 'revive') { s.over = null; ui.devMsg = 'Gra wznowiona.' }
  else if (a === 'skip7' || a === 'skip30') {
    const n = a === 'skip7' ? 7 : 30, p0 = snapshot(s)
    let i = 0
    while (i < n && !s.over && !s.pending) { endTurn(s, i > 0, settings.auto); i++ }
    s.prev = p0
    ui.devMsg = 'Przewinięto ' + i + ' dni bez zatrzymywania.'
    if (s.over) { afterTurns(); return }
  } else if (a.startsWith('ev')) {
    const m = EVENTS[+a.slice(2)](s)
    ui.devMsg = m ? '★ ' + m : 'Zdarzenie nie miało zastosowania.'
    if (m) { if (!Array.isArray(s.report)) s.report = []; s.report.unshift({ k: 'txt', t: '★ ' + m, c: 'sub', day: s.m, top: 1 }) }
  }
  s.mor = Math.max(0, Math.min(100, s.mor))
  persist()
}
export function devSet(obj, key, value) { obj[key] = +value || 0; persist() }
export function devTech(k, on) {
  const s = game.s
  if (on) { s.tech[k] = 1; s.rq = (s.rq || []).filter(q => q !== k); if (s.rs === k) { s.rs = null; nextResearch(s) } } else delete s.tech[k]
  persist()
}
