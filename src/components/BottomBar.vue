<script setup>
import { t } from '../i18n.js'
import { ref, onMounted, onUnmounted } from 'vue'
import { game, ui, advance, showScreen } from '../store.js'

// Przycisk DEV widać tylko z #iddqd w adresie
const devOn = ref(false)
const check = () => { devOn.value = location.hash === '#iddqd' }
onMounted(() => { check(); window.addEventListener('hashchange', check) })
onUnmounted(() => window.removeEventListener('hashchange', check))
</script>

<template>
  <div class="bar">
    <button v-if="game.s.pending" class="go decide" @click="showScreen('choice')">{{ t('bar.decide') }}</button>
    <button v-else class="go" :disabled="ui.busy || !!game.s.over" @click="advance(1)">{{ t('bar.endDay') }}</button>
    <button :disabled="ui.busy || !!game.s.over || !!game.s.pending" :title="t('bar.weekTitle')" @click="advance(7)">{{ t('bar.week') }}</button>
    <button v-if="devOn" :title="t('bar.devTitle')" @click="showScreen('dev')">DEV</button>
    <button title="Menu" @click="showScreen('menu')">≡</button>
  </div>
</template>
