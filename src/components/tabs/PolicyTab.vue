<script setup>
import { computed } from 'vue'
import { game, c, setRation, saveNow } from '../../store.js'
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
    <div class="small" style="margin-top:6px">Zużycie: {{ Math.round(c.foodCons) }} t żywności/dzień. Obfite racje podnoszą morale, głodowe je obniżają.</div>
  </div>
  <div class="card">
    <div class="t">Nastroje</div>
    <div class="small">
      <div v-for="[nm, v] in moods" :key="nm" class="row"><span>{{ nm }}</span><SignedNum :n="v" /></div>
      <div class="row"><span>Bazowo</span>+55</div>
    </div>
  </div>
</template>
