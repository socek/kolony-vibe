import { t, locale } from '../i18n.js'

// CODENAME może być pusty – wtedy etykieta pokazuje sam numer wersji
export const VERSION = '0.4', CODENAME = ''
// wersja w trakcie zmian – pokazywane przy numerze wersji
export const IN_DEV = false
export const versionLabel = (upper = false) => {
  const t = VERSION + (CODENAME ? ' „' + CODENAME + '”' : '') + (IN_DEV ? ' (in development)' : '')
  return upper ? t.toUpperCase() : t
}

// Lista zmian: treść w słownikach (log.v.<k> – nazwa wersji, log.items.<k> – punkty), d – data wydania (ISO) albo brak (w przygotowaniu).
// Nowy punkt dopisuj w obu językach: src/locales/pl/changelog.js i src/locales/en/changelog.js.
export const CHANGELOG = [
  { k: '0.4', d: '2026-11-21' },
  { k: '0.3', d: '2026-11-20' },
  { k: '0.2', d: '2026-11-19' },
  { k: '0.1', d: '2026-11-19' }
]
for (const e of CHANGELOG) {
  Object.defineProperty(e, 'v', { get: () => t('log.v.' + e.k), enumerable: true })
  Object.defineProperty(e, 'items', { get: () => t('log.items.' + e.k), enumerable: true })
  Object.defineProperty(e, 'date', { get: () => e.d ? new Date(e.d + 'T12:00:00').toLocaleDateString(locale()) : t('log.wip'), enumerable: true })
}
