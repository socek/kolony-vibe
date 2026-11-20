<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ui, newGame, closeScreen, showScreen } from '../../store.js'
import { versionLabel } from '../../game/changelog.js'

// Ekran startowy udający wczytywanie gry na C64
const LINES = ['KOLONY VIBE', 'WERSJA ' + versionLabel(true).replace(/[„”]/g, '') + ' · (C) 2026', '', 'READY.', 'LOAD "KOLONY VIBE",8,1', 'SEARCHING FOR KOLONY VIBE', 'LOADING', 'READY.']
// animacja „wczytywania” leci tylko raz, przy uruchomieniu gry – po powrocie z zasad, „O grze” itp. ekran pokazuje się od razu
const shown = ref(ui.bootPlayed ? LINES.length + 1 : 0)
let timer
onMounted(() => {
  if (ui.bootPlayed) return
  ui.bootPlayed = true
  timer = setInterval(() => { shown.value++; if (shown.value > LINES.length) clearInterval(timer) }, 220)
})
onUnmounted(() => clearInterval(timer))
import LinkButtons from '../LinkButtons.vue'
</script>

<template>
  <div>
    <template v-for="(l, i) in LINES.slice(0, shown)" :key="i">{{ l }}<br></template>
    <template v-if="shown > LINES.length">
      RUN<span class="cursor"></span>
      <div v-if="ui.saveDropped" class="warn small" style="margin-top:8px">Zapis gry z poprzedniej wersji nie jest zgodny z obecną wersją gry i nie może zostać wczytany. Zacznij nową grę.</div>
      <div class="btns">
        <button v-if="ui.savedDay" @click="closeScreen">KONTYNUUJ (dzień {{ ui.savedDay }})</button>
        <button @click="newGame">NOWA GRA</button>
        <button @click="showScreen('help')">ZASADY</button>
        <button @click="showScreen('about')">O GRZE</button>
        <button @click="showScreen('log')">ZMIANY</button>
        <LinkButtons />
      </div>
    </template>
  </div>
</template>
