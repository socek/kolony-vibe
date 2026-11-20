<script setup>
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
  <div class="small">Zapłacone budynki trafiają na plac budowy (lista na dole). Im więcej budowniczych, tym szybciej powstają – ich liczbę ustalasz priorytetem w zakładce PRACA. Wolni budowniczowie trafiają najpierw na pierwszy plac w kolejce. Utrzymanie: {{ MAINT }} kr/dzień za budynek.</div>

  <div v-if="slotsInfo(s)" class="card" style="border-top:0">
    <div class="row"><span>Miejsca na budynki</span><span :class="slotsInfo(s).used >= slotsInfo(s).max ? 'neg' : ''">{{ slotsInfo(s).used }}/{{ slotsInfo(s).max }}</span></div>
    <MeterBar :value="slotsInfo(s).used" :max="slotsInfo(s).max" :cls="slotsInfo(s).used >= slotsInfo(s).max ? 'neg' : 'warn'" />
  </div>
  <template v-for="g in BLD_GROUPS.filter(g => g.ks.some(k => bldAvail(s, k)))" :key="g.n">
  <div class="grph" :style="{ '--g': g.color }"><PixelIcon :name="g.icon" />{{ g.n }}</div>
  <div v-for="r in g.ks.filter(k => bldAvail(s, k)).map(k => rowOf[k])" :key="r.k" class="card" :class="{ locked: r.lock }">
    <div class="row">
      <span class="t"><PixelIcon :name="r.k" />{{ r.b.n }} ×{{ s.b[r.k] }}<span v-if="r.n" class="small warn"> +{{ r.n }} w budowie</span></span>
      <span>
        <button :disabled="!s.b[r.k]" title="Rozbierz" @click="demolish(r.k)">−</button>
        <button :disabled="!r.can" @click="build(r.k)">BUDUJ</button>
      </span>
    </div>
    <div class="small">
      {{ r.b.d }} · koszt {{ r.b.cr }} kr, {{ r.b.mi }} t min. · {{ r.b.w }} prac. · {{ num(r.b.en) }} kWh/dzień · budowa {{ daysTxt(Math.ceil(r.b.bt / r.b.crew)) }} przy {{ r.b.crew }} budowniczych<template v-if="r.b.max"> · maks. {{ r.b.max }}</template>
    </div>
    <div v-if="s.b[r.k] && condOf(s, r.k)" class="small" :class="condOf(s, r.k).broken ? 'neg' : condOf(s, r.k).avg < 40 ? 'warn' : ''">stan: {{ Math.round(condOf(s, r.k).avg) }}%<template v-if="condOf(s, r.k).broken"> · awarie: {{ condOf(s, r.k).broken }}</template> · sprawność {{ Math.round(condMul(s, r.k) * 100) }}%</div>
    <div v-if="r.block && !r.lock" class="small neg">{{ r.block }}</div>
    <div v-if="r.lock" class="locknote"><PixelIcon name="lock" />Wymaga technologii: {{ TECH[r.b.req].n }} (zakładka TECHNOLOGIE)</div>
    <div class="cost2">
      <div>
        <div class="small"><PixelIcon name="cr" />kredyty {{ fmt(Math.min(Math.max(s.cr, 0), r.b.cr)) }}/{{ r.b.cr }}</div>
        <MeterBar :value="s.cr" :max="r.b.cr" :cls="s.cr >= r.b.cr ? '' : 'warn'" />
      </div>
      <div>
        <div class="small"><PixelIcon name="min" />minerały {{ fmt(Math.min(s.min, r.b.mi)) }}/{{ r.b.mi }} t</div>
        <MeterBar :value="s.min" :max="r.b.mi" :cls="s.min >= r.b.mi ? '' : 'warn'" />
      </div>
    </div>
  </div>

  </template>

  <div v-if="s.q.length" class="card" style="border-top:2px solid var(--text)">
    <div class="t"><PixelIcon name="build" />PLACE BUDOWY</div>
    <div v-for="(x, i) in s.q" :key="i" style="margin-top:6px">
      <div class="row">
        <span><PixelIcon :name="x.k" />{{ BLD[x.k].n }}</span>
        <span>{{ Math.floor(c.sites[i].pct) }}% ·
          <span v-if="c.sites[i].eta === Infinity" class="neg">stoi</span><template v-else>jeszcze {{ daysTxt(c.sites[i].eta) }}</template>
        </span>
      </div>
      <MeterBar :value="c.sites[i].pct" :max="100" :cls="c.sites[i].rate > 0 ? '' : 'neg'" />
      <div class="row small">
        <span>budowniczowie: {{ fmt(c.sites[i].a) }}/{{ fmt(Math.ceil(c.sites[i].need)) }}</span>
        <span>
          <button v-if="i" @click="siteFirst(i)">NAJPIERW</button>
          <button title="Zwrot połowy kosztów" @click="cancelSite(i)">ANULUJ</button>
        </span>
      </div>
    </div>
  </div>
</template>
