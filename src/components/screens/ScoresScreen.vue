<script setup>
import { ref } from 'vue'
import { showScreen } from '../../store.js'
import { hall } from '../../game/scores.js'
import { BADGES } from '../../game/badges.js'

const open = ref(null)
const date = iso => new Date(iso).toLocaleDateString('pl-PL')
const badgeName = k => (BADGES.find(b => b.k === k) || {}).n || k
</script>

<template>
  <h1>WYNIKI</h1>
  <div class="devh">NAJLEPSZE GRY</div>
  <p v-if="!hall.scores.length" class="small">Nie ukończono jeszcze żadnej gry.</p>
  <div v-else class="scores">
    <div class="row small scorehead"><span>#</span><span class="grow">scenariusz</span><span>wynik</span></div>
    <template v-for="(x, i) in hall.scores.slice(0, 20)" :key="i">
      <button class="row scorerow" @click="open = open === i ? null : i">
        <span>{{ i + 1 }}.</span>
        <span class="grow">{{ x.scn }} <span class="small" :class="x.win ? 'pos' : 'neg'">{{ x.win ? 'wygrana' : 'przegrana' }}</span></span>
        <span class="warn">{{ x.score }}</span>
      </button>
      <div v-if="open === i" class="small scoredet">
        {{ date(x.date) }} · {{ x.diff.toLowerCase() }} (×{{ String(x.mult).replace('.', ',') }}) · {{ x.end }}<br>
        koloniści {{ x.pop }} · dzień {{ x.day }} · morale {{ x.mor }}% · kredyty {{ x.cr }} · technologie {{ x.tech }}<br>
        punkty {{ x.base }} × {{ String(x.mult).replace('.', ',') }} = {{ x.score }}<template v-if="x.badges.length"> · odznaki: {{ x.badges.map(badgeName).join(', ') }}</template>
      </div>
    </template>
  </div>

  <div class="devh" style="margin-top:14px">ODZNAKI ({{ Object.keys(hall.badges).length }}/{{ BADGES.length }})</div>
  <div v-for="b in BADGES" :key="b.k" class="row badge" :class="{ got: hall.badges[b.k] }">
    <span><span class="t">{{ hall.badges[b.k] ? '★' : '☆' }} {{ b.n }}</span><br><span class="small">{{ b.d }}</span></span>
    <span class="small">{{ hall.badges[b.k] ? date(hall.badges[b.k]) : '' }}</span>
  </div>
  <div class="btns"><button @click="showScreen('menu')">WRÓĆ DO MENU</button></div>
</template>
