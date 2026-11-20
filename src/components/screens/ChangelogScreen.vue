<script setup>
import { goBack } from '../../store.js'
import { CHANGELOG } from '../../game/changelog.js'
</script>

<template>
  <h1>ZMIANY</h1>
  <template v-for="e in CHANGELOG" :key="e.v">
    <p><span style="color:var(--white)">WERSJA {{ e.v.toUpperCase() }}</span> <span class="small sub">· {{ e.d }}</span></p>
    <div class="small"><div v-for="(x, i) in e.items" :key="i" style="margin:3px 0">• {{ x }}</div><div v-if="!e.items.length" style="margin:3px 0">Na razie bez zmian.</div></div>
  </template>
  <div class="btns"><button @click="goBack">WRÓĆ</button></div>
</template>
