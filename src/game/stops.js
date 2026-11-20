import { reactive, watch } from 'vue'
import { t, localize } from '../i18n.js'

// Powody, przy których przewijanie kilku dni może się zatrzymać.
// n – nazwa w ustawieniach, why – opis w raporcie, def – czy domyślnie włączone
export const STOPS = [
  { k: 'build', def: true },
  { k: 'research', def: true },
  { k: 'exp', def: true },
  { k: 'camp', def: true },
  { k: 'order', def: true },
  { k: 'orderFail', def: true },
  { k: 'broke', def: false },
  { k: 'collapse', def: true },
  { k: 'faunaBad', def: true },
  { k: 'faunaGood', def: false },
  { k: 'anomalyBad', def: true },
  { k: 'anomalyGood', def: false },
  { k: 'storm', def: true },
  { k: 'breach', def: true },
  { k: 'depleted', def: true },
  { k: 'nodep', def: true },
  { k: 'evBad', def: true },
  { k: 'evGood', def: true },
  { k: 'hunger', def: true },
  { k: 'black', def: true },
  { k: 'emig', def: true },
  { k: 'short', def: false },
  { k: 'stall', def: false },
  { k: 'nores', def: false },
  { k: 'loss', def: false },
  { k: 'crowd', def: false },
  { k: 'debt', def: false }
]

export const stopDefaults = () => Object.fromEntries(STOPS.map(x => [x.k, x.def]))
export const stopWhy = k => k === 'over' ? t('stop.over') : k === 'choice' ? t('stop.choice') : (STOPS.find(x => x.k === k) || {}).why || k

// nazwy i opisy powodów zatrzymania ze słowników (stop.<k>.n, stop.<k>.why)
localize(Object.fromEntries(STOPS.map(x => [x.k, x])), 'stop', ['n', 'why'])

// Ustawienia gracza – wspólne dla wszystkich gier, osobno od zapisu stanu gry
const KEY = 'kolony-vibe-settings'
let stored = null
try { stored = JSON.parse(localStorage.getItem(KEY) || 'null') } catch (e) { /* brak ustawień */ }
// short – skrócone komunikaty w raporcie (bez rad, co zrobić – dla zaawansowanych)
// analytics – zgoda na Google Analytics: null (jeszcze nie zapytano), true, false
// stops – powody zatrzymania przewijania, auto – automatyczne odpowiedzi na zdarzenia z wyborem
export const settings = reactive({ stops: { ...stopDefaults(), ...(stored && stored.stops) }, auto: { ...(stored && stored.auto) }, chart: { range: 90, off: {}, ...(stored && stored.chart) }, hints: stored && stored.hints === false ? false : true, music: stored && stored.music === false ? false : true, hintOff: { ...(stored && stored.hintOff) }, analytics: stored && typeof stored.analytics === 'boolean' ? stored.analytics : null, short: !!(stored && stored.short) })
watch(settings, v => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (e) { /* brak zapisu */ } }, { deep: true })
