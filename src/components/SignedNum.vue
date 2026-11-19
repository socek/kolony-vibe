<script setup>
import { computed } from 'vue'

// Liczba ze znakiem: zielona gdy >= 0, czerwona gdy ujemna
const props = defineProps({ n: { type: Number, required: true }, suffix: { type: String, default: '' } })
const r = computed(() => Math.round(props.n))
</script>

<template>
  <span :class="r >= 0 ? 'pos' : 'neg'">{{ (r > 0 ? '+' : '') + r + suffix }}</span>
</template>
