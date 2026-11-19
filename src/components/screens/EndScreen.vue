<script setup>
import { computed } from 'vue'
import { game, newGame, closeScreen } from '../../store.js'
import { DAYS } from '../../game/constants.js'
import { fmt } from '../../game/format.js'
import { score } from '../../game/state.js'

const s = computed(() => game.s)
</script>

<template>
  <template v-if="s.over">
    <h1 :class="s.over.win ? 'pos' : 'neg'">{{ s.over.t }}</h1>
    <p>{{ s.over.d }}</p>
    <p>Koloniści: {{ fmt(s.pop) }} · Morale: {{ Math.round(s.mor) }}%<br>Dzień: {{ Math.min(s.m, DAYS) }} · Technologie: {{ Object.keys(s.tech).length }}</p>
    <p class="t" style="color:var(--yellow)">WYNIK: {{ score(s) }}</p>
  </template>
  <div class="btns">
    <button @click="newGame">NOWA GRA</button>
    <button @click="closeScreen">ZOBACZ KOLONIĘ</button>
  </div>
</template>
