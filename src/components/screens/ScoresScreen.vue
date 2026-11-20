<script setup>
import { t, locale } from '../../i18n.js'
import { ref } from 'vue'
import { showScreen } from '../../store.js'
import { hall } from '../../game/scores.js'
import { BADGES } from '../../game/badges.js'

const open = ref(null)
const date = iso => new Date(iso).toLocaleDateString(locale())
const m = x => x.toLocaleString(locale())
const badgeName = k => (BADGES.find(b => b.k === k) || {}).n || k
</script>

<template>
  <h1>{{ t('sc.title') }}</h1>
  <div class="devh">{{ t('sc.best') }}</div>
  <p v-if="!hall.scores.length" class="small">{{ t('sc.none') }}</p>
  <div v-else class="scores">
    <div class="row small scorehead"><span>#</span><span class="grow">{{ t('sc.scen') }}</span><span>{{ t('sc.score') }}</span></div>
    <template v-for="(x, i) in hall.scores.slice(0, 20)" :key="i">
      <button class="row scorerow" @click="open = open === i ? null : i">
        <span>{{ i + 1 }}.</span>
        <span class="grow">{{ x.scn }} <span class="small" :class="x.win ? 'pos' : 'neg'">{{ t(x.win ? 'sc.win' : 'sc.lose') }}</span></span>
        <span class="warn">{{ x.score }}</span>
      </button>
      <div v-if="open === i" class="small scoredet">
        {{ date(x.date) }} · {{ x.diff.toLowerCase() }} (×{{ m(x.mult) }}) · {{ x.end }}<br>
        {{ t('sc.det', x) }}<br>
        {{ t('sc.points', { base: x.base, m: m(x.mult), score: x.score }) }}<template v-if="x.badges.length"> · {{ t('sc.badgesOf') }} {{ x.badges.map(badgeName).join(', ') }}</template>
      </div>
    </template>
  </div>

  <div class="devh" style="margin-top:14px">{{ t('sc.badges', { n: Object.keys(hall.badges).length, max: BADGES.length }) }}</div>
  <div v-for="b in BADGES" :key="b.k" class="row badge" :class="{ got: hall.badges[b.k] }">
    <span><span class="t">{{ hall.badges[b.k] ? '★' : '☆' }} {{ b.n }}</span><br><span class="small">{{ b.d }}</span></span>
    <span class="small">{{ hall.badges[b.k] ? date(hall.badges[b.k]) : '' }}</span>
  </div>
  <div class="btns"><button @click="showScreen('menu')">{{ t('common.backMenu') }}</button></div>
</template>
