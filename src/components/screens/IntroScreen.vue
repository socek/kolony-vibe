<script setup>
import { computed } from 'vue'
import { t } from '../../i18n.js'
import { game, closeScreen } from '../../store.js'
import { scenarioOf, diffOf } from '../../game/scenarios.js'
import { DAYS } from '../../game/constants.js'

const scen = computed(() => scenarioOf(game.s))
</script>

<template>
  <h1>{{ scen.n.toUpperCase() }}</h1>
  <p class="small" :style="{ color: diffOf(game.s).color }">{{ t('intro.diff', { d: diffOf(game.s).n }) }}</p>
  <p><span class="sub">{{ t('intro.patron') }}</span><br><span style="color:var(--white)">{{ scen.patron }}</span></p>
  <p v-for="(p, i) in scen.story" :key="i">{{ p }}</p>
  <p><span class="sub">{{ t('intro.task') }}</span><br><span style="color:var(--yellow)">{{ scen.endless ? t('intro.taskFree') : t('intro.taskText', { g: scen.goal.text, n: DAYS }) }}</span></p>
  <div class="btns"><button @click="closeScreen">{{ t('intro.go') }}</button></div>
</template>
