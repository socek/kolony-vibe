<script setup>
import { t, locale } from '../../i18n.js'
import { computed } from 'vue'
import { game, ui, newGame, closeScreen, showStats } from '../../store.js'
import { hall } from '../../game/scores.js'
import { BADGES } from '../../game/badges.js'
import { DAYS } from '../../game/constants.js'
import { fmt } from '../../game/format.js'
import { score, baseScore } from '../../game/state.js'
import { scenarioOf, diffOf } from '../../game/scenarios.js'

const s = computed(() => game.s)
</script>

<template>
  <template v-if="s.over">
    <h1 :class="s.over.win ? 'pos' : 'neg'">{{ s.over.t }}</h1>
    <p>{{ s.over.d }}</p>
    <p class="small">{{ t('end.scen', { n: scenarioOf(s).n, d: diffOf(s).n.toLowerCase() }) }}</p>
    <p>{{ t('end.stats1', { pop: fmt(s.pop), mor: Math.round(s.mor) }) }}<br>{{ t('end.stats2', { day: scenarioOf(s).endless ? s.m : Math.min(s.m, DAYS), tech: Object.keys(s.tech).length }) }}</p>
    <p v-if="scenarioOf(s).noScore" class="small sub">{{ t('end.noScore') }}</p>
    <template v-else>
    <p class="t" style="color:var(--yellow)">{{ t('end.score', { n: score(s) }) }}</p>
    <p class="small">{{ t('end.mult', { base: baseScore(s), m: diffOf(s).mult.toLocaleString(locale()) }) }}</p>
    </template>
    <p v-if="ui.lastPlace" class="sub">{{ t('end.place', { p: ui.lastPlace, n: hall.scores.length }) }}</p>
    <p v-if="s.earned && s.earned.length" class="small pos">{{ t('end.badges') }} {{ s.earned.map(k => BADGES.find(b => b.k === k).n).join(', ') }}</p>
  </template>
  <div class="btns">
    <button @click="newGame">{{ t('menu.newGame') }}</button>
    <button @click="showStats">{{ t('end.stats') }}</button>
    <button @click="closeScreen">{{ t('end.look') }}</button>
  </div>
</template>
