<script setup>
import { computed } from 'vue'
import { game, c } from '../store.js'
import { TECH, HUNGER_MAX } from '../game/constants.js'
import { fmt, num, daysTxt } from '../game/format.js'
import { nextTech, techPct } from '../game/calc.js'
import PixelIcon from './PixelIcon.vue'
import MeterBar from './MeterBar.vue'
import DeltaNum from './DeltaNum.vue'

const fill = (v, max) => v >= max ? 'warn' : ''

// Każdy kafelek: ikona, etykieta, wartość, „/maks.”, zmiana, czy ostrzegać, pasek
const tiles = computed(() => {
  const s = game.s, cc = c.value, p = s.prev || {}
  const depDays = cc.minProd > 0 ? Math.floor(cc.deps / cc.minProd) : null
  const depNote = !s.dep.length
    ? { text: 'złoża: brak', cls: s.b.mine ? 'neg' : '' }
    : { text: 'złoża: ' + fmt(cc.deps) + ' t' + (depDays !== null ? ' · ' + daysTxt(depDays) : ''), cls: depDays !== null && depDays < 30 ? 'warn' : '' }
  const hd = s.hungerDays || 0
  const foodNote = hd ? { text: 'głód: dzień ' + hd + '/' + HUNGER_MAX, cls: 'neg' } : cc.hungerNext ? { text: 'jutro zacznie się głód', cls: 'neg' } : null
  const resPerDay = s.rs && cc.resProd > 0 ? '+' + num(cc.resProd / TECH[s.rs].c * 100) + '%' : ''
  return [
    { icon: 'pop', label: 'Koloniści', v: fmt(s.pop), of: '/' + cc.cap, cur: s.pop, prev: p.pop, neg: false, bar: [s.pop, cc.cap, s.pop > cc.cap ? 'neg' : fill(s.pop, cc.cap)] },
    { icon: 'mor', label: 'Morale', v: Math.round(s.mor) + '%', cur: s.mor, prev: p.mor, neg: s.mor < 30, bar: [s.mor, 100, s.mor < 30 ? 'neg' : s.mor < 45 ? 'warn' : ''] },
    { icon: 'food', label: 'Żywność', v: fmt(s.food), of: '/' + cc.foodCap + ' t', cur: s.food, prev: p.food, neg: s.food < cc.foodCons, bar: [s.food, cc.foodCap, s.food < cc.foodCons ? 'neg' : fill(s.food, cc.foodCap)], note: foodNote },
    { icon: 'energy', label: 'Energia', v: fmt(s.energy), of: '/' + cc.enCap + ' kWh', cur: s.energy, prev: p.energy, neg: cc.f < 1, bar: [s.energy, cc.enCap, cc.f < 1 ? 'neg' : fill(s.energy, cc.enCap)] },
    { icon: 'min', label: 'Minerały', v: fmt(s.min), of: '/' + cc.minCap + ' t', cur: s.min, prev: p.min, neg: false, bar: [s.min, cc.minCap, fill(s.min, cc.minCap)], note: depNote },
    { icon: 'cr', label: 'Kredyty', v: fmt(s.cr), cur: s.cr, prev: p.cr, neg: s.cr < 0, bar: s.cr < 0 ? [-s.cr, 500, 'neg'] : null },
    { icon: 'res', label: 'Badania', v: s.rs ? Math.floor(techPct(s, s.rs)) + '%' : '—', extra: resPerDay, neg: !s.rs && s.b.lab > 0 && !!nextTech(s), bar: s.rs ? [techPct(s, s.rs), 100, ''] : null },
    { icon: 'work', label: 'Pracownicy', v: fmt(cc.workforce), of: '/' + fmt(cc.needed), neg: cc.e < 1, bar: [cc.workforce, cc.needed, cc.e < 1 ? 'neg' : ''] }
  ]
})
</script>

<template>
  <div class="res">
    <div v-for="t in tiles" :key="t.icon" class="tile">
      <div class="l"><PixelIcon :name="t.icon" />{{ t.label }}</div>
      <div class="v" :class="{ neg: t.neg }">
        {{ t.v }}<span v-if="t.of" class="small">{{ t.of }}</span>
        <DeltaNum v-if="t.cur != null" :cur="t.cur" :prev="t.prev" />
        <span v-if="t.extra" class="d pos">{{ t.extra }}</span>
      </div>
      <MeterBar v-if="t.bar" :value="t.bar[0]" :max="t.bar[1]" :cls="t.bar[2]" />
      <div v-if="t.note" class="tnote" :class="t.note.cls">{{ t.note.text }}</div>
    </div>
  </div>
</template>
