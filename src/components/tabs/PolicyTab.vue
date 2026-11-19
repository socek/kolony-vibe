<script setup>
import { computed } from 'vue'
import { game, c, setRation, saveNow, campaign } from '../../store.js'
import { CAMPAIGNS, running, canStart } from '../../game/campaigns.js'
import { daysTxt } from '../../game/format.js'
import MeterBar from '../MeterBar.vue'
import { RATIONS } from '../../game/constants.js'
import SignedNum from '../SignedNum.vue'

const s = computed(() => game.s)
const moods = computed(() => {
  const st = s.value, cc = c.value
  return [['Podatki', -(st.tax - 10) * 1.5], ['Racje', (st.ration - 1) * 40], ['Rekreacja', cc.recB], ['Przeludnienie', -cc.crowd], ['Bezrobocie', -cc.unempPen], ['Braki energii', -cc.black], ['Głód', -cc.starv], ['Dług', st.cr < 0 ? -10 : 0]]
    .filter(x => Math.round(x[1]))
})
</script>

<template>
  <div class="card">
    <div class="row"><span class="t">Podatki</span><span class="t">{{ s.tax }}%</span></div>
    <input v-model.number="s.tax" type="range" min="0" max="30" @change="saveNow">
    <div class="small">Przychód: {{ Math.round(c.taxInc) }} kr/dzień. Każdy punkt powyżej 10% obniża morale.</div>
  </div>
  <div class="card">
    <div class="t">Racje żywnościowe</div>
    <div class="btns">
      <button v-for="[v, nm] in RATIONS" :key="v" :style="s.ration === v ? 'background:var(--yellow)' : ''" @click="setRation(v)">{{ nm }}</button>
    </div>
    <div class="small" style="margin-top:6px">Zużycie: {{ Math.round(c.foodCons) }} t żywności/dzień. Obfite racje podnoszą morale, głodowe je obniżają. Podczas głodu racje głodowe wstrzymują umieranie, ale nie kończą głodu.</div>
  </div>
  <div class="card">
    <div class="t">Kampanie reklamowe</div>
    <div class="small">Kampania kosztuje kredyty i trwa określony czas. W tym czasie mogą przybyć nowi koloniści – ile i jak często, okaże się dopiero w praktyce. Przybysze zostają tylko, jeśli mają gdzie mieszkać.</div>
    <div v-for="x in CAMPAIGNS" :key="x.k" style="margin-top:8px">
      <div class="row">
        <span>{{ x.n }}</span>
        <span v-if="running(s, x.k)" class="warn">trwa · jeszcze {{ daysTxt(running(s, x.k).left) }}</span>
        <button v-else :disabled="!!canStart(s, x.k)" @click="campaign(x.k)">URUCHOM −{{ x.cr }} kr</button>
      </div>
      <div class="small">{{ x.d }} · {{ x.cr }} kr · {{ daysTxt(x.days) }}<template v-if="running(s, x.k)"> · przybyło dotąd: {{ running(s, x.k).got }}</template></div>
      <MeterBar v-if="running(s, x.k)" :value="x.days - running(s, x.k).left" :max="x.days" />
    </div>
  </div>
  <div class="card">
    <div class="t">Nastroje</div>
    <div class="small">
      <div v-for="[nm, v] in moods" :key="nm" class="row"><span>{{ nm }}</span><SignedNum :n="v" /></div>
      <div class="row"><span>Bazowo</span>+55</div>
    </div>
  </div>
</template>
