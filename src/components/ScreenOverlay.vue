<script setup>
import { ui } from '../store.js'
import BootScreen from './screens/BootScreen.vue'
import MenuScreen from './screens/MenuScreen.vue'
import HelpScreen from './screens/HelpScreen.vue'
import AboutScreen from './screens/AboutScreen.vue'
import ChangelogScreen from './screens/ChangelogScreen.vue'
import EndScreen from './screens/EndScreen.vue'
import DevScreen from './screens/DevScreen.vue'
import SettingsScreen from './screens/SettingsScreen.vue'

const SCREENS = { boot: BootScreen, menu: MenuScreen, help: HelpScreen, about: AboutScreen, log: ChangelogScreen, end: EndScreen, dev: DevScreen, settings: SettingsScreen }
</script>

<template>
  <div v-if="ui.screen" class="overlay">
    <div class="box"><component :is="SCREENS[ui.screen]" /></div>
  </div>
</template>
