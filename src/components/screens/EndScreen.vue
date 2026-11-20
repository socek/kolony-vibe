<script setup>
import { computed } from 'vue'
import { game, ui, newGame, closeScreen, showStats } from '../../store.js'
import { hall } from '../../game/scores.js'
import { BADGES } from '../../game/badges.js'
import { DAYS } from '../../game/constants.js'
import { fmt } from '../../game/format.js'
import { score, baseScore } from '../../game/state.js'
import { scenarioOf, diffOf } from '../../game/scenarios.js'

const s = computed(() => game.s)
</script>

<template>
  <template v-if="s.over">
    <h1 :class="s.over.win ? 'pos' : 'neg'">{{ s.over.t }}</h1>
    <p>{{ s.over.d }}</p>
    <p class="small">Scenariusz: {{ scenarioOf(s).n }} ({{ diffOf(s).n.toLowerCase() }})</p>
    <p>Koloniści: {{ fmt(s.pop) }} · Morale: {{ Math.round(s.mor) }}%<br>Dzień: {{ Math.min(s.m, DAYS) }} · Technologie: {{ Object.keys(s.tech).length }}</p>
    <p class="t" style="color:var(--yellow)">WYNIK: {{ score(s) }}</p>
    <p class="small">{{ baseScore(s) }} pkt × {{ String(diffOf(s).mult).replace('.', ',') }} za poziom trudności</p>
    <p v-if="ui.lastPlace" class="sub">Twój wynik to {{ ui.lastPlace }}. miejsce na {{ hall.scores.length }} {{ hall.scores.length === 1 ? 'grę' : 'gier' }}.</p>
    <p v-if="s.earned && s.earned.length" class="small pos">Odznaki zdobyte w tej grze: {{ s.earned.map(k => BADGES.find(b => b.k === k).n).join(', ') }}</p>
  </template>
  <div class="btns">
    <button @click="newGame">NOWA GRA</button>
    <button @click="showStats">STATYSTYKI</button>
    <button @click="closeScreen">ZOBACZ KOLONIĘ</button>
  </div>
</template>
