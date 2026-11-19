<script setup>
import { newGame, closeScreen, showScreen } from '../../store.js'
import { audio } from '../../game/audio.js'
</script>

<template>
  <h1>MENU</h1>
  <div class="vmenu">
    <button @click="closeScreen">WRÓĆ DO GRY</button>
    <button @click="showScreen('settings')">USTAWIENIA</button>
    <button @click="audio.sound = !audio.sound">DŹWIĘK: {{ audio.sound ? 'WŁ.' : 'WYŁ.' }}</button>
    <button @click="showScreen('help')">ZASADY</button>
    <button @click="showScreen('about')">O GRZE</button>
    <button @click="showScreen('log')">ZMIANY</button>
    <button @click="newGame">NOWA GRA</button>
  </div>
</template>
