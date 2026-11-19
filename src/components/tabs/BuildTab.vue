<script setup>
import { computed } from 'vue'
import { game, c, build, demolish, cancelSite, siteFirst } from '../../store.js'
import { BLD, TECH, MAINT } from '../../game/constants.js'
import { fmt, num, daysTxt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const rows = computed(() => Object.entries(BLD).map(([k, b]) => {
  const st = s.value, n = st.q.filter(x => x.k === k).length
  const full = !!b.max && st.b[k] + n >= b.max, lock = !!b.req && !st.tech[b.req]
  return { k, b, n, lock, can: !lock && !full && st.cr >= b.cr && st.min >= b.mi }
}))
</script>

<template>
  <div class="small">Zapłacone budynki trafiają na plac budowy (lista na dole). Im więcej budowniczych, tym szybciej powstają – ich liczbę ustalasz priorytetem w zakładce PRACA. Wolni budowniczowie trafiają najpierw na pierwszy plac w kolejce. Utrzymanie: {{ MAINT }} kr/dzień za budynek.</div>

  <div v-for="r in rows" :key="r.k" class="card">
    <div class="row">
      <span class="t"><PixelIcon :name="r.k" />{{ r.b.n }} ×{{ s.b[r.k] }}<span v-if="r.n" class="small warn"> +{{ r.n }} w budowie</span></span>
      <span>
        <button :disabled="!s.b[r.k]" title="Rozbierz" @click="demolish(r.k)">−</button>
        <button :disabled="!r.can" @click="build(r.k)">BUDUJ</button>
      </span>
    </div>
    <div class="small">
      {{ r.b.d }} · koszt {{ r.b.cr }} kr, {{ r.b.mi }} t min. · {{ r.b.w }} prac. · {{ num(r.b.en) }} kWh/dzień · budowa {{ daysTxt(Math.ceil(r.b.bt / r.b.crew)) }} przy {{ r.b.crew }} budowniczych<template v-if="r.b.max"> · maks. {{ r.b.max }}</template>
      <template v-if="r.lock"> · <span class="neg">wymaga technologii: {{ TECH[r.b.req].n }}</span></template>
    </div>
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
