<script setup>
import { ui, closeHint } from '../../store.js'
import { HINTS } from '../../game/hints.js'
</script>

<template>
  <template v-if="ui.hint && HINTS[ui.hint]">
    <div class="sub small">PODPOWIEDŹ</div>
    <h1>{{ HINTS[ui.hint].t.toUpperCase() }}</h1>
    <p>{{ HINTS[ui.hint].d }}</p>
    <div class="btns">
      <button @click="closeHint(false)">ROZUMIEM</button>
      <button @click="closeHint(true)">NIE POKAZUJ WIĘCEJ</button>
    </div>
    <p class="small">Wszystkie podpowiedzi wyłączysz w menu → USTAWIENIA.</p>
  </template>
</template>
