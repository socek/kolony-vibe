<script setup>
import { ref } from 'vue'
import { t, locale } from '../../i18n.js'
import { game, ui, goBack, saveGameSlot, loadGameSlot, deleteGameSlot, importGame } from '../../store.js'
import { listSlots, exportCode, downloadSave } from '../../game/saves.js'
import { SCENARIOS } from '../../game/scenarios.js'

// Zapisy: 3 ręczne sloty, eksport (kod / plik) i import. Zapisywać można tylko z menu w trakcie gry.
const canSave = ui.from === 'menu'
const slots = ref(listSlots())
const refresh = () => { slots.value = listSlots() }
const confirmOver = ref(null)
const scenName = k => (SCENARIOS.find(x => x.k === k) || SCENARIOS[0]).n
const when = iso => new Date(iso).toLocaleString(locale(), { dateStyle: 'short', timeStyle: 'short' })
const code = ref(''), paste = ref(''), msg = ref(''), err = ref(false)
const say = (m, bad = false) => { msg.value = m; err.value = bad }

function save(i) {
  if (slots.value[i - 1] && confirmOver.value !== i) { confirmOver.value = i; return }
  confirmOver.value = null
  say(saveGameSlot(i) ? t('sv.saved', { n: i }) : t('sv.fail'), false); refresh()
}
function del(i) { deleteGameSlot(i); refresh(); say(t('sv.deleted', { n: i })) }
async function showCode() { code.value = await exportCode(game.s); say('') }
async function copy() {
  try { await navigator.clipboard.writeText(code.value); say(t('sv.copied')) } catch (e) { say(t('sv.copyFail'), true) }
}
function file() { downloadSave(game.s, 'kolony-vibe-' + (game.s.sc || 'moon') + '-' + t('sv.dayFile', { d: game.s.m }) + '.json') }
async function fromCode() { if (!(await importGame(paste.value))) say(t('sv.bad'), true) }
async function fromFile(e) {
  const f = e.target.files && e.target.files[0]
  if (f && !(await importGame(await f.text()))) say(t('sv.bad'), true)
  e.target.value = ''
}
</script>

<template>
  <h1>{{ t('sv.title') }}</h1>
  <p class="small">{{ t('sv.info') }}</p>
  <div v-for="(x, i) in slots" :key="i" class="card">
    <div class="row">
      <span><span class="t">{{ t('sv.slot', { n: i + 1 }) }}</span>
        <span v-if="x" class="small"> · {{ scenName(x.sc) }} · {{ t('sv.line', { d: x.m, p: x.pop }) }}<template v-if="x.over"> · {{ t('sv.over') }}</template></span>
        <span v-else class="small"> · {{ t('sv.empty') }}</span>
      </span>
      <span class="pr" style="margin:0">
        <button v-if="canSave" :class="{ bug: confirmOver === i + 1 }" @click="save(i + 1)">{{ confirmOver === i + 1 ? t('sv.overwrite') : t('sv.save') }}</button>
        <button :disabled="!x" @click="loadGameSlot(i + 1)">{{ t('sv.load') }}</button>
        <button :disabled="!x" :title="t('sv.delete')" @click="del(i + 1)">✕</button>
      </span>
    </div>
    <div v-if="x" class="small">{{ t('sv.at', { d: when(x.at) }) }}</div>
  </div>

  <template v-if="canSave">
    <div class="devh" style="margin-top:12px">{{ t('sv.export') }}</div>
    <div class="small">{{ t('sv.exportInfo') }}</div>
    <div class="btns">
      <button @click="showCode">{{ t('sv.showCode') }}</button>
      <button @click="file">{{ t('sv.file') }}</button>
    </div>
    <template v-if="code">
      <textarea class="savecode" readonly :value="code" @focus="$event.target.select()"></textarea>
      <div class="btns"><button @click="copy">{{ t('sv.copy') }}</button></div>
    </template>
  </template>

  <div class="devh" style="margin-top:12px">{{ t('sv.import') }}</div>
  <div class="small">{{ t('sv.importInfo') }}</div>
  <textarea v-model="paste" class="savecode" :placeholder="t('sv.paste')"></textarea>
  <div class="btns">
    <button :disabled="!paste.trim()" @click="fromCode">{{ t('sv.fromCode') }}</button>
    <label class="filebtn">{{ t('sv.fromFile') }}<input type="file" accept=".json,.txt,application/json,text/plain" @change="fromFile"></label>
  </div>
  <p v-if="msg" class="small" :class="err ? 'neg' : 'pos'">{{ msg }}</p>
  <div class="btns"><button @click="goBack">{{ t('common.back') }}</button></div>
</template>
