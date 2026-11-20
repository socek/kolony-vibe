<script setup>
import { t } from '../i18n.js'
import { settings } from '../game/stops.js'
import { analyticsOn } from '../analytics.js'
// Pytanie o zgodę na anonimowe statystyki (Google Analytics) – raz, przy pierwszym uruchomieniu opublikowanej gry
</script>

<template>
  <div v-if="analyticsOn && settings.analytics === null" class="consent">
    <div>{{ t('consent.q') }}</div>
    <div class="btns">
      <button class="support" @click="settings.analytics = true">{{ t('consent.yes') }}</button>
      <button @click="settings.analytics = false">{{ t('consent.no') }}</button>
    </div>
  </div>
</template>
