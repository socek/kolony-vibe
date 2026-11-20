import { createApp } from 'vue'
import App from './App.vue'
import { initAudio } from './game/audio.js'
import { syncMusic, ui, game, showScreen, closeScreen, goBack, closeHint, advance, setTab } from './store.js'
import { setupKeys } from './keys.js'
import { setupBackButton } from './backButton.js'
import { initLang } from './i18n.js'
import { watchEffect } from 'vue'
import { settings } from './game/stops.js'
import { setupAnalytics } from './analytics.js'
// czcionki dołączone do gry (działają offline): tylko alfabet łaciński z polskimi znakami
import '@fontsource/vt323/latin.css'
import '@fontsource/vt323/latin-ext.css'
import '@fontsource/press-start-2p/latin.css'
import '@fontsource/press-start-2p/latin-ext.css'
import './style.css'

// dźwięk można włączyć dopiero po interakcji użytkownika
document.addEventListener('click', () => { initAudio(); syncMusic() })

// język: zapisany wybór albo język przeglądarki (przed pierwszym wyświetleniem)
initLang()
// dostępność: atrybuty na <html> sterują powiększeniem i kontrastem (style.css)
watchEffect(() => {
  const h = document.documentElement
  if (settings.size && settings.size !== 'm') h.dataset.size = settings.size; else delete h.dataset.size
  if (settings.contrast) h.dataset.contrast = ''; else delete h.dataset.contrast
})
createApp(App).mount('#app')
setupAnalytics(ui)
setupBackButton(ui, showScreen)
setupKeys({ ui, game, advance, setTab, showScreen, closeScreen, goBack, closeHint })

// tryb offline (PWA): tylko w zbudowanej grze serwowanej przez http(s), nie z dysku
if (import.meta.env.PROD && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js')
}
