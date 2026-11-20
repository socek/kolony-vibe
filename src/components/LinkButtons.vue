<script setup>
import { t } from '../i18n.js'
// Przyciski prowadzące poza grę: zgłoszenie błędu i wsparcie autora
const LINKS = [
  { n: 'links.bug', cls: 'bug', url: 'https://github.com/socek/kolony-vibe/issues/new' },
  { n: 'links.support', cls: 'support', url: 'https://cuplink.to/socek' }
]
const open = url => window.open(url, '_blank', 'noopener')
</script>

<template>
  <button v-for="x in LINKS" :key="x.cls" :class="x.cls" @click="open(x.url)">{{ t(x.n) }}</button>
</template>
