<script setup>
import { computed } from 'vue'
import { game, c, setPrio, specTarget, dismiss } from '../../store.js'
import { specDeficit, specPosts, trainPick, isAuto } from '../../game/specialists.js'
import { INFRA, JOBS, PRIO, SPEC, prioOf, jobName } from '../../game/constants.js'
import { scenarioOf } from '../../game/scenarios.js'
import { fmt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'
import { workParts, WORK_MIN, WORK_MAX } from '../../game/workforce.js'
const parts = computed(() => workParts(s.value))
const pct = v => Math.round(v * 100)
const sgn = x => x.k === 'base' ? pct(x.v) + '%' : (x.v > 0 ? '+' : '−') + Math.abs(Math.round(x.v * 1000) / 10) + ' pkt proc.'

const s = computed(() => game.s)
const def = computed(() => specDeficit(s.value, c.value))
const posts = computed(() => specPosts(s.value, c.value))
const pick = computed(() => trainPick(s.value, c.value))
// ile dni szkoły będą nadrabiać brak przy obecnym tempie
const catchUp = computed(() => c.value.train > 0 ? Math.ceil(def.value.total / c.value.train) : Infinity)
// ostrzeżenie: stoją laboratoria/szpitale albo szkoły nie nadążają z celem ustawionym ręcznie (ponad 30 dni nadrabiania).
// Brak inżynierów/żołnierzy w AUTO to tylko utracona premia – wtedy wystarczy spokojna informacja.
const warnSpec = computed(() => def.value.by.sci > 0 || (Object.keys(SPEC).some(T => !isAuto(s.value, T) && def.value.by[T] > 0) && (c.value.train <= 0 || catchUp.value > 30)))
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
    <div class="small">Specjalista na swoim stanowisku pracuje o 50% wydajniej. Laboratoria i szpitale obsadzają tylko naukowcy. Szkoły same kształcą specjalizację, której najbardziej brakuje do celu, a gdy wszystkie cele są osiągnięte – nie zabierają ludzi z pracy. AUTO: cel równy liczbie stanowisk w budynkach.</div>
    <div v-for="(x, T) in SPEC" :key="T" class="spec">
      <div class="row"><span>{{ x.n }}: {{ (s.spec || {})[T] || 0 }} / cel {{ def.tg[T] }} <span class="small" :class="isAuto(s, T) ? 'sub' : 'warn'">({{ isAuto(s, T) ? 'AUTO' : 'ręcznie' }}, stanowisk: {{ posts[T] }})</span></span>
        <span v-if="def.by[T] > 0" class="small" :class="T === 'sci' ? 'neg' : 'warn'">brakuje {{ def.by[T] }}</span></div>
      <div class="small">{{ x.jobs.map(j => jobName(j)).join(', ') }}</div>
      <div class="pr">
        <button title="Obniż cel" @click="specTarget(T, -1)">−</button>
        <button title="Podnieś cel" @click="specTarget(T, 1)">+</button>
        <button :class="{ on: isAuto(s, T) }" @click="specTarget(T, null)">AUTO</button>
        <button :disabled="!((s.spec || {})[T] > 0)" :title="'Zwolnij jednego specjalistę (' + x.one + ' wraca do zwykłej pracy)'" @click="dismiss(T)">ZWOLNIJ 1</button>
      </div>
    </div>
    <div class="small" style="margin-top:6px">Szkoły: {{ c.train > 0 ? '1 osoba co ' + Math.ceil(1 / c.train) + ' dni' : 'brak obsadzonej szkoły' }}<template v-if="pick && c.train > 0">, teraz kształcą: {{ SPEC[pick].n.toLowerCase() }}</template><template v-else-if="c.train > 0"> – cele osiągnięte, szkolenie wstrzymane</template>.</div>
    <div v-if="warnSpec" class="warn small">⚠ Brakuje specjalistów: {{ def.total }}<template v-if="def.by.sci > 0"> (w tym {{ def.by.sci }} naukowców – bez nich laboratoria i szpitale nie działają w pełni)</template>. {{ c.train > 0 ? 'Przy obecnym tempie szkoły nadrobią to za ok. ' + catchUp + ' dni – zbuduj kolejną szkołę albo podnieś jej priorytet.' : 'Zbuduj szkołę (albo obsadź istniejącą), żeby kształcić specjalistów.' }}</div>
    <div v-else-if="def.total > 0" class="small">Do celu brakuje {{ def.total }} specjalistów{{ c.train > 0 ? ' – szkoły nadrobią to za ok. ' + catchUp + ' dni.' : ' – szkoła pozwoli ich wykształcić.' }}</div>
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
