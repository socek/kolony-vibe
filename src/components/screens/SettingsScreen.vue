<script setup>
import { showScreen } from '../../store.js'
import { STOPS, settings, stopDefaults } from '../../game/stops.js'

const setAll = v => { for (const x of STOPS) settings.stops[x.k] = v }
const reset = () => Object.assign(settings.stops, stopDefaults())
</script>

<template>
  <h1>USTAWIENIA</h1>
  <div class="devh">ZATRZYMYWANIE PRZEWIJANIA</div>
  <div class="small">Wybierz, które wydarzenia zatrzymują przewijanie przyciskiem ▶▶ 7 DNI. Stany długotrwałe (głód, blackout, brak rąk do pracy…) zatrzymują je tylko w dniu, w którym się zaczynają. Koniec gry zawsze zatrzymuje przewijanie. Ustawienia obowiązują we wszystkich grach.</div>
  <div class="card">
    <label v-for="x in STOPS" :key="x.k" class="row stopopt">
      <span>{{ x.n }}</span>
      <input v-model="settings.stops[x.k]" type="checkbox">
    </label>
  </div>
  <div class="btns">
    <button @click="setAll(true)">WSZYSTKO</button>
    <button @click="reset">DOMYŚLNE</button>
    <button @click="setAll(false)">NIC</button>
  </div>
  <div class="btns"><button @click="showScreen('menu')">WRÓĆ DO MENU</button></div>
</template>
