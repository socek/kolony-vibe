<script setup>
import { t, locale } from '../../i18n.js'
import { computed } from 'vue'
import { useDragList } from '../../dragList.js'
import { game, c, specTarget, dismiss, moveTo, shift, limit } from '../../store.js'
import { specDeficit, specPosts, trainPick, isAuto } from '../../game/specialists.js'
import { INFRA, SPEC, jobOrder, limOf, jobName } from '../../game/constants.js'
import { scenarioOf } from '../../game/scenarios.js'
import { fmt } from '../../game/format.js'
import PixelIcon from '../PixelIcon.vue'
import MeterBar from '../MeterBar.vue'
import { workParts, WORK_MIN, WORK_MAX } from '../../game/workforce.js'
const parts = computed(() => workParts(s.value))
const pct = v => Math.round(v * 100)
const sgn = x => x.k === 'base' ? pct(x.v) + '%' : t('wt.pp', { v: (x.v > 0 ? '+' : '−') + Math.abs(Math.round(x.v * 1000) / 10).toLocaleString(locale()) })

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
// zadania widoczne w tej kolonii, w kolejności gracza (wyżej = pierwsze dostaje ludzi)
const shown = computed(() => jobOrder(s.value).filter(k => k === 'build' || k === 'repair' || (k === 'hunt' ? scenarioOf(s.value).hunt : s.value.b[k])))
// przeciąganie: podczas niego lista pokazuje kolejność roboczą (view), zapisywaną po puszczeniu
const { drag, view, start: startDrag } = useDragList(() => shown.value, 'job', moveTo)
const jobs = computed(() => (view.value || shown.value).map(k => {
  const n = c.value.wNeed[k], E = c.value.E[k], lim = limOf(s.value, k)
  // suwak: od 0 (STOP) do pełnej obsady (bez limitu); przy zerowej potrzebie (np. brak budów) skala 0–1
  const max = Math.max(1, Math.ceil(n - 1e-9))
  return { k, n, E, w: n * E, isB: k === 'build', lim, on: lim > 0, max, val: Math.min(lim, max) }
}))
const setLimit = (j, v) => limit(j.k, v >= j.max ? null : v)
</script>

