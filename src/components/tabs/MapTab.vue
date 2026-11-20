<script setup>
import { computed } from 'vue'
import { t } from '../../i18n.js'
import { game, c } from '../../store.js'
import { BLD, BLD_GROUPS } from '../../game/constants.js'
import { bldAvail } from '../../game/scenarios.js'
import PixelIcon from '../PixelIcon.vue'

// Pikselowa mapa kolonii – tylko widok: budynki układają się same w strefach (grupy z listy budowy),
// place budowy pokazują postęp, zepsute budynki migają, zużyte są ciemniejsze. Po mapie chodzą koloniści.
const s = computed(() => game.s)
const zones = computed(() => BLD_GROUPS.map(g => {
  const st = s.value, tiles = []
  for (const k of g.ks) {
    if (!bldAvail(st, k)) continue
    const cond = (st.cond && st.cond[k]) || []
    for (let i = 0; i < (st.b[k] || 0); i++) {
      const x = cond[i] || { c: 100, broken: false }
      tiles.push({ id: k + i, k, c: x.c, broken: x.broken, title: BLD[k].n + ' · ' + t('bt.cond', { n: Math.round(x.c) }) + (x.broken ? ' · ' + t('map.broken') : '') })
    }
    st.q.forEach((x, i) => { if (x.k === k) tiles.push({ id: 'q' + i, k, site: true, pct: c.value.sites[i] ? c.value.sites[i].pct : 0, title: BLD[k].n + ' · ' + t('map.site', { n: Math.floor(c.value.sites[i] ? c.value.sites[i].pct : 0) }) }) })
  }
  return { ...g, n: g.n, tiles }
}).filter(z => z.tiles.length))
const totals = computed(() => {
  const all = zones.value.flatMap(z => z.tiles)
  return { b: all.filter(x => !x.site).length, q: all.filter(x => x.site).length, br: all.filter(x => x.broken).length }
})
// koloniści na mapie: jeden ludzik na 40 osób (najwyżej 24), każdy z innym torem i tempem
const walkers = computed(() => Array.from({ length: Math.min(24, Math.ceil(s.value.pop / 40)) }, (_, i) => ({
  i, top: 8 + ((i * 37) % 84), dur: 14 + ((i * 7) % 11), delay: -((i * 3.7) % 20), back: i % 2 === 1
})))
</script>

<template>
  <div class="small">{{ t('map.info') }}</div>
  <div class="row small" style="margin:6px 0">
    <span>{{ t('map.totals', totals) }}</span>
  </div>
  <div class="cmap" :class="'ground-' + (s.sc || 'moon')">
    <div class="walkers" aria-hidden="true">
      <span v-for="w in walkers" :key="w.i" class="walker" :class="{ back: w.back }" :style="{ top: w.top + '%', animationDuration: w.dur + 's', animationDelay: w.delay + 's' }"><PixelIcon name="colonist" /></span>
    </div>
    <div v-for="z in zones" :key="z.k" class="zone" :style="{ '--g': z.color }">
      <div class="zname">{{ z.n }}</div>
      <div class="ztiles">
        <div v-for="x in z.tiles" :key="x.id" class="mtile" :class="{ broken: x.broken, site: x.site }" :title="x.title" :style="x.site ? null : { opacity: 0.55 + 0.45 * Math.max(0, x.c) / 100 }">
          <PixelIcon :name="x.k" />
          <template v-if="x.site"><span class="scaf"><PixelIcon name="site" /></span><span class="sbar"><i :style="{ width: x.pct + '%' }"></i></span></template>
        </div>
      </div>
    </div>
    <p v-if="!zones.length" class="small">{{ t('map.empty') }}</p>
  </div>
</template>
