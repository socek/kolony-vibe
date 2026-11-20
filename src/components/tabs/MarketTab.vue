<script setup>
import { computed } from 'vue'
import { game, ui, prices, sell, buy, acceptOrder, deliverOrder } from '../../store.js'
import { orderTitle, rewardText, penaltyText, canAccept, canDeliver } from '../../game/orders.js'
import { NB_TRADES, nbWait } from '../../game/expeditions.js'
import { neighborTrade } from '../../store.js'
import { daysTxt } from '../../game/format.js'
import { RES, capOf } from '../../game/constants.js'
import { fmt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const ord = computed(() => s.value.ord || { rep: 50, offers: [], active: [] })
const rows = computed(() => Object.entries(RES).map(([k, r]) => {
  const p = prices(k), cap = capOf(s.value, k)
  return { k, r, p, cap, sv: Math.round(p.sell * ui.qty), bv: Math.round(p.buy * ui.qty), room: s.value[k] + ui.qty <= cap }
}))
</script>

<template>
  <div class="card" style="border-top:0">
    <div class="row"><span class="t"><PixelIcon name="exp" />ZLECENIA LUJ</span><span class="small">reputacja u LUJ: <span :class="ord.rep >= 50 ? 'pos' : 'neg'">{{ Math.round(ord.rep) }}/100</span></span></div>
    <div class="small">Ludzka Unia Jedności co jakiś czas zleca kolonii zadania. Przyjęte zlecenie ma termin i karę za niewykonanie. Wyższa reputacja – wyższe nagrody.</div>
    <div v-if="!ord.offers.length && !ord.active.length" class="small" style="margin-top:4px">Na razie brak zleceń.</div>
    <div v-for="x in ord.active" :key="x.id" class="order">
      <div class="row"><span>{{ orderTitle(x) }}</span><span :class="x.deadline - s.m < 5 ? 'neg' : 'warn'">termin: {{ x.deadline - s.m >= 0 ? daysTxt(x.deadline - s.m + 1) : 'dziś' }}</span></div>
      <div class="small">{{ x.who }} – {{ x.why }}. Nagroda: <span class="pos">{{ rewardText(x) }}</span> · kara: <span class="neg">{{ penaltyText(x) }}</span></div>
      <div class="row small"><span class="neg">{{ canDeliver(s, x.id) }}</span><button v-if="x.kind !== 'tech'" :disabled="!!canDeliver(s, x.id)" @click="deliverOrder(x.id)">DOSTARCZ</button></div>
    </div>
    <div v-for="x in ord.offers" :key="x.id" class="order offer">
      <div class="row"><span>OFERTA: {{ orderTitle(x) }}</span><span class="small">wygasa za {{ daysTxt(Math.max(1, x.expires - s.m + 1)) }}</span></div>
      <div class="small">{{ x.who }} – {{ x.why }}. Czas na wykonanie: {{ daysTxt(x.days) }}. Nagroda: <span class="pos">{{ rewardText(x) }}</span> · kara: <span class="neg">{{ penaltyText(x) }}</span></div>
      <div class="row small"><span class="neg">{{ canAccept(s, x.id) }}</span><button :disabled="!!canAccept(s, x.id)" @click="acceptOrder(x.id)">PRZYJMIJ</button></div>
    </div>
  </div>
  <div v-if="s.nb" class="card">
    <div class="t"><PixelIcon name="pop" />OSADA SĄSIEDZKA „{{ s.nb.n.toUpperCase() }}”</div>
    <div class="small">Sąsiedzi chętnie handlują, ale każdą wymianę można powtórzyć dopiero po 7 dniach.</div>
    <div v-for="t in NB_TRADES" :key="t.k" class="row small" style="margin-top:4px">
      <span>{{ t.n }} ({{ t.d }})<span v-if="nbWait(s, t.k)" class="warn"> – za {{ daysTxt(nbWait(s, t.k)) }}</span><span v-else-if="t.need(s)" class="neg"> – {{ t.need(s) }}</span></span>
      <button :disabled="!!nbWait(s, t.k) || !!t.need(s)" @click="neighborTrade(t.k)">WYMIEŃ</button>
    </div>
  </div>
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
