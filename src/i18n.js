import { reactive } from 'vue'
import pl from './locales/pl/index.js'
import en from './locales/en/index.js'

// Tłumaczenia. Teksty leżą w src/locales/<język>/*.js jako płaskie słowniki { 'klucz.z.kropkami': tekst }.
// Tekst może być napisem z {parametrami} albo funkcją (p) => napis – dla odmiany liczebników itp.
// Nowy język: katalog src/locales/<kod>/ z tymi samymi kluczami i wpis w LANGS. Brakujący klucz – tekst polski.
export const LANGS = {
  pl: { n: 'Polski', locale: 'pl-PL', dict: pl },
  en: { n: 'English', locale: 'en-GB', dict: en }
}
const KEY = 'kolony-vibe-lang'

export const i18n = reactive({ lang: 'pl' })
export const lang = () => i18n.lang
export const locale = () => LANGS[i18n.lang].locale

// język z zapisanego wyboru albo z przeglądarki (polski → PL, każdy inny → EN)
export function detectLang() {
  try { const v = localStorage.getItem(KEY); if (LANGS[v]) return v } catch (e) { /* brak zapisu */ }
  const list = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || []
  return list.some(l => /^pl\b/i.test(l || '')) ? 'pl' : 'en'
}
export function initLang() { i18n.lang = detectLang(); syncHtml() }
export function setLang(l) {
  if (!LANGS[l]) return
  i18n.lang = l
  try { localStorage.setItem(KEY, l) } catch (e) { /* brak zapisu */ }
  syncHtml()
}
function syncHtml() { if (typeof document !== 'undefined') document.documentElement.lang = i18n.lang }

const fill = (s, p) => p ? s.replace(/\{(\w+)\}/g, (m, k) => (p[k] ?? m)) : s
export function t(key, p) {
  const v = LANGS[i18n.lang].dict[key] ?? LANGS.pl.dict[key]
  if (v == null) return key
  return typeof v === 'function' ? v(p || {}) : fill(v, p)
}
// czy klucz istnieje (np. opcjonalne teksty)
export const has = key => LANGS[i18n.lang].dict[key] != null || LANGS.pl.dict[key] != null

// Pola tekstowe obiektów z danymi (np. BLD.farm.n) stają się getterami czytającymi tłumaczenie
// – miejsca użycia zostają bez zmian, a widok odświeża się po zmianie języka.
export function localize(obj, prefix, fields) {
  for (const id in obj) for (const f of fields) {
    Object.defineProperty(obj[id], f, { get: () => t(prefix + '.' + id + '.' + f), enumerable: true, configurable: true })
  }
  return obj
}

// liczebniki: pl(n, 'dzień', 'dni', 'dni') – 1 / 2–4 (bez 12–14) / reszta; en(n, 'day', 'days')
export function plForm(n, one, few, many) {
  n = Math.abs(Math.round(n))
  if (n === 1) return one
  const d = n % 10, h = n % 100
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many
}
export const enForm = (n, one, other) => Math.abs(Math.round(n)) === 1 ? one : other
