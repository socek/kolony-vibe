<script setup>
import { computed } from 'vue'
import { pct } from '../game/format.js'

const props = defineProps({ value: { type: Number, default: 0 }, max: { type: Number, default: 1 }, cls: { type: String, default: '' } })
const width = computed(() => pct(props.value, props.max) + '%')
</script>

<template>
  <div class="meter"><i :class="cls" :style="{ width }"></i></div>
</template>
