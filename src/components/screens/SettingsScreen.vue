<script setup>
import { showScreen } from '../../store.js'
import { STOPS, settings, stopDefaults } from '../../game/stops.js'
import { CHOICES } from '../../game/choices.js'
import { audio } from '../../game/audio.js'
const setAuto = (k, v) => { if (v === '') delete settings.auto[k]; else settings.auto[k] = +v }

const setAll = v => { for (const x of STOPS) settings.stops[x.k] = v }
const reset = () => Object.assign(settings.stops, stopDefaults())
import { analyticsOn } from '../../analytics.js'
</script>

<template>
  <h1>USTAWIENIA</h1>
  <div class="devh">DŹWIĘK</div>
  <div class="card">
    <label class="row stopopt"><span>Muzyka w tle (zmienia się zależnie od sytuacji w kolonii)</span><input v-model="settings.music" type="checkbox"></label>
    <label class="row stopopt"><span>Efekty dźwiękowe</span><input v-model="audio.sound" type="checkbox"></label>
  </div>
  <div class="devh">PODPOWIEDZI</div>
  <div class="card">
    <label class="row stopopt"><span>Pokazuj podpowiedzi, gdy coś dzieje się pierwszy raz</span><input v-model="settings.hints" type="checkbox"></label>
    <div v-if="Object.keys(settings.hintOff).length" class="row small"><span>Wyłączone pojedynczo: {{ Object.keys(settings.hintOff).length }}</span><button @click="Object.keys(settings.hintOff).forEach(k => delete settings.hintOff[k])">PRZYWRÓĆ WSZYSTKIE</button></div>
  </div>
  <template v-if="analyticsOn">
    <div class="devh">STATYSTYKI</div>
    <div class="card">
      <label class="row stopopt"><span>Anonimowe statystyki gry (Google Analytics) – pomagają autorowi rozwijać grę</span><input :checked="settings.analytics === true" type="checkbox" @change="settings.analytics = $event.target.checked"></label>
      <div class="small">Po wyłączeniu gra od razu przestaje wysyłać zdarzenia; skrypt Google znika całkiem przy następnym uruchomieniu.</div>
    </div>
  </template>
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
  <div class="devh" style="margin-top:14px">AUTOMATYCZNE ODPOWIEDZI</div>
  <div class="small">Zdarzenia z wyborem zawsze czekają na twoją decyzję – chyba że ustawisz tu odpowiedź automatyczną. Jeśli wybranej odpowiedzi nie da się wykonać (np. brakuje kredytów), gra i tak zapyta.</div>
  <div class="card">
    <label v-for="(ev, k) in CHOICES" :key="k" class="row stopopt">
      <span>{{ ev.t }}</span>
      <select class="autosel" :value="settings.auto[k] ?? ''" @change="setAuto(k, $event.target.value)">
        <option value="">pytaj mnie</option>
        <option v-for="(o, i) in ev.opts" :key="i" :value="i">{{ o.n }}</option>
      </select>
    </label>
  </div>
  <div class="btns"><button @click="showScreen('menu')">WRÓĆ DO MENU</button></div>
</template>
