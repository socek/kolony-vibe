<script setup>
import { ui, setTab } from './store.js'
import { TABS } from './game/constants.js'
import TopStatus from './components/TopStatus.vue'
import ResourceTiles from './components/ResourceTiles.vue'
import BottomBar from './components/BottomBar.vue'
import TurnOverlay from './components/TurnOverlay.vue'
import ScreenOverlay from './components/ScreenOverlay.vue'
import ReportTab from './components/tabs/ReportTab.vue'
import BuildTab from './components/tabs/BuildTab.vue'
import WorkTab from './components/tabs/WorkTab.vue'
import MarketTab from './components/tabs/MarketTab.vue'
import PolicyTab from './components/tabs/PolicyTab.vue'
import ResearchTab from './components/tabs/ResearchTab.vue'

const PANELS = { raport: ReportTab, budowa: BuildTab, praca: WorkTab, rynek: MarketTab, polityka: PolicyTab, nauka: ResearchTab }
</script>

<template>
  <div class="screen">
    <h1>KOLONY<span class="sub"> VIBE</span></h1>
    <TopStatus />
    <ResourceTiles />
    <div class="tabs">
      <button v-for="[k, l] in TABS" :key="k" :class="{ on: ui.tab === k }" @click="setTab(k)">{{ l }}</button>
    </div>
    <div class="panel"><component :is="PANELS[ui.tab]" /></div>
    <BottomBar />
  </div>
  <ScreenOverlay />
  <TurnOverlay />
</template>
