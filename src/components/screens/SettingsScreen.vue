<script setup>
import { t } from '../../i18n.js'
import { showScreen } from '../../store.js'
import { STOPS, settings, stopDefaults } from '../../game/stops.js'
import { CHOICES } from '../../game/choices.js'
import { audio } from '../../game/audio.js'
import { analyticsOn } from '../../analytics.js'
import LangSwitch from '../LangSwitch.vue'
const setAuto = (k, v) => { if (v === '') delete settings.auto[k]; else settings.auto[k] = +v }

const setAll = v => { for (const x of STOPS) settings.stops[x.k] = v }
const reset = () => Object.assign(settings.stops, stopDefaults())
</script>

<template>
  <h1>{{ t('menu.settings') }}</h1>
  <div class="devh">{{ t('set.lang') }}</div>
  <div class="card"><LangSwitch /></div>
  <div class="devh">{{ t('set.access') }}</div>
  <div class="card">
    <div class="row stopopt"><span>{{ t('set.size') }}</span>
      <span class="pr" style="margin:0"><button v-for="z in ['m', 'l', 'xl']" :key="z" :class="{ on: settings.size === z }" @click="settings.size = z">{{ t('set.size.' + z) }}</button></span></div>
    <label class="row stopopt"><span>{{ t('set.contrast') }}</span><input v-model="settings.contrast" type="checkbox"></label>
  </div>
  <div class="devh">{{ t('set.sound') }}</div>
  <div class="card">
    <label class="row stopopt"><span>{{ t('set.music') }}</span><input v-model="settings.music" type="checkbox"></label>
    <label class="row stopopt"><span>{{ t('set.sfx') }}</span><input v-model="audio.sound" type="checkbox"></label>
  </div>
  <div class="devh">{{ t('set.tutorial') }}</div>
  <div class="card">
    <label class="row stopopt"><span>{{ t('set.hints') }}</span><input v-model="settings.hints" type="checkbox"></label>
    <label class="row stopopt"><span>{{ t('set.short') }}</span><input v-model="settings.short" type="checkbox"></label>
    <div v-if="Object.keys(settings.hintOff).length" class="row small"><span>{{ t('set.hintsOff', { n: Object.keys(settings.hintOff).length }) }}</span><button @click="Object.keys(settings.hintOff).forEach(k => delete settings.hintOff[k])">{{ t('set.hintsRestore') }}</button></div>
  </div>
  <template v-if="analyticsOn">
    <div class="devh">{{ t('set.stats') }}</div>
    <div class="card">
      <label class="row stopopt"><span>{{ t('set.analytics') }}</span><input :checked="settings.analytics === true" type="checkbox" @change="settings.analytics = $event.target.checked"></label>
      <div class="small">{{ t('set.analyticsNote') }}</div>
    </div>
  </template>
  <div class="devh">{{ t('set.stops') }}</div>
  <div class="small">{{ t('set.stopsInfo') }}</div>
  <div class="card">
    <label v-for="x in STOPS" :key="x.k" class="row stopopt">
      <span>{{ x.n }}</span>
      <input v-model="settings.stops[x.k]" type="checkbox">
    </label>
  </div>
  <div class="btns">
    <button @click="setAll(true)">{{ t('set.all') }}</button>
    <button @click="reset">{{ t('set.defaults') }}</button>
    <button @click="setAll(false)">{{ t('set.none') }}</button>
  </div>
  <div class="devh" style="margin-top:14px">{{ t('set.auto') }}</div>
  <div class="small">{{ t('set.autoInfo') }}</div>
  <div class="card">
    <label v-for="(ev, k) in CHOICES" :key="k" class="row stopopt">
      <span>{{ ev.t }}</span>
      <select class="autosel" :value="settings.auto[k] ?? ''" @change="setAuto(k, $event.target.value)">
        <option value="">{{ t('set.askMe') }}</option>
        <option v-for="(o, i) in ev.opts" :key="i" :value="i">{{ o.n }}</option>
      </select>
    </label>
  </div>
  <div class="btns"><button @click="showScreen('menu')">{{ t('common.backMenu') }}</button></div>
</template>
