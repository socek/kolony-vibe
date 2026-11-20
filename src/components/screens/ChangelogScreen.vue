<script setup>
import { t } from '../../i18n.js'
import { goBack } from '../../store.js'
import { CHANGELOG } from '../../game/changelog.js'
</script>

<template>
  <h1>{{ t('menu.log') }}</h1>
  <template v-for="e in CHANGELOG" :key="e.k">
    <p><span style="color:var(--white)">{{ t('log.version', { v: e.v.toUpperCase() }) }}</span> <span class="small sub">· {{ e.date }}</span></p>
    <div class="small"><div v-for="(x, i) in e.items" :key="i" style="margin:3px 0">• {{ x }}</div><div v-if="!e.items.length" style="margin:3px 0">{{ t('log.empty') }}</div></div>
  </template>
  <div class="btns"><button @click="goBack">{{ t('common.back') }}</button></div>
</template>
