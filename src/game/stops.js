import { reactive, watch } from 'vue'

// Powody, przy których przewijanie kilku dni może się zatrzymać.
// n – nazwa w ustawieniach, why – opis w raporcie, def – czy domyślnie włączone
export const STOPS = [
  { k: 'build', n: 'Ukończenie budowy', why: 'ukończono budowę', def: true },
  { k: 'research', n: 'Ukończenie badań', why: 'ukończono badania', def: true },
  { k: 'exp', n: 'Powrót wyprawy', why: 'wróciła wyprawa', def: true },
  { k: 'camp', n: 'Przybycie kolonistów z kampanii reklamowej', why: 'przybyli koloniści z kampanii', def: true },
  { k: 'order', n: 'Nowa oferta zlecenia LUJ', why: 'nowa oferta zlecenia LUJ', def: true },
  { k: 'orderFail', n: 'Minął termin zlecenia LUJ', why: 'minął termin zlecenia', def: true },
  { k: 'broke', n: 'Awaria budynku', why: 'awaria budynku', def: false },
  { k: 'collapse', n: 'Budynek rozpadł się ze starości', why: 'budynek się rozpadł', def: true },
  { k: 'depleted', n: 'Wyczerpanie złoża', why: 'wyczerpano złoże', def: true },
  { k: 'nodep', n: 'Kopalnie stanęły (brak złóż)', why: 'kopalnie stanęły', def: true },
  { k: 'evBad', n: 'Złe zdarzenia losowe (meteoryty, epidemia, piraci, rozbłysk, awaria)', why: 'groźne zdarzenie', def: true },
  { k: 'evGood', n: 'Dobre zdarzenia losowe (dostawy, złoże, kometa, uchodźcy, święto)', why: 'zdarzenie losowe', def: true },
  { k: 'hunger', n: 'Początek głodu', why: 'zaczął się głód', def: true },
  { k: 'black', n: 'Początek blackoutu', why: 'zaczął się blackout', def: true },
  { k: 'emig', n: 'Początek odlotów (morale poniżej 25%)', why: 'koloniści zaczęli odlatywać', def: true },
  { k: 'short', n: 'Początek braku rąk do pracy', why: 'zabrakło rąk do pracy', def: false },
  { k: 'stall', n: 'Budowa stanęła (brak budowniczych)', why: 'budowa stanęła', def: false },
  { k: 'nores', n: 'Laboratoria bez projektu', why: 'laboratoria nie mają projektu', def: false },
  { k: 'loss', n: 'Pełne chłodnie lub magazyny – zaczęły się straty', why: 'magazyny są pełne', def: false },
  { k: 'crowd', n: 'Przeludnienie', why: 'przeludnienie', def: false },
  { k: 'debt', n: 'Zadłużenie', why: 'kolonia jest zadłużona', def: false }
]

export const stopDefaults = () => Object.fromEntries(STOPS.map(x => [x.k, x.def]))
export const stopWhy = k => k === 'over' ? 'koniec gry' : k === 'choice' ? 'decyzja do podjęcia' : (STOPS.find(x => x.k === k) || {}).why || k

// Ustawienia gracza – wspólne dla wszystkich gier, osobno od zapisu stanu gry
const KEY = 'kolony-vibe-settings'
let stored = null
try { stored = JSON.parse(localStorage.getItem(KEY) || 'null') } catch (e) { /* brak ustawień */ }
// stops – powody zatrzymania przewijania, auto – automatyczne odpowiedzi na zdarzenia z wyborem
export const settings = reactive({ stops: { ...stopDefaults(), ...(stored && stored.stops) }, auto: { ...(stored && stored.auto) }, chart: { range: 90, off: {}, ...(stored && stored.chart) }, hints: stored && stored.hints === false ? false : true, music: stored && stored.music === false ? false : true, hintOff: { ...(stored && stored.hintOff) } })
watch(settings, v => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (e) { /* brak zapisu */ } }, { deep: true })
