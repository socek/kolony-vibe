<script setup>
import { t } from '../../i18n.js'
import { ui, closeHint } from '../../store.js'
import { settings } from '../../game/stops.js'
// wyłącza cały samouczek (wszystkie podpowiedzi); można go włączyć z powrotem w ustawieniach
const disableAll = () => { settings.hints = false; closeHint(false) }
import { HINTS } from '../../game/hints.js'
</script>

<template>
  <template v-if="ui.hint && HINTS[ui.hint]">
    <div class="sub small">{{ t('hint.title') }}</div>
    <h1>{{ HINTS[ui.hint].t.toUpperCase() }}</h1>
    <p>{{ HINTS[ui.hint].d }}</p>
    <div class="btns">
      <button @click="closeHint(false)">{{ t('hint.ok') }}</button>
      <button @click="closeHint(true)">{{ t('hint.never') }}</button>
      <button class="bug" @click="disableAll">{{ t('hint.off') }}</button>
    </div>
    <p class="small">{{ t('hint.note') }}</p>
  </template>
</template>
