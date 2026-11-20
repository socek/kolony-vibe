<script setup>
import { closeScreen } from '../../store.js'
import { versionLabel } from '../../game/changelog.js'
</script>

<template>
  <h1>O GRZE</h1>
  <p>
    <span style="color:var(--white)">KOLONY VIBE</span><br>
    Wersja {{ versionLabel() }}<br><br>
    Strategiczna gra ekonomiczna o zarządzaniu kolonią na odległej planecie, w klimacie 8-bitowych komputerów.
  </p>
  <p><span class="sub">POMYSŁ, PROJEKT I TESTY</span><br><span style="color:var(--white)">Dominik "Socek" Długajczyk</span></p>
  <p><span class="sub">IMPLEMENTACJA</span><br><span style="color:var(--white)">Claude</span> – model AI firmy Anthropic (Claude Opus 5.5, Claude Code). Cały kod gry napisał Claude według wskazówek autora.</p>
  <p class="small">
    (C) 2026 Dominik "Socek" Długajczyk · licencja GNU AGPL v3<br>
    Kod źródłowy: <a href="https://github.com/socek/kolony-vibe" target="_blank" rel="noopener">github.com/socek/kolony-vibe</a><br>
    Czcionki VT323 i Press Start 2P: SIL Open Font License
  </p>
  <div class="btns"><button @click="closeScreen">WRÓĆ</button></div>
</template>
