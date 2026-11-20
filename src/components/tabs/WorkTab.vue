<script setup>
import { computed } from 'vue'
import { game, c, setPrio } from '../../store.js'
import { INFRA, JOBS, PRIO, SPEC, prioOf, jobName } from '../../game/constants.js'
import { saveNow } from '../../store.js'
import { scenarioOf } from '../../game/scenarios.js'
const setTrain = T => { game.s.train = T; saveNow() }
import { fmt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'
import { workParts, WORK_MIN, WORK_MAX } from '../../game/workforce.js'
const parts = computed(() => workParts(s.value))
const pct = v => Math.round(v * 100)
const sgn = x => x.k === 'base' ? pct(x.v) + '%' : (x.v > 0 ? '+' : '−') + Math.abs(Math.round(x.v * 1000) / 10) + ' pkt proc.'

const s = computed(() => game.s)
const infra = computed(() => INFRA.reduce((a, k) => a + c.value.wNeed[k], 0))
const missing = computed(() => Math.max(0, Math.ceil(c.value.needed - c.value.workforce)))
const jobs = computed(() => JOBS.filter(k => k === 'build' || k === 'repair' || (k === 'hunt' ? scenarioOf(s.value).hunt : s.value.b[k])).map(k => {
  const n = c.value.wNeed[k], E = c.value.E[k], p = prioOf(s.value, k)
  return { k, p, n, E, w: n * E, isB: k === 'build' }
}))
</script>

<template>
  <div class="card" style="border-top:0">
    <div class="row"><span><PixelIcon name="work" />Zdolni do pracy ({{ pct(c.workRate) }}% kolonistów)</span><span>{{ fmt(c.workforce) }}</span></div>
    <div class="small" style="margin:2px 0 6px 12px">
      <div v-for="x in parts" :key="x.k" class="row"><span>{{ x.n }}</span><span :class="{ pos: x.k !== 'base' && x.v > 0, neg: x.v < 0 }">{{ sgn(x) }}</span></div>
      <div>Odsetek mieści się zawsze między {{ pct(WORK_MIN) }}% a {{ pct(WORK_MAX) }}%. Wysokie morale, szpitale i technologia Zautomatyzowane żłobki go podnoszą, a niskie morale i epidemie obniżają.</div>
    </div>
    <div class="row"><span>Zatrudnieni</span><span>{{ fmt(c.workforce - c.unemp) }}</span></div>
    <div class="row"><span>Bezrobotni</span><span :class="{ warn: c.unemp >= 1 }">{{ fmt(c.unemp) }}</span></div>
    <div class="row"><span>Brakuje rąk do pracy</span><span :class="{ neg: c.e < 1 }">{{ fmt(missing) }}</span></div>
    <div class="small" style="margin-top:4px">Pracownicy trafiają najpierw do zadań o wysokim priorytecie. Przy równym priorytecie dzielą się po równo. STOP wyłącza budynek lub wstrzymuje budowy: nic nie produkują i nie zużywają energii, a ich ludzie zostają bez pracy.</div>
  </div>

  <div class="card">
    <div class="t">SPECJALIŚCI</div>
    <div class="small">Specjalista na swoim stanowisku pracuje o 50% wydajniej. Laboratoria i szpitale obsadzają tylko naukowcy. Szkoły kształcą wybraną specjalizację.</div>
    <div v-for="(x, T) in SPEC" :key="T" class="row small"><span>{{ x.n }}: {{ (s.spec || {})[T] || 0 }}</span><span>{{ x.jobs.map(j => jobName(j)).join(', ') }}</span></div>
    <div class="small" style="margin-top:4px">Szkoły kształcą ({{ c.train > 0 ? '1 osoba co ' + Math.ceil(1 / c.train) + ' dni' : 'brak obsadzonej szkoły' }}):</div>
    <div class="pr"><button v-for="(x, T) in SPEC" :key="T" :class="{ on: (s.train || 'sci') === T }" @click="setTrain(T)">{{ x.n.toUpperCase() }}</button></div>
  </div>

  <div class="card">
    <div class="row"><span class="t"><PixelIcon name="house" />Infrastruktura</span><span>{{ fmt(infra * c.E.house) }}/{{ fmt(infra) }}</span></div>
    <div class="small">Mieszkania, chłodnie, magazyny, baterie i osłony są zawsze obsadzane jako pierwsze.</div>
    <MeterBar :value="c.E.house" :max="1" :cls="c.E.house < 1 ? 'neg' : ''" />
  </div>

  <div v-for="j in jobs" :key="j.k" class="card">
    <div class="row">
      <span class="t"><PixelIcon :name="j.k" />{{ jobName(j.k) }}
        <span v-if="j.isB" class="small">(placów budowy: {{ s.q.length }})</span><span v-else-if="j.k === 'repair'" class="small">(naprawy: {{ Math.round(c.repairPts) }} pkt/dzień)</span><span v-else-if="j.k === 'hunt'" class="small">(+{{ Math.round(c.huntFood) }} t żywności, ale fauna jest agresywniejsza)</span><template v-else> ×{{ s.b[j.k] }}</template>
      </span>
      <span v-if="j.p">{{ fmt(j.w) }}/{{ fmt(j.n) }} prac.<template v-if="j.n"> ({{ Math.round(j.E * 100) }}%)</template></span>
      <span v-else class="neg">{{ j.isB ? 'WSTRZYMANE' : 'ZATRZYMANY' }}</span>
    </div>
    <MeterBar :value="j.n ? j.E : 0" :max="1" :cls="j.p === 0 ? 'neg' : j.E < 1 ? 'warn' : ''" />
    <div class="pr">
      <button v-for="[l, nm] in PRIO" :key="l" :class="{ on: j.p === l }" @click="setPrio(j.k, l)">{{ nm }}</button>
    </div>
  </div>
</template>
