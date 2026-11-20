import { watch } from 'vue'
import { settings } from './game/stops.js'
import { audio } from './game/audio.js'

// Google Analytics 4. Identyfikator pomiaru jest wstrzykiwany tylko przy budowaniu na GitHubie
// (zmienna repozytorium GA_ID → VITE_GA_ID w .github/workflows/deploy.yml), więc lokalnie
// – w trybie dev, w testach i w lokalnym buildzie – analityka jest wyłączona.
// Skrypt Google ładuje się dopiero po zgodzie gracza (settings.analytics === true).
const ID = import.meta.env.VITE_GA_ID || ''
export const analyticsOn = !!ID && import.meta.env.PROD
let loaded = false

function load() {
  if (loaded || !analyticsOn || settings.analytics !== true) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', ID)
  userProps()
  const sc = document.createElement('script')
  sc.async = true
  sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID)
  document.head.appendChild(sc)
}

// zdarzenie (np. 'game_start', { scenario: 'moon' }); bez zgody albo lokalnie nic nie robi
export function track(name, params = {}) {
  if (!loaded || settings.analytics !== true) return
  window.gtag('event', name, params)
}

// właściwości gracza: aktualny stan dźwięku i muzyki (raporty „ilu graczy ma wyłączone…”)
const onOff = v => v ? 'on' : 'off'
function userProps() {
  if (!loaded) return
  window.gtag('set', 'user_properties', { sound: onOff(audio.sound), music: onOff(settings.music) })
}

// widok: zakładka gry albo ekran (menu, zasady…) jako osobna „strona” w raportach
function view(name) {
  track('page_view', { page_title: name, page_location: location.origin + location.pathname + '#' + name })
}

export function setupAnalytics(ui) {
  if (!analyticsOn) return
  load()
  watch(() => settings.analytics, v => { if (v) { load(); view(ui.screen || 'tab:' + ui.tab) } })
  watch(() => ui.screen, v => view(v || 'tab:' + ui.tab))
  watch(() => ui.tab, v => { if (!ui.screen) view('tab:' + v) })
  // przełączenie dźwięku/muzyki: osobne nazwy zdarzeń (sound_off, music_on…) liczą się w GA bez dodatkowej konfiguracji
  watch(() => audio.sound, v => { userProps(); track('sound_' + onOff(v)) })
  watch(() => settings.music, v => { userProps(); track('music_' + onOff(v)) })
}
