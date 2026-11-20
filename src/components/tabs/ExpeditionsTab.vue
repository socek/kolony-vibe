<script setup>
import { t } from '../../i18n.js'
import { computed } from 'vue'
import { game, c, ui, sendExp } from '../../store.js'
import { RANGES, TEAMS, GOALS, OTHER_CHANCE, MAX_SPEC_IN_TEAM, rangeOf, teamOf, expChance, expCost, expDays, expRisk, canSend, depTotal, MIN_POP_LEFT } from '../../game/expeditions.js'
import { TECH } from '../../game/constants.js'
import { fmt, daysTxt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const total = computed(() => depTotal(s.value))
const lasts = computed(() => c.value.minProd > 0 ? Math.floor(total.value / c.value.minProd) : null)
const away = computed(() => s.value.exp.reduce((a, x) => a + x.team, 0))
const plan = computed(() => {
  const r = rangeOf(ui.expRange), t = teamOf(ui.expTeam)
  const st = s.value
  const chance = ui.expGoal === 'dep' ? expChance(r, t, st) : Math.min(0.95, r.chance + t.bonus)
  return { r, t, days: expDays(r, st), risk: expRisk(r, st) * Math.max(0, 1 - 0.3 * ui.expSol), chance: Math.round(chance * 100), cost: expCost(r, t, st), why: canSend(st, ui.expRange, ui.expTeam, ui.expSol, ui.expEng), lock: r.req && !st.tech[r.req] }
})
</script>

<template>
  <div class="small">{{ t('ex.info') }}</div>

  <div class="card">
    <div class="row"><span class="t"><PixelIcon name="min" />{{ t('ex.deps') }}</span><span>{{ t('ex.total', { n: fmt(total) }) }}</span></div>
    <div v-if="!s.dep.length" class="neg">{{ t('ex.noDeps') }}</div>
    <div v-for="(d, i) in s.dep" :key="i" style="margin-top:4px">
      <div class="row small"><span>{{ d.n }}<span v-if="i === 0 && c.minProd > 0" class="pos"> · {{ t('ex.mining') }}</span></span><span>{{ fmt(d.t) }}/{{ fmt(d.max) }} t</span></div>
      <MeterBar :value="d.t" :max="d.max" :cls="d.t < d.max * 0.2 ? 'warn' : ''" />
    </div>
    <div class="small" style="margin-top:6px">
      {{ t('ex.output', { n: Math.round(c.minProd) }) }}<template v-if="lasts !== null"> · {{ t('ex.lasts', { d: daysTxt(lasts) }) }}</template>
    </div>
  </div>

  <div class="card">
    <div class="t"><PixelIcon name="exp" />{{ t('ex.new') }}</div>
    <div class="small" style="margin-top:4px">{{ t('ex.dest') }}</div>
    <div class="pr">
      <button v-for="r in RANGES" :key="r.k" :class="{ on: ui.expRange === r.k, lockedbtn: r.req && !s.tech[r.req] }" :title="r.req && !s.tech[r.req] ? t('ex.needTech', { n: TECH[r.req].n }) : null" @click="ui.expRange = r.k">{{ r.n.toUpperCase() }}</button>
    </div>
    <div class="small" style="margin-top:6px">{{ t('ex.what') }}</div>
    <div class="pr">
      <button v-for="g in GOALS" :key="g.k" :class="{ on: ui.expGoal === g.k }" :title="g.d" @click="ui.expGoal = g.k">{{ g.n }}</button>
    </div>
    <div class="small" style="margin-top:6px">{{ t('ex.size') }}</div>
    <div class="pr">
      <button v-for="x in TEAMS" :key="x.n" :class="{ on: ui.expTeam === x.n }" @click="ui.expTeam = x.n">{{ t('ex.people', { n: x.n }) }}</button>
    </div>
    <div class="small" style="margin-top:6px">{{ t('ex.specInfo') }}</div>
    <div class="row small">
      <span>{{ t('spec.sol.n') }}: {{ ui.expSol }} <button :disabled="ui.expSol <= 0" @click="ui.expSol--">−</button> <button :disabled="ui.expSol >= MAX_SPEC_IN_TEAM || ui.expSol >= ((s.spec || {}).sol || 0) || ui.expSol + ui.expEng >= ui.expTeam" @click="ui.expSol++">+</button></span>
      <span>{{ t('spec.eng.n') }}: {{ ui.expEng }} <button :disabled="ui.expEng <= 0" @click="ui.expEng--">−</button> <button :disabled="ui.expEng >= MAX_SPEC_IN_TEAM || ui.expEng >= ((s.spec || {}).eng || 0) || ui.expSol + ui.expEng >= ui.expTeam" @click="ui.expEng++">+</button></span>
    </div>
    <div class="small" style="margin-top:6px">
      <span v-if="plan.lock" class="neg">{{ t('ex.destNeedTech', { n: TECH[plan.r.req].n }) }}<br></span>
      {{ t('ex.plan1', { d: daysTxt(plan.days), goal: GOALS.find(g => g.k === ui.expGoal).d, ch: plan.chance, other: OTHER_CHANCE * 100, a: Math.round(plan.r.size[0] * plan.t.mult), b: Math.round(plan.r.size[1] * plan.t.mult) }) }}<br>
      {{ t('ex.cost', { cr: plan.cost.cr, food: plan.cost.food }) }} ·
      <span :class="plan.risk ? 'warn' : 'pos'">{{ t('ex.risk', { n: Math.round(plan.risk * 100) }) }}</span>
    </div>
    <div class="row" style="margin-top:6px">
      <span class="small" :class="{ neg: plan.why }">{{ plan.why || t('ex.minLeft', { n: MIN_POP_LEFT }) }}</span>
      <button :disabled="!!plan.why" @click="sendExp">{{ t('ex.send') }}</button>
    </div>
  </div>

  <div v-if="s.exp.length" class="card">
    <div class="row"><span class="t"><PixelIcon name="exp" />{{ t('ex.field') }}</span><span>{{ t('ex.away', { n: away }) }}</span></div>
    <div v-for="(x, i) in s.exp" :key="i" style="margin-top:4px">
      <div class="row small"><span>{{ t('ex.line', { r: rangeOf(x.r).n, g: GOALS.find(g => g.k === (x.goal || 'dep')).n.toLowerCase(), n: x.team, sol: x.sol || 0, eng: x.eng || 0 }) }}</span><span>{{ t('ex.back', { d: daysTxt(x.left) }) }}</span></div>
      <MeterBar :value="(x.days || rangeOf(x.r).days) - x.left" :max="x.days || rangeOf(x.r).days" />
    </div>
  </div>
</template>
