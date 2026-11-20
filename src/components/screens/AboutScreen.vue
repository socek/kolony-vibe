<script setup>
import { goBack } from '../../store.js'
import { versionLabel } from '../../game/changelog.js'
import PixelIcon from '../PixelIcon.vue'

const REPO = 'https://github.com/socek/kolony-vibe'
const SOCIAL = [
  { icon: 'github', n: 'GitHub', d: 'kod źródłowy gry', url: REPO },
  { icon: 'youtube', n: 'YouTube', d: 'kanał autora', url: 'https://www.youtube.com/user/socek' },
  { icon: 'twitch', n: 'Twitch', d: 'transmisje na żywo: wujeksocek', url: 'https://www.twitch.tv/wujeksocek' }
]
</script>

<template>
  <a class="forkme" :href="REPO" target="_blank" rel="noopener">FORK ME ON GITHUB</a>
  <h1>O GRZE</h1>
  <p class="about-intro">
    <span style="color:var(--white)">KOLONY VIBE</span><br>
    Wersja {{ versionLabel() }}<br><br>
    Strategiczna gra ekonomiczna o zarządzaniu kolonią na odległej planecie, w klimacie 8-bitowych komputerów.
  </p>
  <p><span class="sub">POMYSŁ, PROJEKT I TESTY</span><br><span style="color:var(--white)">Dominik "Socek" Długajczyk</span></p>
  <p><span class="sub">IMPLEMENTACJA</span><br><span style="color:var(--white)">Claude</span> – model AI firmy Anthropic (Claude Opus 5.5, Claude Code). Cały kod gry napisał Claude według wskazówek autora.</p>
  <div class="social">
    <a v-for="x in SOCIAL" :key="x.icon" :href="x.url" target="_blank" rel="noopener" :class="x.icon">
      <PixelIcon :name="x.icon" /><span><b>{{ x.n }}</b><br><span class="small">{{ x.d }}</span></span>
    </a>
  </div>
  <p class="small">
    (C) 2026 Dominik "Socek" Długajczyk · licencja GNU AGPL v3<br>
    Kod źródłowy: <a :href="REPO" target="_blank" rel="noopener">github.com/socek/kolony-vibe</a><br>
    Czcionki VT323 i Press Start 2P: SIL Open Font License
  </p>
  <div class="btns"><button @click="goBack">WRÓĆ</button></div>
</template>
