<script setup>
import { t } from '../../i18n.js'
import { computed } from 'vue'
import { game, c, build, demolish, cancelSite, siteFirst } from '../../store.js'
import { BLD, BLD_GROUPS, TECH, MAINT } from '../../game/constants.js'
import { fmt, num, daysTxt } from '../../game/format.js'
import { condMul } from '../../game/wear.js'
import { bldAvail, buildBlock, slotsInfo } from '../../game/scenarios.js'
const condOf = (st, k) => { const a = (st.cond && st.cond[k]) || []; return a.length ? { avg: a.reduce((t, x) => t + x.c, 0) / a.length, broken: a.filter(x => x.broken).length } : null }
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const rowOf = computed(() => Object.fromEntries(Object.entries(BLD).map(([k, b]) => {
  const st = s.value, n = st.q.filter(x => x.k === k).length
  const full = !!b.max && st.b[k] + n >= b.max, lock = !!b.req && !st.tech[b.req]
  const block = buildBlock(st, k)
  return [k, { k, b, n, lock, block, can: !lock && !full && !block && st.cr >= b.cr && st.min >= b.mi }]
})))
</script>

<template>
  <div class="small">{{ t('bt.info', { m: MAINT }) }}</div>

  <div v-if="slotsInfo(s)" class="card" style="border-top:0">
    <div class="row"><span>{{ t('bt.slots') }}</span><span :class="slotsInfo(s).used >= slotsInfo(s).max ? 'neg' : ''">{{ slotsInfo(s).used }}/{{ slotsInfo(s).max }}</span></div>
    <MeterBar :value="slotsInfo(s).used" :max="slotsInfo(s).max" :cls="slotsInfo(s).used >= slotsInfo(s).max ? 'neg' : 'warn'" />
  </div>
  <template v-for="g in BLD_GROUPS.filter(g => g.ks.some(k => bldAvail(s, k)))" :key="g.k">
  <div class="grph" :style="{ '--g': g.color }"><PixelIcon :name="g.icon" />{{ g.n }}</div>
  <div v-for="r in g.ks.filter(k => bldAvail(s, k)).map(k => rowOf[k])" :key="r.k" class="card" :class="{ locked: r.lock }">
    <div class="row">
      <span class="t"><PixelIcon :name="r.k" />{{ r.b.n }} ×{{ s.b[r.k] }}<span v-if="r.n" class="small warn"> {{ t('bt.inBuild', { n: r.n }) }}</span></span>
      <span>
        <button :disabled="!s.b[r.k]" :title="t('bt.demolish')" @click="demolish(r.k)">−</button>
        <button :disabled="!r.can" @click="build(r.k)">{{ t('bt.build') }}</button>
      </span>
    </div>
    <div class="small">
      {{ r.b.d }} · {{ t('bt.cost', { cr: r.b.cr, mi: r.b.mi }) }} · {{ r.b.w > 0 && r.b.w < 1 ? t('bt.workersPer', { n: Math.round(1 / r.b.w) }) : t('bt.workers', { n: r.b.w }) }} · {{ t('bt.energy', { n: num(r.b.en) }) }} · {{ t('bt.time', { d: daysTxt(Math.ceil(r.b.bt / r.b.crew)), n: r.b.crew }) }}<template v-if="r.b.max"> · {{ t('bt.max', { n: r.b.max }) }}</template>
    </div>
    <div v-if="s.b[r.k] && condOf(s, r.k)" class="small" :class="condOf(s, r.k).broken ? 'neg' : condOf(s, r.k).avg < 40 ? 'warn' : ''">{{ t('bt.cond', { n: Math.round(condOf(s, r.k).avg) }) }}<template v-if="condOf(s, r.k).broken"> · {{ t('rp.broken', { n: condOf(s, r.k).broken }) }}</template> · {{ t('bt.eff', { n: Math.round(condMul(s, r.k) * 100) }) }}</div>
    <div v-if="r.block && !r.lock" class="small neg">{{ r.block }}</div>
    <div v-if="r.lock" class="locknote"><PixelIcon name="lock" />{{ t('bt.needTech', { n: TECH[r.b.req].n }) }}</div>
    <div class="cost2">
      <div>
        <div class="small"><PixelIcon name="cr" />{{ t('bt.credits', { a: fmt(Math.min(Math.max(s.cr, 0), r.b.cr)), b: r.b.cr }) }}</div>
        <MeterBar :value="s.cr" :max="r.b.cr" :cls="s.cr >= r.b.cr ? '' : 'warn'" />
      </div>
      <div>
        <div class="small"><PixelIcon name="min" />{{ t('bt.minerals', { a: fmt(Math.min(s.min, r.b.mi)), b: r.b.mi }) }}</div>
        <MeterBar :value="s.min" :max="r.b.mi" :cls="s.min >= r.b.mi ? '' : 'warn'" />
      </div>
    </div>
  </div>

  </template>

  <div v-if="s.q.length" class="card" style="border-top:2px solid var(--text)">
    <div class="t"><PixelIcon name="build" />{{ t('bt.sites') }}</div>
    <div v-for="(x, i) in s.q" :key="i" style="margin-top:6px">
      <div class="row">
        <span><PixelIcon :name="x.k" />{{ BLD[x.k].n }}</span>
        <span>{{ Math.floor(c.sites[i].pct) }}% ·
          <span v-if="c.sites[i].eta === Infinity" class="neg">{{ t('rp.stalled') }}</span><template v-else>{{ t('rp.eta', { d: daysTxt(c.sites[i].eta) }) }}</template>
        </span>
      </div>
      <MeterBar :value="c.sites[i].pct" :max="100" :cls="c.sites[i].rate > 0 ? '' : 'neg'" />
      <div class="row small">
        <span>{{ t('bt.builders', { a: fmt(c.sites[i].a), b: fmt(Math.ceil(c.sites[i].need)) }) }}</span>
        <span>
          <button v-if="i" @click="siteFirst(i)">{{ t('bt.first') }}</button>
          <button :title="t('bt.cancelTitle')" @click="cancelSite(i)">{{ t('bt.cancel') }}</button>
        </span>
      </div>
    </div>
  </div>
</template>
