<script setup>
import { computed } from 'vue'
import { pixels } from '../game/icons.js'

const props = defineProps({ name: { type: String, required: true } })
const px = computed(() => pixels(props.name))
</script>

<template>
  <svg class="ic" viewBox="0 0 8 8" aria-hidden="true">
    <rect v-for="(p, i) in px" :key="i" :x="p.x" :y="p.y" width="1" height="1" :fill="p.fill" />
  </svg>
</template>
