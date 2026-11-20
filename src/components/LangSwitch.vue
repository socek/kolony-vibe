<script setup>
import { LANGS, i18n, setLang } from '../i18n.js'
// przełącznik języka: na ekranie startowym i w ustawieniach
</script>

<template>
  <div class="langs" role="group" aria-label="Język / Language">
    <button v-for="(x, k) in LANGS" :key="k" :class="{ on: i18n.lang === k }" :aria-pressed="i18n.lang === k" :title="x.n" @click="setLang(k)">{{ k.toUpperCase() }}</button>
  </div>
</template>
