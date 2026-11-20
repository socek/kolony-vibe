<script setup>
import { ref } from 'vue'
import { t, locale } from '../../i18n.js'
import { startScenario, showScreen, game } from '../../store.js'
import { SCENARIOS, DIFF } from '../../game/scenarios.js'

const pick = ref(SCENARIOS.find(x => x.ready).k)
</script>

<template>
  <h1>{{ t('menu.newGame') }}</h1>
  <p class="small">{{ t('story.prologue') }}</p>
  <div class="devh">{{ t('scen.pick') }}</div>
  <button v-for="x in SCENARIOS" :key="x.k" class="scen" :class="{ on: pick === x.k, off: !x.ready }" :disabled="!x.ready" @click="pick = x.k">
    <span class="row"><span class="t">{{ x.n }}</span><span :style="{ color: DIFF[x.diff].color }">{{ DIFF[x.diff].n }} · {{ t('scen.mult', { m: DIFF[x.diff].mult.toLocaleString(locale()) }) }}</span></span>
    <span class="small">{{ t('scen.goal', { g: x.goal.text }) }} · {{ x.features }}</span>
    <span v-if="!x.ready" class="small warn">{{ t('scen.wip') }}</span>
  </button>
  <div class="btns">
    <button @click="startScenario(pick)">{{ t('scen.start') }}</button>
    <button @click="showScreen(game.s && !game.s.over && game.s.m > 1 ? 'menu' : 'boot')">{{ t('common.back') }}</button>
  </div>
</template>
