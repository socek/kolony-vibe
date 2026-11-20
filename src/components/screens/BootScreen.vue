<script setup>
import { t } from '../../i18n.js'
import LangSwitch from '../LangSwitch.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { ui, newGame, closeScreen, showScreen } from '../../store.js'
import { versionLabel } from '../../game/changelog.js'

// Ekran startowy udający wczytywanie gry na C64
// linie „wczytywania” – druga zależy od języka (WERSJA / VERSION)
const lines = () => ['KOLONY VIBE', t('log.version', { v: versionLabel(true).replace(/[„”]/g, '') }) + ' · (C) 2026', '', 'READY.', 'LOAD "KOLONY VIBE",8,1', 'SEARCHING FOR KOLONY VIBE', 'LOADING', 'READY.']
const LINES = lines()
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
    <template v-for="(l, i) in lines().slice(0, shown)" :key="i">{{ l }}<br></template>
    <template v-if="shown > LINES.length">
      RUN<span class="cursor"></span>
      <!-- na telefonie przyciski idą nad fabułę (CSS: .bootbody .btns{order:-1}), żeby nie trzeba było ich szukać -->
      <div class="bootbody">
      <div class="bootstory"><p v-for="(p, i) in t('story.boot')" :key="i">{{ p }}</p></div>
      <div v-if="ui.saveDropped" class="warn small" style="margin-top:8px">{{ t('boot.dropped') }}</div>
      <div class="btns">
        <button v-if="ui.savedDay" @click="closeScreen">{{ t('menu.continue', { d: ui.savedDay }) }}</button>
        <button @click="newGame">{{ t('menu.newGame') }}</button>
        <button @click="showScreen('saves')">{{ t('sv.loadGame') }}</button>
        <button @click="showScreen('help')">{{ t('menu.help') }}</button>
        <button @click="showScreen('about')">{{ t('menu.about') }}</button>
        <button @click="showScreen('log')">{{ t('menu.log') }}</button>
        <LinkButtons />
        <LangSwitch />
      </div>
      </div>
    </template>
  </div>
</template>
