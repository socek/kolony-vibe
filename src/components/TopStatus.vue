<script setup>
import { t } from '../i18n.js'
import { computed } from 'vue'
import { game } from '../store.js'
import { DAYS } from '../game/constants.js'
import { scenarioOf, seasonOf, endless } from '../game/scenarios.js'
import { dateOf } from '../game/format.js'
import MeterBar from './MeterBar.vue'

const s = computed(() => game.s)
const late = computed(() => s.value.m > DAYS * 0.8)
const left = computed(() => Math.max(0, DAYS - s.value.m + 1))
const leftTxt = computed(() => left.value <= 1 ? t('top.lastDay') : t('top.left', { n: left.value }))
</script>

<template>
  <div class="row small">
    <span>{{ dateOf(s.m, endless(s)) }} · {{ endless(s) ? t('top.dayFree', { d: s.m }) : t('top.day', { d: Math.min(s.m, DAYS), max: DAYS }) }}</span>
    <span class="warn">{{ scenarioOf(s).goal.short }}</span>
  </div>
  <div v-if="seasonOf(s)" class="row small" style="margin-top:4px">
    <span class="sub">{{ t('top.season', { n: seasonOf(s).n }) }}</span>
    <span v-if="seasonOf(s).next">{{ t('top.seasonNext', { n: seasonOf(s).inDays, next: seasonOf(s).next }) }}</span>
  </div>
  <template v-if="!endless(s)">
  <div class="row small" style="margin-top:6px">
    <span>{{ t('top.term') }}</span>
    <span :class="{ warn: late }">{{ leftTxt }}</span>
  </div>
  <MeterBar :value="Math.min(s.m, DAYS) - 1" :max="DAYS - 1" :cls="late ? 'warn' : ''" />
  </template>
</template>
