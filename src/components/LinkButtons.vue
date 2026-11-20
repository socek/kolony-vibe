<script setup>
// Przyciski prowadzące poza grę: zgłoszenie błędu i wsparcie autora
const LINKS = [
  { n: 'ZGŁOŚ BŁĄD', cls: 'bug', url: 'https://github.com/socek/kolony-vibe/issues/new' },
  { n: 'WESPRZYJ', cls: 'support', url: 'https://cuplink.to/socek' }
]
const open = url => window.open(url, '_blank', 'noopener')
</script>

<template>
  <button v-for="x in LINKS" :key="x.cls" :class="x.cls" @click="open(x.url)">{{ x.n }}</button>
</template>
