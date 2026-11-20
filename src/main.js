import { createApp } from 'vue'
import App from './App.vue'
import { initAudio } from './game/audio.js'
// czcionki dołączone do gry (działają offline): tylko alfabet łaciński z polskimi znakami
import '@fontsource/vt323/latin.css'
import '@fontsource/vt323/latin-ext.css'
import '@fontsource/press-start-2p/latin.css'
import '@fontsource/press-start-2p/latin-ext.css'
import './style.css'

// dźwięk można włączyć dopiero po interakcji użytkownika
document.addEventListener('click', initAudio)

createApp(App).mount('#app')

// tryb offline (PWA): tylko w zbudowanej grze serwowanej przez http(s), nie z dysku
if (import.meta.env.PROD && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js')
}
