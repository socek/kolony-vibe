<script setup>
import { t } from '../../i18n.js'
import { computed } from 'vue'
import { game, c, pwrTo, pwrShift, pwrLimit } from '../../store.js'
import { BLD, pwrOrder, plimOf } from '../../game/constants.js'
import { fmt } from '../../game/format.js'
import { useDragList } from '../../dragList.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

// Zakładka ELEKTRYCZNOŚĆ: kolejność odbiorców prądu (wyżej = zasilani wcześniej) i ile budynków każdego typu ma prąd
const s = computed(() => game.s)
const R = Math.round
const shown = computed(() => pwrOrder(s.value).filter(k => s.value.b[k] > 0))
const { drag, view, start: startDrag } = useDragList(() => shown.value, 'pwr', pwrTo)
const rows = computed(() => (view.value || shown.value).map(k => {
  const n = s.value.b[k], lim = Math.min(plimOf(s.value, k), n), want = c.value.enWant[k] || 0, got = c.value.enGot[k] || 0
  return { k, n, lim, on: lim > 0, want, got, P: c.value.P[k] ?? 0 }
}))
const setLimit = (r, v) => pwrLimit(r.k, v >= r.n ? null : v)
const infraPct = computed(() => c.value.enInfra > 0 ? c.value.gotInfra / c.value.enInfra : 1)
</script>

<template>
  <div class="card" style="border-top:0">
    <div class="row"><span><PixelIcon name="energy" />{{ t('pw.prod') }}</span><span>{{ fmt(c.enProd) }} kWh</span></div>
    <div class="row"><span><PixelIcon name="battery" />{{ t('pw.stored') }}</span><span>{{ fmt(s.energy) }}/{{ c.enCap }} kWh</span></div>
    <div class="row"><span>{{ t('pw.need') }}</span><span :class="{ neg: c.f < 1 }">{{ fmt(c.enNeed) }} kWh<template v-if="c.f < 1"> ({{ t('pw.covered', { n: R(c.f * 100) }) }})</template></span></div>
    <div class="small" style="margin-top:4px">{{ t('pw.info') }}</div>
  </div>

  <div class="card">
    <div class="row"><span class="t"><PixelIcon name="house" />{{ t('pw.infra') }}</span><span>{{ fmt(c.gotInfra) }}/{{ fmt(c.enInfra) }} kWh</span></div>
    <div class="small">{{ t('pw.infraInfo', { h: fmt(c.heat) }) }}</div>
    <MeterBar :value="infraPct" :max="1" :cls="infraPct < 1 ? 'neg' : ''" />
  </div>

  <div v-if="!rows.length" class="small" style="margin-top:6px">{{ t('pw.none') }}</div>
  <template v-else>
    <div class="small" style="margin:6px 0 2px">{{ t('pw.orderInfo') }}</div>
    <div v-for="(r, i) in rows" :key="r.k" class="card job" :class="{ dragging: drag === r.k }" :data-pwr="r.k">
      <div class="row">
        <span class="t"><span class="drag" :title="t('wt.drag')" :aria-label="t('wt.drag')" @pointerdown="startDrag($event, r.k)">≡</span>{{ i + 1 }}. <PixelIcon :name="r.k" />{{ BLD[r.k].n }} ×{{ r.n }}</span>
        <span v-if="r.on">{{ fmt(r.got) }}/{{ fmt(r.want) }} kWh<template v-if="r.want > 0"> ({{ R(r.got / r.want * 100) }}%)</template></span>
        <span v-else class="neg">{{ t('pw.off') }}</span>
      </div>
      <MeterBar :value="r.P" :max="1" :cls="!r.on ? 'neg' : r.want > 0 && r.got < r.want - 0.01 ? 'neg' : r.lim < r.n ? 'warn' : ''" />
      <div class="pr lim">
        <button :disabled="i === 0" :title="t('wt.up')" :aria-label="t('wt.up')" @click="pwrShift(r.k, -1, shown)">▲</button>
        <button :disabled="i === rows.length - 1" :title="t('wt.down')" :aria-label="t('wt.down')" @click="pwrShift(r.k, 1, shown)">▼</button>
        <input type="range" min="0" :max="r.n" step="1" :value="r.lim" :aria-label="t('pw.limitOf', { n: BLD[r.k].n })" @input="setLimit(r, +$event.target.value)">
        <span class="small" :class="{ neg: !r.on, warn: r.on && r.lim < r.n }">{{ !r.on ? t('wt.stop') : r.lim >= r.n ? t('pw.all') : t('pw.some', { a: r.lim, b: r.n }) }}</span>
      </div>
    </div>
  </template>
</template>
