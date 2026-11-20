<script setup>
import { ui, closeHint } from '../../store.js'
import { settings } from '../../game/stops.js'
// wyłącza cały samouczek (wszystkie podpowiedzi); można go włączyć z powrotem w ustawieniach
const disableAll = () => { settings.hints = false; closeHint(false) }
import { HINTS } from '../../game/hints.js'
</script>

<template>
  <template v-if="ui.hint && HINTS[ui.hint]">
    <div class="sub small">SAMOUCZEK</div>
    <h1>{{ HINTS[ui.hint].t.toUpperCase() }}</h1>
    <p>{{ HINTS[ui.hint].d }}</p>
    <div class="btns">
      <button @click="closeHint(false)">ROZUMIEM</button>
      <button @click="closeHint(true)">NIE POKAZUJ WIĘCEJ TEJ PODPOWIEDZI</button>
      <button class="bug" @click="disableAll">WYŁĄCZ SAMOUCZEK CAŁKOWICIE</button>
    </div>
    <p class="small">Samouczek możesz potem włączyć z powrotem (albo wyłączyć) w menu → USTAWIENIA → SAMOUCZEK I KOMUNIKATY. Tam też włączysz skrócone komunikaty dla zaawansowanych.</p>
  </template>
</template>
