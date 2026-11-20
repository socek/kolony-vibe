<script setup>
import { computed } from 'vue'
import { game, decide, closeScreen } from '../../store.js'
import { CHOICES } from '../../game/choices.js'

// Decyzji nie da się pominąć: można tylko obejrzeć kolonię i wrócić tu przyciskiem DECYZJA!
const ev = computed(() => game.s.pending && CHOICES[game.s.pending])
</script>

<template>
  <template v-if="ev">
    <h1 class="warn">{{ ev.t.toUpperCase() }}</h1>
    <p>{{ ev.d(game.s) }}</p>
    <div class="vchoice">
      <button v-for="(o, i) in ev.opts" :key="i" :disabled="!!(o.need && o.need(game.s))" @click="decide(i)">
        <span class="t">{{ o.n }}</span>
        <span class="small">{{ (o.need && o.need(game.s)) || o.d(game.s) }}</span>
      </button>
    </div>
    <div class="btns"><button class="small" @click="closeScreen">OBEJRZYJ KOLONIĘ (DECYZJA POCZEKA)</button></div>
  </template>
</template>
