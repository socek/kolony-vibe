<script setup>
import { computed } from 'vue'
import { game, c, ui, sendExp } from '../../store.js'
import { RANGES, TEAMS, GOALS, OTHER_CHANCE, MAX_SPEC_IN_TEAM, rangeOf, teamOf, expChance, expCost, expDays, expRisk, canSend, depTotal, MIN_POP_LEFT } from '../../game/expeditions.js'
import { TECH } from '../../game/constants.js'
import { fmt, daysTxt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const total = computed(() => depTotal(s.value))
const lasts = computed(() => c.value.minProd > 0 ? Math.floor(total.value / c.value.minProd) : null)
const away = computed(() => s.value.exp.reduce((a, x) => a + x.team, 0))
const plan = computed(() => {
  const r = rangeOf(ui.expRange), t = teamOf(ui.expTeam)
  const st = s.value
  const chance = ui.expGoal === 'dep' ? expChance(r, t, st) : Math.min(0.95, r.chance + t.bonus)
  return { r, t, days: expDays(r, st), risk: expRisk(r, st) * Math.max(0, 1 - 0.3 * ui.expSol), chance: Math.round(chance * 100), cost: expCost(r, t, st), why: canSend(st, ui.expRange, ui.expTeam, ui.expSol, ui.expEng), lock: r.req && !st.tech[r.req] }
})
</script>

<template>
  <div class="small">Kopalnie wydobywają minerały ze złóż, które z czasem się wyczerpują. Nowe złoża znajdują wyprawy poszukiwawcze. Uczestnicy na czas wyprawy opuszczają kolonię – nie pracują i nie jedzą z zapasów, bo prowiant dostają z góry.</div>

  <div class="card">
    <div class="row"><span class="t"><PixelIcon name="min" />ZŁOŻA</span><span>razem {{ fmt(total) }} t</span></div>
    <div v-if="!s.dep.length" class="neg">Brak złóż – kopalnie stoją. Wyślij wyprawę.</div>
    <div v-for="(d, i) in s.dep" :key="i" style="margin-top:4px">
      <div class="row small"><span>{{ d.n }}<span v-if="i === 0 && c.minProd > 0" class="pos"> · wydobycie</span></span><span>{{ fmt(d.t) }}/{{ fmt(d.max) }} t</span></div>
      <MeterBar :value="d.t" :max="d.max" :cls="d.t < d.max * 0.2 ? 'warn' : ''" />
    </div>
    <div class="small" style="margin-top:6px">
      Wydobycie: {{ Math.round(c.minProd) }} t/dzień<template v-if="lasts !== null"> · złóż wystarczy na ok. {{ daysTxt(lasts) }}</template>
    </div>
  </div>

  <div class="card">
    <div class="t"><PixelIcon name="exp" />NOWA WYPRAWA</div>
    <div class="small" style="margin-top:4px">Cel:</div>
    <div class="pr">
      <button v-for="r in RANGES" :key="r.k" :class="{ on: ui.expRange === r.k, lockedbtn: r.req && !s.tech[r.req] }" :title="r.req && !s.tech[r.req] ? 'Wymaga technologii: ' + TECH[r.req].n : null" @click="ui.expRange = r.k">{{ r.n.toUpperCase() }}</button>
    </div>
    <div class="small" style="margin-top:6px">Czego szukać:</div>
    <div class="pr">
      <button v-for="g in GOALS" :key="g.k" :class="{ on: ui.expGoal === g.k }" :title="g.d" @click="ui.expGoal = g.k">{{ g.n }}</button>
    </div>
    <div class="small" style="margin-top:6px">Liczebność ekipy:</div>
    <div class="pr">
      <button v-for="t in TEAMS" :key="t.n" :class="{ on: ui.expTeam === t.n }" @click="ui.expTeam = t.n">{{ t.n }} OSÓB</button>
    </div>
    <div class="small" style="margin-top:6px">Specjaliści w ekipie (wliczani w liczebność): żołnierze zmniejszają ryzyko strat, inżynierowie zwiększają zysk z wraków i złóż.</div>
    <div class="row small">
      <span>Żołnierze: {{ ui.expSol }} <button :disabled="ui.expSol <= 0" @click="ui.expSol--">−</button> <button :disabled="ui.expSol >= MAX_SPEC_IN_TEAM || ui.expSol >= ((s.spec || {}).sol || 0) || ui.expSol + ui.expEng >= ui.expTeam" @click="ui.expSol++">+</button></span>
      <span>Inżynierowie: {{ ui.expEng }} <button :disabled="ui.expEng <= 0" @click="ui.expEng--">−</button> <button :disabled="ui.expEng >= MAX_SPEC_IN_TEAM || ui.expEng >= ((s.spec || {}).eng || 0) || ui.expSol + ui.expEng >= ui.expTeam" @click="ui.expEng++">+</button></span>
    </div>
    <div class="small" style="margin-top:6px">
      <span v-if="plan.lock" class="neg">Ten cel wymaga technologii: {{ TECH[plan.r.req].n }} (zakładka TECHNOLOGIE)<br></span>
      Czas: {{ daysTxt(plan.days) }} · szansa na cel ({{ GOALS.find(g => g.k === ui.expGoal).d }}): {{ plan.chance }}%, na inne znalezisko: {{ OTHER_CHANCE * 100 }}% · wielkość: {{ Math.round(plan.r.size[0] * plan.t.mult) }}–{{ Math.round(plan.r.size[1] * plan.t.mult) }} t<br>
      Koszt: {{ plan.cost.cr }} kr na sprzęt, {{ plan.cost.food }} t żywności na prowiant ·
      <span :class="plan.risk ? 'warn' : 'pos'">ryzyko strat: {{ Math.round(plan.risk * 100) }}%</span>
    </div>
    <div class="row" style="margin-top:6px">
      <span class="small" :class="{ neg: plan.why }">{{ plan.why || 'W kolonii musi zostać co najmniej ' + MIN_POP_LEFT + ' osób.' }}</span>
      <button :disabled="!!plan.why" @click="sendExp">WYŚLIJ WYPRAWĘ</button>
    </div>
  </div>

  <div v-if="s.exp.length" class="card">
    <div class="row"><span class="t"><PixelIcon name="exp" />W TERENIE</span><span>{{ away }} {{ away === 1 ? 'osoba' : 'osób' }} poza kolonią</span></div>
    <div v-for="(x, i) in s.exp" :key="i" style="margin-top:4px">
      <div class="row small"><span>{{ rangeOf(x.r).n }} · cel: {{ GOALS.find(g => g.k === (x.goal || 'dep')).n.toLowerCase() }} · {{ x.team }} osób<template v-if="x.sol || x.eng"> (żołn. {{ x.sol || 0 }}, inż. {{ x.eng || 0 }})</template></span><span>wraca za {{ daysTxt(x.left) }}</span></div>
      <MeterBar :value="(x.days || rangeOf(x.r).days) - x.left" :max="x.days || rangeOf(x.r).days" />
    </div>
  </div>
</template>
