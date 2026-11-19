<script setup>
import { computed } from 'vue'
import { game, c, research } from '../../store.js'
import { TECH } from '../../game/constants.js'
import { num } from '../../game/format.js'
import { techPct, techEta } from '../../game/calc.js'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const rows = computed(() => Object.entries(TECH).map(([k, t]) => ({ k, t, on: s.value.rs === k, pc: techPct(s.value, k), done: !!s.value.tech[k] })))
</script>

<template>
  <div class="small">
    Wybierz technologię, a naukowcy z laboratoriów będą nad nią codziennie pracować ({{ num(c.resProd) }} pkt/dzień). Postęp nie przepada, gdy zmienisz projekt.
    <span v-if="!s.b.lab" class="warn">Zbuduj laboratorium, żeby prowadzić badania.</span>
  </div>
  <div v-for="r in rows" :key="r.k" class="card">
    <div class="row">
      <span class="t">{{ r.t.n }}</span>
      <span v-if="r.done" class="pos">ODKRYTE</span>
      <span v-else-if="r.on" class="warn">BADANE · {{ Math.floor(r.pc) }}%</span>
      <button v-else @click="research(r.k)">{{ r.pc > 0 ? 'WZNÓW (' + Math.floor(r.pc) + '%)' : 'BADAJ' }}</button>
    </div>
    <div class="small">{{ r.t.d }} · koszt {{ r.t.c }} pkt<template v-if="r.on"> · {{ techEta(s, r.k, c) }}</template></div>
    <MeterBar v-if="!r.done" :value="r.pc" :max="100" :cls="r.on ? '' : 'warn'" />
  </div>
</template>
