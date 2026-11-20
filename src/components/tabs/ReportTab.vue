<script setup>
import { computed } from 'vue'
import { game, c } from '../../store.js'
import { BLD, TECH, MORK, HUNGER_MAX } from '../../game/constants.js'
import { scenarioOf } from '../../game/scenarios.js'
import { avgCond, brokenCount } from '../../game/wear.js'
import { num, fmt, daysTxt } from '../../game/format.js'
import { techPct, techEta } from '../../game/calc.js'
import { repLines } from '../../game/report.js'
import { settings } from '../../game/stops.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'
import SignedNum from '../SignedNum.vue'

const s = computed(() => game.s)
const title = computed(() => {
  const d = s.value.repDays
  return !d ? 'RAPORT' : d === 1 ? 'RAPORT Z OSTATNIEGO DNIA' : 'RAPORT Z OSTATNICH ' + d + ' DNI'
})
const lines = computed(() => repLines(s.value, settings.short))
const eff = computed(() => c.value.e * c.value.f)
const nextMor = computed(() => Math.max(0, Math.min(100, s.value.mor + (c.value.mt - s.value.mor) * MORK)))
const prog = computed(() => scenarioOf(s.value).goal.progress(s.value))
const site = computed(() => s.value.q.length ? { name: BLD[s.value.q[0].k].n, st: c.value.sites[0] } : null)
const R = Math.round
const depDays = computed(() => c.value.minProd > 0 ? Math.floor(c.value.deps / c.value.minProd) : null)
</script>

