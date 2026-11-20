<script setup>
import { computed } from 'vue'
import { game } from '../store.js'
import { DAYS } from '../game/constants.js'
import { scenarioOf, seasonOf } from '../game/scenarios.js'
import { dateOf, plDays } from '../game/format.js'
import MeterBar from './MeterBar.vue'

const s = computed(() => game.s)
const late = computed(() => s.value.m > DAYS * 0.8)
const left = computed(() => Math.max(0, DAYS - s.value.m + 1))
const leftTxt = computed(() => left.value <= 1 ? 'OSTATNI DZIEŃ!' : 'ZOSTAŁO ' + left.value + ' ' + plDays(left.value))
</script>

<template>
  <div class="row small">
    <span>{{ dateOf(s.m) }} · DZIEŃ {{ Math.min(s.m, DAYS) }}/{{ DAYS }}</span>
    <span class="warn">{{ scenarioOf(s).goal.short }}</span>
  </div>
  <div v-if="seasonOf(s)" class="row small" style="margin-top:4px">
    <span class="sub">PORA ROKU: {{ seasonOf(s).n }}</span>
    <span v-if="seasonOf(s).next">za {{ seasonOf(s).inDays }} {{ seasonOf(s).inDays === 1 ? 'dzień' : 'dni' }}: {{ seasonOf(s).next }}</span>
  </div>
  <div class="row small" style="margin-top:6px">
    <span>KADENCJA GUBERNATORA</span>
    <span :class="{ warn: late }">{{ leftTxt }}</span>
  </div>
  <MeterBar :value="Math.min(s.m, DAYS) - 1" :max="DAYS - 1" :cls="late ? 'warn' : ''" />
</template>
