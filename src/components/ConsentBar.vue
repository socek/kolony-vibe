<script setup>
import { settings } from '../game/stops.js'
import { analyticsOn } from '../analytics.js'
// Pytanie o zgodę na anonimowe statystyki (Google Analytics) – raz, przy pierwszym uruchomieniu opublikowanej gry
</script>

<template>
  <div v-if="analyticsOn && settings.analytics === null" class="consent">
    <div>Czy pozwolisz zbierać anonimowe statystyki gry (Google Analytics)? Pomogą autorowi sprawdzić, ile osób gra i które części gry są używane. Zmienisz to w menu → USTAWIENIA.</div>
    <div class="btns">
      <button class="support" @click="settings.analytics = true">ZGODA</button>
      <button @click="settings.analytics = false">NIE, DZIĘKUJĘ</button>
    </div>
  </div>
</template>
