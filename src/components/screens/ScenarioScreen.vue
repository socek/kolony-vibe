<script setup>
import { ref } from 'vue'
import { startScenario, showScreen, game } from '../../store.js'
import { SCENARIOS, DIFF, PROLOGUE } from '../../game/scenarios.js'

const pick = ref(SCENARIOS.find(x => x.ready).k)
</script>

<template>
  <h1>NOWA GRA</h1>
  <p class="small">{{ PROLOGUE }}</p>
  <div class="devh">WYBIERZ SCENARIUSZ</div>
  <button v-for="x in SCENARIOS" :key="x.k" class="scen" :class="{ on: pick === x.k, off: !x.ready }" :disabled="!x.ready" @click="pick = x.k">
    <span class="row"><span class="t">{{ x.n }}</span><span :style="{ color: DIFF[x.diff].color }">{{ DIFF[x.diff].n }} · wynik ×{{ String(DIFF[x.diff].mult).replace('.', ',') }}</span></span>
    <span class="small">Cel: {{ x.goal.text }} · {{ x.features }}</span>
    <span v-if="!x.ready" class="small warn">W PRZYGOTOWANIU</span>
  </button>
  <div class="btns">
    <button @click="startScenario(pick)">ROZPOCZNIJ</button>
    <button @click="showScreen(game.s && !game.s.over && game.s.m > 1 ? 'menu' : 'boot')">WRÓĆ</button>
  </div>
</template>
