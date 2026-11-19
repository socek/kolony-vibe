<script setup>
import { computed } from 'vue'
import { game, ui, closeScreen, devAct, devSet, devTech } from '../../store.js'
import { BLD, TECH } from '../../game/constants.js'
import { EVNAMES } from '../../game/events.js'

// Menu deweloperskie / cheaty – edycja całego stanu gry
const s = computed(() => game.s)
const r2 = v => Math.round((v || 0) * 100) / 100
const stateFields = [['Dzień', 'm'], ['Koloniści', 'pop'], ['Morale %', 'mor'], ['Żywność t', 'food'], ['Energia kWh', 'energy'], ['Minerały t', 'min'], ['Kredyty', 'cr'], ['Podatki %', 'tax']]
const ACTIONS = [['finish', 'UKOŃCZ BUDOWY'], ['fill', 'NAPEŁNIJ MAGAZYNY'], ['cash', '+1000 KR'], ['alltech', 'WSZYSTKIE TECHNOLOGIE'], ['skip7', '+7 DNI'], ['skip30', '+30 DNI'], ['dep', '+ZŁOŻE 1000 T'], ['expback', 'WYPRAWY WRACAJĄ'], ['revive', 'WZNÓW GRĘ PO KOŃCU']]
</script>

<template>
  <h1>DEV · IDDQD</h1>
  <p v-if="ui.devMsg" class="sub">{{ ui.devMsg }}</p>

  <div class="devh">STAN</div>
  <div class="dev">
    <label v-for="[l, k] in stateFields" :key="k">{{ l }}<input type="number" :value="r2(s[k])" @change="devSet(s, k, $event.target.value)"></label>
    <label>Cena żywn.<input type="number" :value="r2(s.pr.food)" @change="devSet(s.pr, 'food', $event.target.value)"></label>
    <label>Cena min.<input type="number" :value="r2(s.pr.min)" @change="devSet(s.pr, 'min', $event.target.value)"></label>
  </div>

  <div class="devh">BUDYNKI</div>
  <div class="dev">
    <label v-for="(b, k) in BLD" :key="k">{{ b.n }}<input type="number" :value="s.b[k]" @change="devSet(s.b, k, $event.target.value)"></label>
  </div>

  <template v-if="s.q.length">
    <div class="devh">PLACE BUDOWY (wykonana praca)</div>
    <div class="dev">
      <label v-for="(x, i) in s.q" :key="i">{{ BLD[x.k].n }} /{{ BLD[x.k].bt }}<input type="number" :value="r2(x.d)" @change="devSet(x, 'd', $event.target.value)"></label>
    </div>
  </template>

  <template v-if="s.dep.length">
    <div class="devh">ZŁOŻA (pozostało t)</div>
    <div class="dev">
      <label v-for="(d, i) in s.dep" :key="i">{{ d.n }}<input type="number" :value="Math.round(d.t)" @change="devSet(d, 't', $event.target.value)"></label>
    </div>
  </template>

  <div class="devh">TECHNOLOGIE (odkryta · postęp w pkt)</div>
  <div class="dev" style="grid-template-columns:repeat(auto-fill,minmax(270px,1fr))">
    <label v-for="(t, k) in TECH" :key="k">{{ t.n }}
      <span>
        <input type="checkbox" :checked="!!s.tech[k]" @change="devTech(k, $event.target.checked)">
        <input type="number" :value="Math.round(s.rp[k] || 0)" :title="'postęp /' + t.c" @change="devSet(s.rp, k, $event.target.value)">
      </span>
    </label>
  </div>

  <div class="devh">AKCJE</div>
  <div class="btns" style="margin-top:4px"><button v-for="[a, l] in ACTIONS" :key="a" @click="devAct(a)">{{ l }}</button></div>

  <div class="devh">WYWOŁAJ ZDARZENIE</div>
  <div class="btns" style="margin-top:4px"><button v-for="(n, i) in EVNAMES" :key="i" @click="devAct('ev' + i)">{{ n }}</button></div>

  <div class="btns"><button @click="closeScreen">ZAMKNIJ</button></div>
</template>
