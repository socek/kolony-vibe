<script setup>
import { t } from '../../i18n.js'
import { newGame, closeScreen, showScreen } from '../../store.js'
import { audio } from '../../game/audio.js'
import { settings } from '../../game/stops.js'
import LinkButtons from '../LinkButtons.vue'
const onOff = v => t(v ? 'menu.on' : 'menu.off')
</script>

<template>
  <div class="menuscr">
  <h1>{{ t('menu.title') }}</h1>
  <div class="vmenu">
    <button @click="closeScreen">{{ t('menu.back') }}</button>
    <button @click="showScreen('settings')">{{ t('menu.settings') }}</button>
    <button @click="showScreen('scores')">{{ t('menu.scores') }}</button>
    <button @click="audio.sound = !audio.sound">{{ t('menu.sound') }}: {{ onOff(audio.sound) }}</button>
    <button @click="settings.music = !settings.music">{{ t('menu.music') }}: {{ onOff(settings.music) }}</button>
    <button @click="showScreen('help')">{{ t('menu.help') }}</button>
    <button @click="showScreen('about')">{{ t('menu.about') }}</button>
    <button @click="showScreen('log')">{{ t('menu.log') }}</button>
    <LinkButtons />
    <button @click="newGame">{{ t('menu.newGame') }}</button>
  </div>
  </div>
</template>
