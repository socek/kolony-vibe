<script setup>
import { computed } from 'vue'
import { t } from '../../i18n.js'
import { goBack, game } from '../../store.js'
import { BATCAP, STBASE, STCAP, DAYS } from '../../game/constants.js'
import { scenarioOf } from '../../game/scenarios.js'
const scen = computed(() => scenarioOf(game.s))
</script>

<template>
  <h1>{{ t('menu.help') }}</h1>
  <p>{{ t(scen.endless ? 'help.introFree' : 'help.intro', { scen: scen.n, days: DAYS, goal: scen.goal.text }) }}</p>
  <p><template v-for="(r, i) in t('help.rules', { bat: BATCAP, base: STBASE, cap: STCAP })" :key="i">• {{ r }}<br></template></p>
  <p><span class="sub">{{ t('help.keys') }}</span><br><template v-for="(r, i) in t('help.keyList')" :key="'k' + i">• {{ r }}<br></template></p>
  <div class="btns"><button @click="goBack">{{ t('common.back') }}</button></div>
</template>
