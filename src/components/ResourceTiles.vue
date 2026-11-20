<script setup>
import { t } from '../i18n.js'
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
    ? { text: t('tile.depNone'), cls: s.b.mine ? 'neg' : '' }
    : { text: t('tile.dep', { t: fmt(cc.deps), days: depDays !== null ? daysTxt(depDays) : null }), cls: depDays !== null && depDays < 30 ? 'warn' : '' }
  const hd = s.hungerDays || 0
  const foodNote = hd ? { text: t('tile.hunger', { d: hd, max: HUNGER_MAX }), cls: 'neg' } : cc.hungerNext ? { text: t('tile.hungerTomorrow'), cls: 'neg' } : null
  const resPerDay = s.rs && cc.resProd > 0 ? '+' + num(cc.resProd / TECH[s.rs].c * 100) + '%' : ''
  return [
    { icon: 'pop', label: t('tile.pop'), v: fmt(s.pop), of: '/' + cc.cap, cur: s.pop, prev: p.pop, neg: false, bar: [s.pop, cc.cap, s.pop > cc.cap ? 'neg' : fill(s.pop, cc.cap)] },
    { icon: 'mor', label: t('tile.mor'), v: Math.round(s.mor) + '%', cur: s.mor, prev: p.mor, neg: s.mor < 30, bar: [s.mor, 100, s.mor < 30 ? 'neg' : s.mor < 45 ? 'warn' : ''] },
    { icon: 'food', label: t('tile.food'), v: fmt(s.food), of: '/' + cc.foodCap + ' t', cur: s.food, prev: p.food, neg: s.food < cc.foodCons, bar: [s.food, cc.foodCap, s.food < cc.foodCons ? 'neg' : fill(s.food, cc.foodCap)], note: foodNote },
    { icon: 'energy', label: t('tile.energy'), v: fmt(s.energy), of: '/' + cc.enCap + ' kWh', cur: s.energy, prev: p.energy, neg: cc.f < 1, bar: [s.energy, cc.enCap, cc.f < 1 ? 'neg' : fill(s.energy, cc.enCap)] },
    { icon: 'min', label: t('tile.min'), v: fmt(s.min), of: '/' + cc.minCap + ' t', cur: s.min, prev: p.min, neg: false, bar: [s.min, cc.minCap, fill(s.min, cc.minCap)], note: depNote },
    { icon: 'cr', label: t('tile.cr'), v: fmt(s.cr), cur: s.cr, prev: p.cr, neg: s.cr < 0, bar: s.cr < 0 ? [-s.cr, 500, 'neg'] : null },
    { icon: 'res', label: t('tile.res'), v: s.rs ? Math.floor(techPct(s, s.rs)) + '%' : '—', extra: resPerDay, neg: !s.rs && s.b.lab > 0 && !!nextTech(s), bar: s.rs ? [techPct(s, s.rs), 100, ''] : null },
    { icon: 'work', label: t('tile.work'), v: fmt(cc.workforce), of: '/' + fmt(cc.needed), neg: cc.e < 1, bar: [cc.workforce, cc.needed, cc.e < 1 ? 'neg' : ''] }
  ]
})
</script>

<template>
  <div class="res">
    <div v-for="x in tiles" :key="x.icon" class="tile">
      <div class="l"><PixelIcon :name="x.icon" />{{ x.label }}</div>
      <div class="v" :class="{ neg: x.neg }">
        {{ x.v }}<span v-if="x.of" class="small">{{ x.of }}</span>
        <DeltaNum v-if="x.cur != null" :cur="x.cur" :prev="x.prev" />
        <span v-if="x.extra" class="d pos">{{ x.extra }}</span>
      </div>
      <MeterBar v-if="x.bar" :value="x.bar[0]" :max="x.bar[1]" :cls="x.bar[2]" />
      <div v-if="x.note" class="tnote" :class="x.note.cls">{{ x.note.text }}</div>
    </div>
  </div>
</template>
