<script setup>
import { computed } from 'vue'
import { game } from '../../store.js'
import { SERIES, MARKS } from '../../game/history.js'
import { settings } from '../../game/stops.js'
import { fmt } from '../../game/format.js'

// Osobny mały wykres dla każdej serii (różne skale), wspólne znaczniki wydarzeń.
const W = 700, H = 70
const RANGES = [[30, '30 DNI'], [90, '90 DNI'], [0, 'CAŁA GRA']]
const off = settings.chart.off
const toggle = k => { off[k] = !off[k] }

const hist = computed(() => {
  const h = game.s.hist || [], r = settings.chart.range
  return r ? h.slice(-r) : h
})
const span = computed(() => {
  const h = hist.value
  return h.length ? [h[0].d, h[h.length - 1].d] : [0, 1]
})
const xOf = d => { const [a, b] = span.value; return b > a ? (d - a) / (b - a) * W : W / 2 }
const marks = computed(() => (game.s.marks || []).filter(m => !off['m:' + m.k] && m.d >= span.value[0] && m.d <= span.value[1]))
const markColor = k => MARKS.find(m => m.k === k).color

const charts = computed(() => SERIES.filter(x => !off[x.k]).map(x => {
  const vals = hist.value.map(p => p[x.k] ?? 0)
  // skala od najmniejszej do największej wartości w zakresie (lepiej widać trendy)
  let lo = Math.min(...vals), hi = Math.max(...vals)
  if (hi - lo < 1) { lo -= 1; hi += 1 }
  const pts = hist.value.map(p => xOf(p.d).toFixed(1) + ',' + (H - 4 - ((p[x.k] ?? 0) - lo) / (hi - lo) * (H - 8)).toFixed(1)).join(' ')
  return { ...x, pts, lo, hi, last: vals.length ? vals[vals.length - 1] : 0 }
}))
</script>

<template>
  <div class="small">Historia kolonii dzień po dniu. Każdy wykres ma własną skalę. Kliknij nazwę serii albo rodzaj wydarzeń, żeby je ukryć lub pokazać.</div>
  <div class="row qty" style="margin-top:6px">
    <span>Zakres:</span>
    <span><button v-for="[r, l] in RANGES" :key="r" :class="{ on: settings.chart.range === r }" @click="settings.chart.range = r">{{ l }}</button></span>
  </div>
  <div class="chips">
    <button v-for="x in SERIES" :key="x.k" class="chip" :class="{ offc: off[x.k] }" :style="{ '--c': x.color }" @click="toggle(x.k)">{{ x.n }}</button>
  </div>
  <div class="chips">
    <button v-for="m in MARKS" :key="m.k" class="chip" :class="{ offc: off['m:' + m.k] }" :style="{ '--c': m.color }" @click="toggle('m:' + m.k)">▮ {{ m.n }}</button>
  </div>

  <p v-if="hist.length < 2" class="warn">Historia pojawi się po kilku dniach gry.</p>
  <template v-else>
    <div v-for="ch in charts" :key="ch.k" class="chart">
      <div class="row small"><span :style="{ color: ch.color }">{{ ch.n }}</span><span>teraz {{ fmt(ch.last) }} · min {{ fmt(ch.lo) }} · max {{ fmt(ch.hi) }}</span></div>
      <svg :viewBox="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" class="chartsvg">
        <line v-for="(m, i) in marks" :key="i" :x1="xOf(m.d)" :x2="xOf(m.d)" y1="0" :y2="H" :stroke="markColor(m.k)" stroke-width="2" stroke-dasharray="3 3" opacity=".7" />
        <polyline :points="ch.pts" fill="none" :stroke="ch.color" stroke-width="2" vector-effect="non-scaling-stroke" />
      </svg>
    </div>
    <div class="row small"><span>dzień {{ span[0] }}</span><span>dzień {{ span[1] }}</span></div>
  </template>
</template>
