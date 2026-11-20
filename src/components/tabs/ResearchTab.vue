<script setup>
import { t } from '../../i18n.js'
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { game, c, research, unresearch, researchFirst } from '../../store.js'
import { TECH, TECH_BRANCHES } from '../../game/constants.js'
import { num } from '../../game/format.js'
import { techPct, techEta } from '../../game/calc.js'
import { techState, canQueue, techDepth } from '../../game/research.js'
import { techAvail } from '../../game/scenarios.js'
const techKeys = () => Object.keys(TECH).filter(k => techAvail(game.s, k))
import MeterBar from '../MeterBar.vue'

const s = computed(() => game.s)
const sel = ref(null)
const STATE_TXT = new Proxy({}, { get: (_, k) => t('rt.st.' + String(k)) })

// na wąskim ekranie lista zamiast schematu
const narrow = ref(false)
let mq
const onMq = () => { narrow.value = mq.matches }
onMounted(() => { mq = window.matchMedia('(max-width: 619px)'); onMq(); mq.addEventListener('change', onMq) })
onUnmounted(() => mq && mq.removeEventListener('change', onMq))

const info = k => {
  const st = s.value, state = techState(st, k)
  const qi = (st.rq || []).indexOf(k)
  return { k, t: TECH[k], state, pct: techPct(st, k), qpos: qi >= 0 ? qi + 1 : null }
}

// Układ schematu: kolumny = gałęzie, wiersze = poziom w drzewie (technologie z tym samym poziomem
// w jednej gałęzi dostają kolejne wiersze)
const layout = computed(() => {
  const ks = techKeys(), depths = Object.fromEntries(ks.map(k => [k, techDepth(k)]))
  const maxD = Math.max(...Object.values(depths))
  const rowsAt = d => Math.max(...TECH_BRANCHES.map(b => ks.filter(k => TECH[k].g === b.k && depths[k] === d).length), 1)
  const start = []
  let r = 1
  for (let d = 0; d <= maxD; d++) { start[d] = r; r += rowsAt(d) }
  const pos = {}
  TECH_BRANCHES.forEach((b, ci) => {
    const used = {}
    ks.filter(k => TECH[k].g === b.k).sort((a, z) => depths[a] - depths[z]).forEach(k => {
      const d = depths[k]
      pos[k] = { col: ci + 1, row: start[d] + (used[d] = (used[d] ?? -1) + 1) }
    })
  })
  return pos
})

const queueList = computed(() => (s.value.rq || []).map(k => TECH[k].n))
const selInfo = computed(() => sel.value && info(sel.value))
// zamykanie okienka z opisem klawiszem Esc
// (w fazie przechwytywania i z preventDefault, żeby globalny skrót Esc nie otwierał przy tym menu)
const onKey = e => { if (e.key === 'Escape' && sel.value) { sel.value = null; e.preventDefault() } }
onMounted(() => window.addEventListener('keydown', onKey, true))
onUnmounted(() => window.removeEventListener('keydown', onKey, true))
// po akcji (kolejka, badaj teraz, usuń) okienko się zamyka
const act = (f, k) => { f(k); sel.value = null }

// strzałki wymagań rysowane na podstawie położenia bloków
const grid = ref(null)
const arrows = ref([])
const size = ref({ w: 0, h: 0 })
function drawArrows() {
  const g = grid.value
  if (!g) return
  // pozycje względem schematu z offset* (a nie getBoundingClientRect) – nie zależą od powiększenia strony (CSS zoom)
  const box = { left: 0, top: 0, width: g.offsetWidth, height: g.offsetHeight }
  size.value = { w: box.width, h: box.height }
  const rect = k => {
    const el = g.querySelector('[data-tech="' + k + '"]')
    return el && { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, bottom: el.offsetTop + el.offsetHeight }
  }
  const pos = layout.value
  // czy w kolumnie col między wierszami a i b (wyłącznie) stoi jakiś blok
  const blocked = (col, a, b) => Object.values(pos).some(p => p.col === col && p.row > a && p.row < b)
  // różne źródła wchodzące do tego samego wiersza dostają różne wysokości poziomych linii
  const lanes = {}
  const lane = (row, src) => { const l = lanes[row] || (lanes[row] = []); if (!l.includes(src)) l.push(src); return l.indexOf(src) }
  const out = []
  for (const k of techKeys()) {
    const to = rect(k), pt = pos[k]
    for (const r of TECH[k].req) {
      const from = rect(r), pf = pos[r]
      if (!from || !to) continue
      const x1 = from.left + from.width / 2 - box.left, y1 = from.bottom - box.top
      const x2 = to.left + to.width / 2 - box.left, y2 = to.top - box.top
      let d
      if (pf.col === pt.col && !blocked(pf.col, pf.row, pt.row)) d = `M${x1},${y1} V${y2 - 1}`
      else {
        const ym = y2 - 6 - lane(pt.row, r) * 4
        if (blocked(pf.col, pf.row, pt.row)) {
          // pionowo szczeliną po lewej stronie kolumny źródła, żeby nie przechodzić przez inne bloki
          const cx = Math.max(3, from.left - box.left - 5)
          d = `M${x1},${y1} V${y1 + 5} H${cx} V${ym} H${x2} V${y2 - 1}`
        } else d = `M${x1},${y1} V${ym} H${x2} V${y2 - 1}`
      }
      out.push({ k: r + '-' + k, d, from: r, to: k })
    }
  }
  arrows.value = out
}
const arrowCls = a => sel.value && (a.from === sel.value || a.to === sel.value) ? 'hi' : s.value.tech[a.from] ? 'done' : ''
let ro
onMounted(() => { ro = new ResizeObserver(drawArrows); watch(grid, g => { if (g) { ro.observe(g); nextTick(drawArrows) } }, { immediate: true }); watch(sel, () => nextTick(drawArrows)) })
onUnmounted(() => ro && ro.disconnect())
</script>

