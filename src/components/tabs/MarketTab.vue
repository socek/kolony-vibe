<script setup>
import { t, locale } from '../../i18n.js'
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
    <div class="row"><span class="t"><PixelIcon name="exp" />{{ t('mk.orders') }}</span><span class="small">{{ t('mk.rep') }} <span :class="ord.rep >= 50 ? 'pos' : 'neg'">{{ Math.round(ord.rep) }}/100</span></span></div>
    <div class="small">{{ t('mk.ordersInfo') }}</div>
    <div v-if="!ord.offers.length && !ord.active.length" class="small" style="margin-top:4px">{{ t('mk.noOrders') }}</div>
    <div v-for="x in ord.active" :key="x.id" class="order">
      <div class="row"><span>{{ orderTitle(x) }}</span><span :class="x.deadline - s.m < 5 ? 'neg' : 'warn'">{{ t('mk.deadline', { d: x.deadline - s.m >= 0 ? daysTxt(x.deadline - s.m + 1) : t('mk.today') }) }}</span></div>
      <div class="small">{{ x.who }} – {{ x.why }}. {{ t('mk.reward') }} <span class="pos">{{ rewardText(x) }}</span> · {{ t('mk.penalty') }} <span class="neg">{{ penaltyText(x) }}</span></div>
      <div class="row small"><span class="neg">{{ canDeliver(s, x.id) }}</span><button v-if="x.kind !== 'tech'" :disabled="!!canDeliver(s, x.id)" @click="deliverOrder(x.id)">{{ t('mk.deliver') }}</button></div>
    </div>
    <div v-for="x in ord.offers" :key="x.id" class="order offer">
      <div class="row"><span>{{ t('mk.offer', { n: orderTitle(x) }) }}</span><span class="small">{{ t('mk.expires', { d: daysTxt(Math.max(1, x.expires - s.m + 1)) }) }}</span></div>
      <div class="small">{{ x.who }} – {{ x.why }}. {{ t('mk.time', { d: daysTxt(x.days) }) }} {{ t('mk.reward') }} <span class="pos">{{ rewardText(x) }}</span> · {{ t('mk.penalty') }} <span class="neg">{{ penaltyText(x) }}</span></div>
      <div class="row small"><span class="neg">{{ canAccept(s, x.id) }}</span><button :disabled="!!canAccept(s, x.id)" @click="acceptOrder(x.id)">{{ t('mk.accept') }}</button></div>
    </div>
  </div>
  <div v-if="s.nb" class="card">
    <div class="t"><PixelIcon name="pop" />{{ t('mk.nb', { n: s.nb.n.toUpperCase() }) }}</div>
    <div class="small">{{ t('mk.nbInfo') }}</div>
    <div v-for="x in NB_TRADES" :key="x.k" class="row small" style="margin-top:4px">
      <span>{{ x.n }} ({{ x.d }})<span v-if="nbWait(s, x.k)" class="warn"> – {{ t('mk.in', { d: daysTxt(nbWait(s, x.k)) }) }}</span><span v-else-if="x.need(s)" class="neg"> – {{ x.need(s) }}</span></span>
      <button :disabled="!!nbWait(s, x.k) || !!x.need(s)" @click="neighborTrade(x.k)">{{ t('mk.trade') }}</button>
    </div>
  </div>
  <div class="row qty">
    <span>{{ t('mk.qty') }}</span>
    <span><button v-for="q in (s.tech.exchange ? [10, 50, 100, 500] : [10, 50, 100])" :key="q" :class="{ on: ui.qty === q }" @click="ui.qty = q">{{ q }} t</button></span>
  </div>
  <div v-if="s.b.port" class="small pos">{{ t('mk.port') }}</div>
  <div v-else class="small">{{ t('mk.noPort') }}</div>

  <div v-for="x in rows" :key="x.k" class="card">
    <div class="row"><span class="t"><PixelIcon :name="x.k" />{{ x.r.n }}</span><span>{{ t('mk.have', { a: fmt(s[x.k]), b: x.cap }) }}</span></div>
    <MeterBar :value="s[x.k]" :max="x.cap" :cls="s[x.k] >= x.cap ? 'warn' : ''" />
    <div class="row">
      <span class="small">{{ t('mk.prices', { s: x.p.sell.toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }), b: x.p.buy.toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }) }}</span>
      <span>
        <button :disabled="s[x.k] < ui.qty" @click="sell(x.k)">{{ t('mk.sell', { n: x.sv }) }}</button>
        <button :disabled="s.cr < x.bv || !x.room" :title="x.room ? null : t(x.k === 'food' ? 'mk.noRoomFood' : 'mk.noRoomMin')" @click="buy(x.k)">{{ t('mk.buy', { n: x.bv }) }}</button>
      </span>
    </div>
  </div>
</template>
