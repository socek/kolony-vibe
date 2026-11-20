<script setup>
import { computed } from 'vue'
import { game, closeScreen } from '../../store.js'
import { scenarioOf, diffOf } from '../../game/scenarios.js'
import { DAYS } from '../../game/constants.js'

const scen = computed(() => scenarioOf(game.s))
</script>

<template>
  <h1>{{ scen.n.toUpperCase() }}</h1>
  <p class="small" :style="{ color: diffOf(game.s).color }">Poziom trudności: {{ diffOf(game.s).n }}</p>
  <p><span class="sub">ZLECENIODAWCA</span><br><span style="color:var(--white)">{{ scen.patron }}</span></p>
  <p v-for="(p, i) in scen.story" :key="i">{{ p }}</p>
  <p><span class="sub">TWOJE ZADANIE</span><br><span style="color:var(--yellow)">{{ scen.goal.text }} w ciągu {{ DAYS }} dni.</span></p>
  <div class="btns"><button @click="closeScreen">DO DZIEŁA!</button></div>
</template>