<template>
  <div class="small">
    {{ t('rt.info', { n: num(c.resProd) }) }}
    <span v-if="!s.b.lab" class="warn">{{ t('rt.noLab') }}</span>
  </div>
  <div class="card">
    <div class="row">
      <span>{{ t('rt.active') }} <span :class="s.rs ? 'warn' : 'neg'">{{ s.rs ? TECH[s.rs].n + ' · ' + Math.floor(techPct(s, s.rs)) + '% · ' + techEta(s, s.rs, c) : t('rt.nothing') }}</span></span>
    </div>
    <div class="small">{{ t('rt.queue') }} {{ queueList.length ? queueList.join(' → ') : t('rt.empty') }}</div>
  </div>

  <!-- szczegóły wybranej technologii – okienko na wierzchu drzewa (kliknięcie obok albo Esc zamyka) -->
  <div v-if="selInfo" class="tpop" @click.self="sel = null">
  <div class="card tdetail" role="dialog" :aria-label="selInfo.t.n">
    <div class="row"><span class="t">{{ selInfo.t.n }}</span><span :class="'st-' + selInfo.state">{{ STATE_TXT[selInfo.state] }}</span></div>
    <div class="small">{{ selInfo.t.d }}</div>
    <div class="small">{{ t('rt.cost', { n: selInfo.t.c }) }}<template v-if="selInfo.pct > 0 && selInfo.state !== 'done'"> · {{ t('rt.progress', { n: Math.floor(selInfo.pct) }) }}</template></div>
    <div v-if="selInfo.t.req.length" class="small">{{ t('rt.requires') }}
      <template v-for="(r, i) in selInfo.t.req" :key="r"><span :class="s.tech[r] ? 'pos' : 'neg'">{{ TECH[r].n }}</span>{{ i < selInfo.t.req.length - 1 ? ', ' : '' }}</template>
    </div>
    <div class="btns">
      <button v-if="canQueue(s, selInfo.k)" @click="act(research, selInfo.k)">{{ t('rt.add') }}</button>
      <button v-if="selInfo.state === 'ready' || selInfo.state === 'queued'" :disabled="selInfo.state === 'queued' && !TECH[selInfo.k].req.every(r => s.tech[r])" @click="act(researchFirst, selInfo.k)">{{ t('rt.now') }}</button>
      <button v-if="selInfo.state === 'queued' || selInfo.state === 'active'" @click="act(unresearch, selInfo.k)">{{ t('rt.remove') }}</button>
      <button @click="sel = null">{{ t('common.close') }}</button>
    </div>
  </div>
  </div>

  <!-- schemat blokowy -->
  <div v-if="!narrow" class="ttree-wrap">
    <div class="ttree-head">
      <div v-for="b in TECH_BRANCHES" :key="b.k" class="tbranch" :style="{ '--g': b.color }">{{ b.n }}</div>
    </div>
    <div ref="grid" class="ttree">
      <svg class="tarrows" :width="size.w" :height="size.h" aria-hidden="true">
        <defs>
          <marker v-for="[m, col] in [['base', 'var(--text)'], ['done', 'var(--green)'], ['hi', 'var(--white)']]" :id="'tarr-' + m" :key="m" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L6,3 L0,6 z" :fill="col" /></marker>
        </defs>
        <path v-for="a in arrows" :key="a.k" :d="a.d" class="tarrow" :class="arrowCls(a)" fill="none" :marker-end="'url(#tarr-' + (arrowCls(a) || 'base') + ')'" />
      </svg>
      <button v-for="(p, k) in layout" :key="k" :data-tech="k" class="tblock" :class="[info(k).state, { sel: sel === k }]"
        :style="{ gridColumn: p.col, gridRow: p.row }" @click="sel = sel === k ? null : k">
        <span class="tname">{{ TECH[k].n }}</span>
        <span class="tmeta">{{ t('rt.pts', { n: TECH[k].c }) }} · {{ info(k).qpos ? t('rt.qpos', { n: info(k).qpos }) : STATE_TXT[info(k).state] }}</span>
        <MeterBar v-if="info(k).state !== 'done' && info(k).pct > 0" :value="info(k).pct" :max="100" />
      </button>
    </div>
  </div>

  <!-- lista na telefonie -->
  <template v-else>
    <template v-for="b in TECH_BRANCHES" :key="b.k">
      <div class="grph" :style="{ '--g': b.color }">{{ b.n }}</div>
      <button v-for="k in techKeys().filter(x => TECH[x].g === b.k)" :key="k" :data-tech="k" class="tblock tlist" :class="[info(k).state, { sel: sel === k }]" @click="sel = sel === k ? null : k">
        <span class="tname">{{ TECH[k].n }}</span>
        <span class="tmeta">{{ t('rt.pts', { n: TECH[k].c }) }} · {{ info(k).qpos ? t('rt.qpos', { n: info(k).qpos }) : STATE_TXT[info(k).state] }}<template v-if="TECH[k].req.length"> · {{ t('rt.req') }} {{ TECH[k].req.map(r => TECH[r].n).join(', ') }}</template></span>
        <MeterBar v-if="info(k).state !== 'done' && info(k).pct > 0" :value="info(k).pct" :max="100" />
      </button>
    </template>
  </template>

</template>