<template>
  <div class="t" style="color:var(--white)">{{ title }}</div>
  <div class="log"><p v-for="(l, i) in lines" :key="i"><span :class="l.cls">{{ l.text }}</span></p></div>

  <div class="card">
    <div class="t">PROGNOZA NA NASTĘPNY DZIEŃ</div>
    <div class="row"><span><PixelIcon name="work" />Wydajność</span><span>{{ R(eff * 100) }}%</span></div>
    <MeterBar :value="eff" :max="1" :cls="eff < 1 ? 'warn' : ''" />
    <div style="height:6px"></div>
    <div v-if="site" class="row">
      <span><PixelIcon name="build" />Budowa</span>
      <span>{{ site.name }} {{ Math.floor(site.st.pct) }}%
        <span class="small">(<span v-if="site.st.eta === Infinity" class="neg">stoi</span><template v-else>jeszcze {{ daysTxt(site.st.eta) }}</template><template v-if="s.q.length > 1">; placów budowy: {{ s.q.length }}</template>)</span>
      </span>
    </div>
    <div v-if="c.hungerNext || s.hungerDays" class="row">
      <span class="neg"><PixelIcon name="food" />GŁÓD</span>
      <span v-if="c.hungerDeaths" class="neg">dzień {{ c.hungerNext }}/{{ HUNGER_MAX }} – zginie ok. {{ R(c.hungerDeaths) }} {{ R(c.hungerDeaths) === 1 ? 'osoba' : 'osób' }}</span>
      <span v-else-if="!c.hungerNext" class="pos">jutro się skończy</span>
      <span v-else class="warn">wstrzymany racjami głodowymi (dzień {{ c.hungerNext }}/{{ HUNGER_MAX }})</span>
    </div>
    <div class="row"><span><PixelIcon name="food" />Żywność</span><span><SignedNum :n="c.foodProd - c.foodCons" /> t <span class="small">({{ R(c.foodProd) }} prod. / {{ R(c.foodCons) }} zuż.)</span></span></div>
    <div v-if="c.season" class="row"><span><PixelIcon name="energy" />Pora roku: {{ c.season.n.toLowerCase() }}</span><span class="small">słońce ×{{ c.season.solar }}<template v-if="c.season.food !== 1"> · plony ×{{ c.season.food }}</template><template v-if="c.season.heat"> · ogrzewanie {{ R(s.pop * c.season.heat) }} kWh</template></span></div>
    <div class="row"><span><PixelIcon name="energy" />Energia</span><span><SignedNum :n="c.enProd - c.enNeed" /> kWh <span class="small">({{ R(c.enProd) }} prod. / {{ R(c.enNeed) }} zuż.)</span></span></div>
    <div class="row"><span><PixelIcon name="battery" />Magazyn energii</span><span>{{ R(c.enStore) }}/{{ c.enCap }} kWh<span v-if="!c.enCap" class="small warn"> (brak baterii)</span><span v-else-if="c.enStore >= c.enCap - 0.01" class="small"> (naładowane)</span></span></div>
    <div class="row">
      <span><PixelIcon name="min" />Minerały</span>
      <span><SignedNum :n="c.minProd" /> t <span class="small" :class="{ neg: !s.dep.length && s.b.mine, warn: depDays !== null && depDays < 30 }">({{ s.dep.length ? 'w złożach ' + fmt(c.deps) + ' t' + (depDays !== null ? ', na ' + daysTxt(depDays) : '') : 'brak złóż' }})</span></span>
    </div>
    <div v-if="s.exp.length" class="row"><span><PixelIcon name="exp" />Wyprawy</span><span>{{ s.exp.length }} w terenie <span class="small">(najbliższy powrót za {{ daysTxt(Math.min(...s.exp.map(x => x.left))) }})</span></span></div>
    <div class="row">
      <span><PixelIcon name="fridge" />Chłodnie</span>
      <span>{{ c.foodCap }} t<span v-if="c.foodWaste >= 1" class="small warn"> (strata {{ R(c.foodWaste) }} t żywności)</span></span>
    </div>
    <div class="row">
      <span><PixelIcon name="store" />Magazyny minerałów</span>
      <span>{{ c.minCap }} t<span v-if="c.minWaste >= 1" class="small warn"> (strata {{ R(c.minWaste) }} t minerałów)</span></span>
    </div>
    <div class="row"><span><PixelIcon name="cr" />Kredyty</span><span><SignedNum :n="c.taxInc + c.trade - c.maint" /> <span class="small">(podatki {{ R(c.taxInc) }}<template v-if="c.trade">, handel {{ R(c.trade) }}</template>, utrzymanie −{{ c.maint }})</span></span></div>
    <div class="row">
      <span><PixelIcon name="res" />Badania</span>
      <span v-if="s.rs"><span class="pos">+{{ num(c.resProd / TECH[s.rs].c * 100) }}%</span> <span class="small">({{ TECH[s.rs].n }}: {{ Math.floor(techPct(s, s.rs)) }}%, {{ techEta(s, s.rs, c) }})</span></span>
      <span v-else class="warn">brak projektu</span>
    </div>
    <div v-if="s.b.gun" class="row">
      <span><PixelIcon name="gun" />Obrona</span>
      <span :class="c.defRed > 0 ? '' : 'neg'">{{ c.defRed > 0 ? 'straty od piratów i meteorytów −' + R(c.defRed * 100) + '%' : 'działa nieobsadzone – nie działają' }} <span class="small">(sprawne działa: {{ num(c.def) }}/{{ s.b.gun }})</span></span>
    </div>
    <div class="row"><span><PixelIcon name="repair" />Stan budynków</span><span :class="brokenCount(s) ? 'neg' : avgCond(s) < 50 ? 'warn' : ''">średnio {{ Math.round(avgCond(s)) }}%<template v-if="brokenCount(s)"> · awarie: {{ brokenCount(s) }}</template> <span class="small">(naprawy {{ Math.round(c.repairPts) }} pkt/dzień)</span></span></div>
    <div class="row"><span><PixelIcon name="mor" />Morale</span><span><SignedNum :n="nextMor - s.mor" /> <span class="small">({{ R(s.mor) }}% → {{ R(nextMor) }}%; przy obecnych warunkach ustali się na {{ R(c.mt) }}%)</span></span></div>
  </div>

  <div class="card">
    <div class="row"><span><PixelIcon name="pop" />Cel: {{ scenarioOf(s).goal.text }}</span><span>{{ R(prog) }}%</span></div>
    <div class="small">{{ scenarioOf(s).goal.status(s) }}</div>
    <MeterBar :value="prog" :max="100" />
  </div>
</template>
