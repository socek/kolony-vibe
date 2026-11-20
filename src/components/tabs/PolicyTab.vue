<script setup>
import { t } from '../../i18n.js'
import { computed } from 'vue'
import { game, c, setRation, saveNow, campaign } from '../../store.js'
import { CAMPAIGNS, running, canStart, campCost } from '../../game/campaigns.js'
import { TECH } from '../../game/constants.js'
import { daysTxt } from '../../game/format.js'
import MeterBar from '../MeterBar.vue'
import { RATIONS } from '../../game/constants.js'
import SignedNum from '../SignedNum.vue'
import { LAWS, MAX_LAWS, LAW_FEE, isLaw, lawBlock, lawFx } from '../../game/laws.js'
import { law } from '../../store.js'
// opis efektów ustawy, np. „+5 pkt proc. zdolnych do pracy, −6 morale”
const fxText = fx => Object.entries(fx).map(([k, v]) => t('law.fx.' + k, { v: (v > 0 ? '+' : '−') + Math.abs(Math.round(['work', 'eff', 'food', 'growth', 'tax', 'res', 'def', 'orders'].includes(k) ? v * 100 : v)) })).join(', ')

const s = computed(() => game.s)
const moods = computed(() => {
  const st = s.value, cc = c.value
  return [[t('po.m.tax'), -(st.tax - 10) * 1.5], [t('po.m.ration'), (st.ration - 1) * 40], [t('po.m.rec'), cc.recB], [t('po.m.crowd'), -cc.crowd], [t('po.m.unemp'), -cc.unempPen], [t('po.m.black'), -cc.black], [t('po.m.starv'), -cc.starv], [t('po.m.debt'), st.cr < 0 ? -10 : 0], [t('po.m.laws'), lawFx(st, 'mor')]]
    .filter(x => Math.round(x[1]))
})
</script>

<template>
  <div class="card">
    <div class="row"><span class="t">{{ t('po.tax') }}</span><span class="t">{{ s.tax }}%</span></div>
    <input v-model.number="s.tax" type="range" min="0" max="30" @change="saveNow">
    <div class="small">{{ t('po.taxInfo', { n: Math.round(c.taxInc) }) }}</div>
  </div>
  <div class="card">
    <div class="t">{{ t('po.rations') }}</div>
    <div class="btns">
      <button v-for="[v, nm] in RATIONS" :key="v" :style="s.ration === v ? 'background:var(--yellow)' : ''" @click="setRation(v)">{{ nm }}</button>
    </div>
    <div class="small" style="margin-top:6px">{{ t('po.rationsInfo', { n: Math.round(c.foodCons) }) }}</div>
  </div>
  <div class="card">
    <div class="t">{{ t('po.camps') }}</div>
    <div class="small">{{ t('po.campsInfo') }}</div>
    <div v-for="x in CAMPAIGNS" :key="x.k" style="margin-top:8px">
      <div class="row">
        <span>{{ x.n }}</span>
        <span v-if="running(s, x.k)" class="warn">{{ t('po.running', { d: daysTxt(running(s, x.k).left) }) }}</span>
        <button v-else :disabled="!!canStart(s, x.k)" @click="campaign(x.k)">{{ t('po.launch', { n: campCost(s, x.k) }) }}</button>
      </div>
      <div v-if="x.req && !s.tech[x.req]" class="small neg">{{ t('ex.needTech', { n: TECH[x.req].n }) }}</div>
      <div class="small">{{ x.d }} · {{ t('ord.r.cr', { n: campCost(s, x.k) }) }} · {{ daysTxt(x.days) }}<template v-if="running(s, x.k)"> · {{ t('po.got', { n: running(s, x.k).got }) }}</template></div>
      <MeterBar v-if="running(s, x.k)" :value="x.days - running(s, x.k).left" :max="x.days" />
    </div>
  </div>
  <div class="card">
    <div class="row"><span class="t">{{ t('law.title') }}</span><span class="small">{{ t('law.count', { n: (s.laws || []).length, max: MAX_LAWS }) }}</span></div>
    <div class="small">{{ t('law.info', { fee: LAW_FEE, max: MAX_LAWS }) }}</div>
    <div v-for="(x, k) in LAWS" :key="k" class="law" :class="{ on: isLaw(s, k) }">
      <div class="row">
        <span>{{ isLaw(s, k) ? '■' : '□' }} {{ x.n }}</span>
        <button :disabled="!!lawBlock(s, k, t)" :title="lawBlock(s, k, t) || null" @click="law(k)">{{ isLaw(s, k) ? t('law.repeal') : t('law.enact', { n: LAW_FEE }) }}</button>
      </div>
      <div class="small">{{ x.d }} <span class="warn">{{ fxText(x.fx) }}</span></div>
    </div>
  </div>
  <div class="card">
    <div class="t">{{ t('po.moods') }}</div>
    <div class="small">
      <div v-for="[nm, v] in moods" :key="nm" class="row"><span>{{ nm }}</span><SignedNum :n="v" /></div>
      <div class="row"><span>{{ t('po.base') }}</span>+55</div>
    </div>
  </div>
</template>
