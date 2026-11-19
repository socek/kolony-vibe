<script setup>
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
    <button class="go" :disabled="ui.busy || !!game.s.over" @click="advance(1)">▶ KONIEC DNIA</button>
    <button :disabled="ui.busy || !!game.s.over" title="Przewiń do 7 dni – zatrzymuje się przy ważnych wydarzeniach" @click="advance(7)">▶▶ 7 DNI</button>
    <button v-if="devOn" title="Menu deweloperskie" @click="showScreen('dev')">DEV</button>
    <button title="Menu" @click="showScreen('menu')">≡</button>
  </div>
</template>
