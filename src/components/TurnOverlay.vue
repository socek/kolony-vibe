<script setup>
import { ui } from '../store.js'
</script>

<template>
  <div v-if="ui.turn" class="tw" :class="{ out: ui.turn.out }">
    <div class="twb">
      <div class="twt">DZIEŃ {{ ui.turn.day }}<br>{{ ui.turn.date }}</div>
      <div class="meter"><i :style="{ width: ui.turn.fill + '%' }"></i></div>
    </div>
  </div>
</template>
