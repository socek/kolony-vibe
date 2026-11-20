<script setup>
import { t } from '../../i18n.js'
import { computed } from 'vue'
import { game, c } from '../../store.js'
import { BLD, TECH, MORK, HUNGER_MAX } from '../../game/constants.js'
import { scenarioOf } from '../../game/scenarios.js'
import { avgCond, brokenCount } from '../../game/wear.js'
import { num, fmt, daysTxt } from '../../game/format.js'
import { techPct, techEta } from '../../game/calc.js'
import { repLines } from '../../game/report.js'
import { settings } from '../../game/stops.js'
import { SPEC } from '../../game/constants.js'
import { specDeficit } from '../../game/specialists.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'
import SignedNum from '../SignedNum.vue'

const s = computed(() => game.s)
const title = computed(() => {
  const d = s.value.repDays
  return t('rp.title', { d })
})
const lines = computed(() => repLines(s.value, settings.short))
const eff = computed(() => c.value.e * c.value.f)
const nextMor = computed(() => Math.max(0, Math.min(100, s.value.mor + (c.value.mt - s.value.mor) * MORK)))
const prog = computed(() => scenarioOf(s.value).goal.progress(s.value))
const site = computed(() => s.value.q.length ? { name: BLD[s.value.q[0].k].n, st: c.value.sites[0] } : null)
const R = Math.round
// braki ludzi: pracownicy (rąk do pracy) i specjaliści względem celów (zakładka PRACOWNICY)
const missing = computed(() => Math.max(0, Math.ceil(c.value.needed - c.value.workforce)))
const specLack = computed(() => { const d = specDeficit(s.value, c.value); return Object.keys(SPEC).filter(T => d.by[T] > 0).map(T => ({ T, n: d.by[T] })) })
const depDays = computed(() => c.value.minProd > 0 ? Math.floor(c.value.deps / c.value.minProd) : null)
</script>

