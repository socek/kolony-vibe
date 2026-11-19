import { createApp } from 'vue'
import App from './App.vue'
import { initAudio } from './game/audio.js'
import './style.css'

// dźwięk można włączyć dopiero po interakcji użytkownika
document.addEventListener('click', initAudio)

createApp(App).mount('#app')
