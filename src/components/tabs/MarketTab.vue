<script setup>
import { computed } from 'vue'
import { game, ui, prices, sell, buy } from '../../store.js'
import { RES, capOf } from '../../game/constants.js'
import { fmt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const rows = computed(() => Object.entries(RES).map(([k, r]) => {
  const p = prices(k), cap = capOf(s.value, k)
  return { k, r, p, cap, sv: Math.round(p.sell * ui.qty), bv: Math.round(p.buy * ui.qty), room: s.value[k] + ui.qty <= cap }
}))
</script>

<template>
  <div class="row qty">
    <span>Ilość:</span>
    <span><button v-for="q in (s.tech.exchange ? [10, 50, 100, 500] : [10, 50, 100])" :key="q" :class="{ on: ui.qty === q }" @click="ui.qty = q">{{ q }} t</button></span>
  </div>
  <div v-if="s.b.port" class="small pos">Port kosmiczny daje lepsze ceny.</div>
  <div v-else class="small">Port kosmiczny poprawiłby ceny.</div>

  <div v-for="x in rows" :key="x.k" class="card">
    <div class="row"><span class="t"><PixelIcon :name="x.k" />{{ x.r.n }}</span><span>masz {{ fmt(s[x.k]) }}/{{ x.cap }} t</span></div>
    <MeterBar :value="s[x.k]" :max="x.cap" :cls="s[x.k] >= x.cap ? 'warn' : ''" />
    <div class="row">
      <span class="small">sprzedaż {{ x.p.sell.toFixed(1) }} · kupno {{ x.p.buy.toFixed(1) }} kr/t</span>
      <span>
        <button :disabled="s[x.k] < ui.qty" @click="sell(x.k)">SPRZEDAJ +{{ x.sv }} kr</button>
        <button :disabled="s.cr < x.bv || !x.room" :title="x.room ? null : (x.k === 'food' ? 'Brak miejsca w chłodniach' : 'Brak miejsca w magazynach minerałów')" @click="buy(x.k)">KUP −{{ x.bv }} kr</button>
      </span>
    </div>
  </div>
</template>