<template>
  <div class="t" style="color:var(--white)">{{ title }}</div>
  <div class="log"><p v-for="(l, i) in lines" :key="i"><span :class="l.cls">{{ l.text }}</span></p></div>

  <div class="card">
    <div class="t">{{ t('rp.forecast') }}</div>
    <div class="row"><span><PixelIcon name="work" />{{ t('rp.eff') }}</span><span>{{ R(eff * 100) }}%</span></div>
    <MeterBar :value="eff" :max="1" :cls="eff < 1 ? 'warn' : ''" />
    <div style="height:6px"></div>
    <div class="row"><span><PixelIcon name="pop" />{{ t('tile.work') }}</span>
      <span v-if="missing" class="neg">{{ t('rp.lackWork', { n: missing }) }} <span class="small">({{ t('rp.workOf', { a: fmt(c.workforce), b: fmt(Math.ceil(c.needed)) }) }})</span></span>
      <span v-else class="pos">{{ t('rp.enoughWork') }} <span class="small">({{ t('rp.free', { n: fmt(c.unemp) }) }})</span></span>
    </div>
    <div class="row"><span><PixelIcon name="lab" />{{ t('wt.spec').charAt(0) + t('wt.spec').slice(1).toLowerCase() }}</span>
      <span v-if="specLack.length"><template v-for="(x, i) in specLack" :key="x.T"><span :class="x.T === 'sci' ? 'neg' : 'warn'">{{ SPEC[x.T].n.toLowerCase() }} −{{ x.n }}</span>{{ i < specLack.length - 1 ? ', ' : '' }}</template> <span class="small">({{ t('rp.toTarget') }})</span></span>
      <span v-else class="pos">{{ t('rp.specOk') }}</span>
    </div>
    <div style="height:6px"></div>
    <div v-if="site" class="row">
      <span><PixelIcon name="build" />{{ t('rp.build') }}</span>
      <span>{{ site.name }} {{ Math.floor(site.st.pct) }}%
        <span class="small">(<span v-if="site.st.eta === Infinity" class="neg">{{ t('rp.stalled') }}</span><template v-else>{{ t('rp.eta', { d: daysTxt(site.st.eta) }) }}</template><template v-if="s.q.length > 1">; {{ t('rp.sites', { n: s.q.length }) }}</template>)</span>
      </span>
    </div>
    <div v-if="c.hungerNext || s.hungerDays" class="row">
      <span class="neg"><PixelIcon name="food" />{{ t('rp.famine') }}</span>
      <span v-if="c.hungerDeaths" class="neg">{{ t('rp.famineDeaths', { d: c.hungerNext, max: HUNGER_MAX, n: R(c.hungerDeaths) }) }}</span>
      <span v-else-if="!c.hungerNext" class="pos">{{ t('rp.famineEnds') }}</span>
      <span v-else class="warn">{{ t('rp.famineHeld', { d: c.hungerNext, max: HUNGER_MAX }) }}</span>
    </div>
    <div class="row"><span><PixelIcon name="food" />{{ t('tile.food') }}</span><span><SignedNum :n="c.foodProd - c.foodCons" /> t <span class="small">({{ t('rp.prodUse', { p: R(c.foodProd), u: R(c.foodCons) }) }})</span></span></div>
    <div v-if="c.season" class="row"><span><PixelIcon name="energy" />{{ t('rp.season', { n: c.season.n.toLowerCase() }) }}</span><span class="small">{{ t('rp.sun', { x: c.season.solar }) }}<template v-if="c.season.food !== 1"> · {{ t('rp.crops', { x: c.season.food }) }}</template><template v-if="c.season.heat"> · {{ t('rp.heat', { n: R(s.pop * c.season.heat) }) }}</template></span></div>
    <div class="row"><span><PixelIcon name="energy" />{{ t('tile.energy') }}</span><span><SignedNum :n="c.enProd - c.enNeed" /> kWh <span class="small">({{ t('rp.prodUse', { p: R(c.enProd), u: R(c.enNeed) }) }})</span></span></div>
    <div class="row"><span><PixelIcon name="battery" />{{ t('rp.battery') }}</span><span>{{ R(c.enStore) }}/{{ c.enCap }} kWh<span v-if="!c.enCap" class="small warn"> ({{ t('rp.noBat') }})</span><span v-else-if="c.enStore >= c.enCap - 0.01" class="small"> ({{ t('rp.charged') }})</span></span></div>
    <div class="row">
      <span><PixelIcon name="min" />{{ t('tile.min') }}</span>
      <span><SignedNum :n="c.minProd" /> t <span class="small" :class="{ neg: !s.dep.length && s.b.mine, warn: depDays !== null && depDays < 30 }">({{ s.dep.length ? t('rp.deps', { t: fmt(c.deps), d: depDays !== null ? daysTxt(depDays) : null }) : t('rp.noDeps') }})</span></span>
    </div>
    <div v-if="s.exp.length" class="row"><span><PixelIcon name="exp" />{{ t('tab.wyprawy') }}</span><span>{{ t('rp.exp', { n: s.exp.length }) }} <span class="small">({{ t('rp.expBack', { d: daysTxt(Math.min(...s.exp.map(x => x.left))) }) }})</span></span></div>
    <div class="row"><span><PixelIcon name="cr" />{{ t('tile.cr') }}</span><span><SignedNum :n="c.taxInc + c.trade - c.maint" /> <span class="small">({{ t('rp.money', { tax: R(c.taxInc), trade: c.trade ? R(c.trade) : null, maint: c.maint }) }})</span></span></div>
    <div class="row">
      <span><PixelIcon name="res" />{{ t('tile.res') }}</span>
      <span v-if="s.rs"><span class="pos">+{{ num(c.resProd / TECH[s.rs].c * 100) }}%</span> <span class="small">({{ TECH[s.rs].n }}: {{ Math.floor(techPct(s, s.rs)) }}%, {{ techEta(s, s.rs, c) }})</span></span>
      <span v-else class="warn">{{ t('rp.noProject') }}</span>
    </div>
    <div v-if="s.b.gun" class="row">
      <span><PixelIcon name="gun" />{{ t('rp.defence') }}</span>
      <span :class="c.defRed > 0 ? '' : 'neg'">{{ c.defRed > 0 ? t('rp.defOn', { n: R(c.defRed * 100) }) : t('rp.defOff') }} <span class="small">({{ t('rp.guns', { n: num(c.def), max: s.b.gun }) }})</span></span>
    </div>
    <div class="row"><span><PixelIcon name="repair" />{{ t('rp.cond') }}</span><span :class="brokenCount(s) ? 'neg' : avgCond(s) < 50 ? 'warn' : ''">{{ t('rp.avg', { n: Math.round(avgCond(s)) }) }}<template v-if="brokenCount(s)"> · {{ t('rp.broken', { n: brokenCount(s) }) }}</template> <span class="small">({{ t('rp.repairs', { n: Math.round(c.repairPts) }) }})</span></span></div>
    <div class="row"><span><PixelIcon name="mor" />{{ t('tile.mor') }}</span><span><SignedNum :n="nextMor - s.mor" /> <span class="small">({{ t('rp.morale', { a: R(s.mor), b: R(nextMor), c: R(c.mt) }) }})</span></span></div>
  </div>

  <div class="card">
    <div class="row"><span><PixelIcon name="pop" />{{ t('scen.goal', { g: scenarioOf(s).goal.text }) }}</span><span v-if="prog !== null">{{ R(prog) }}%</span></div>
    <div class="small">{{ scenarioOf(s).goal.status(s) }}</div>
    <MeterBar v-if="prog !== null" :value="prog" :max="100" />
  </div>
</template>