<template>
  <div class="card" style="border-top:0">
    <div class="row"><span><PixelIcon name="work" />{{ t('wt.able', { n: pct(c.workRate) }) }}</span><span>{{ fmt(c.workforce) }}</span></div>
    <div class="small" style="margin:2px 0 6px 12px">
      <div v-for="x in parts" :key="x.k" class="row"><span>{{ x.n }}</span><span :class="{ pos: x.k !== 'base' && x.v > 0, neg: x.v < 0 }">{{ sgn(x) }}</span></div>
      <div>{{ t('wt.range', { a: pct(WORK_MIN), b: pct(WORK_MAX) }) }}</div>
    </div>
    <div class="row"><span>{{ t('wt.employed') }}</span><span>{{ fmt(c.workforce - c.unemp) }}</span></div>
    <div class="row"><span>{{ t('wt.unemployed') }}</span><span :class="{ warn: c.unemp >= 1 }">{{ fmt(c.unemp) }}</span></div>
    <div class="row"><span>{{ t('wt.missing') }}</span><span :class="{ neg: c.e < 1 }">{{ fmt(missing) }}</span></div>
    <div class="small" style="margin-top:4px">{{ t('wt.info') }}</div>
  </div>

  <div class="card">
    <div class="t">{{ t('wt.spec') }}</div>
    <div class="small">{{ t('wt.specInfo') }}</div>
    <div v-for="(x, T) in SPEC" :key="T" class="spec">
      <div class="row"><span>{{ x.n }}: {{ (s.spec || {})[T] || 0 }} / {{ t('wt.target', { n: def.tg[T] }) }} <span class="small" :class="isAuto(s, T) ? 'sub' : 'warn'">({{ isAuto(s, T) ? 'AUTO' : t('wt.manual') }}, {{ t('wt.posts', { n: posts[T] }) }})</span></span>
        <span v-if="def.by[T] > 0" class="small" :class="T === 'sci' ? 'neg' : 'warn'">{{ t('wt.lack', { n: def.by[T] }) }}</span></div>
      <div class="small">{{ x.jobs.map(j => jobName(j)).join(', ') }}</div>
      <div class="pr">
        <button :title="t('wt.lower')" @click="specTarget(T, -1)">−</button>
        <button :title="t('wt.raise')" @click="specTarget(T, 1)">+</button>
        <button :class="{ on: isAuto(s, T) }" @click="specTarget(T, null)">AUTO</button>
        <button :disabled="!((s.spec || {})[T] > 0)" :title="t('wt.dismissTitle', { one: x.one })" @click="dismiss(T)">{{ t('wt.dismiss') }}</button>
      </div>
    </div>
    <div class="small" style="margin-top:6px">{{ t('wt.schools', { rate: c.train > 0 ? Math.ceil(1 / c.train) : null, now: pick && c.train > 0 ? SPEC[pick].n.toLowerCase() : null, done: !pick && c.train > 0 }) }}</div>
    <div v-if="warnSpec" class="warn small">{{ t('wt.warn', { n: def.total, sci: def.by.sci, days: c.train > 0 ? catchUp : null }) }}</div>
    <div v-else-if="def.total > 0" class="small">{{ t('wt.toTarget', { n: def.total, days: c.train > 0 ? catchUp : null }) }}</div>
  </div>

  <div class="card">
    <div class="row"><span class="t"><PixelIcon name="house" />{{ t('wt.infra') }}</span><span>{{ fmt(infra * c.E.house) }}/{{ fmt(infra) }}</span></div>
    <div class="small">{{ t('wt.infraInfo') }}</div>
    <MeterBar :value="c.E.house" :max="1" :cls="c.E.house < 1 ? 'neg' : ''" />
  </div>

  <div class="small" style="margin:6px 0 2px">{{ t('wt.orderInfo') }}</div>
  <div v-for="(j, i) in jobs" :key="j.k" class="card job" :class="{ dragging: drag === j.k }" :data-job="j.k">
    <div class="row">
      <span class="t"><span class="drag" :title="t('wt.drag')" :aria-label="t('wt.drag')" @pointerdown="startDrag($event, j.k)">≡</span>{{ i + 1 }}. <PixelIcon :name="j.k" />{{ jobName(j.k) }}
        <span v-if="j.isB" class="small">({{ t('rp.sites', { n: s.q.length }) }})</span><span v-else-if="j.k === 'repair'" class="small">({{ t('wt.repairs', { n: Math.round(c.repairPts) }) }})</span><span v-else-if="j.k === 'hunt'" class="small">({{ t('wt.hunt', { n: Math.round(c.huntFood) }) }})</span><template v-else> ×{{ s.b[j.k] }}</template>
      </span>
      <span v-if="j.on">{{ t('wt.staff', { a: fmt(j.w), b: fmt(j.n) }) }}<template v-if="j.n"> ({{ Math.round(j.E * 100) }}%)</template></span>
      <span v-else class="neg">{{ t(j.isB ? 'wt.paused' : 'wt.stopped') }}</span>
    </div>
    <MeterBar :value="j.n ? j.E : 0" :max="1" :cls="!j.on ? 'neg' : j.E < 1 ? 'warn' : ''" />
    <div class="pr lim">
      <button :disabled="i === 0" :title="t('wt.up')" :aria-label="t('wt.up')" @click="shift(j.k, -1, shown)">▲</button>
      <button :disabled="i === jobs.length - 1" :title="t('wt.down')" :aria-label="t('wt.down')" @click="shift(j.k, 1, shown)">▼</button>
      <input type="range" min="0" :max="j.max" step="1" :value="j.val" :aria-label="t('wt.limitOf', { n: jobName(j.k) })" @input="setLimit(j, +$event.target.value)">
      <span class="small" :class="{ neg: !j.on, warn: j.on && j.lim < j.n }">{{ !j.on ? t('wt.stop') : j.lim >= j.n ? t('wt.noLimit') : t('wt.limit', { n: j.lim }) }}</span>
    </div>
  </div>
</template>
