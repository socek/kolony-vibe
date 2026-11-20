<script setup>
import { t } from '../../i18n.js'
import { goBack } from '../../store.js'
import { versionLabel } from '../../game/changelog.js'
import PixelIcon from '../PixelIcon.vue'

const REPO = 'https://github.com/socek/kolony-vibe'
const SOCIAL = [
  { icon: 'github', n: 'GitHub', d: 'about.gh', url: REPO },
  { icon: 'youtube', n: 'YouTube', d: 'about.yt', url: 'https://www.youtube.com/user/socek' },
  { icon: 'twitch', n: 'Twitch', d: 'about.ttv', url: 'https://www.twitch.tv/wujeksocek' }
]
</script>

<template>
  <a class="forkme" :href="REPO" target="_blank" rel="noopener">FORK ME ON GITHUB</a>
  <h1>{{ t('menu.about') }}</h1>
  <p class="about-intro">
    <span style="color:var(--white)">KOLONY VIBE</span><br>
    {{ t('about.version', { v: versionLabel() }) }}<br><br>
    {{ t('about.desc') }}
  </p>
  <p><span class="sub">{{ t('about.idea') }}</span><br><span style="color:var(--white)">Dominik "Socek" Długajczyk</span></p>
  <p><span class="sub">{{ t('about.impl') }}</span><br><span style="color:var(--white)">Claude</span> {{ t('about.implText') }}</p>
  <div class="social">
    <a v-for="x in SOCIAL" :key="x.icon" :href="x.url" target="_blank" rel="noopener" :class="x.icon">
      <PixelIcon :name="x.icon" /><span><b>{{ x.n }}</b><br><span class="small">{{ t(x.d) }}</span></span>
    </a>
  </div>
  <p class="small">
    (C) 2026 Dominik "Socek" Długajczyk · {{ t('about.license') }}<br>
    {{ t('about.source') }} <a :href="REPO" target="_blank" rel="noopener">github.com/socek/kolony-vibe</a><br>
    {{ t('about.fonts') }}
  </p>
  <div class="btns"><button @click="goBack">{{ t('common.back') }}</button></div>
</template>
