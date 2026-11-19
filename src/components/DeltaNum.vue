<script setup>
import { computed } from 'vue'

// Zmiana względem poprzedniego dnia przy kafelkach zasobów
const props = defineProps({ cur: Number, prev: Number })
const d = computed(() => props.prev == null ? 0 : Math.round(props.cur - props.prev))
</script>

<template>
  <span v-if="d" class="d" :class="d > 0 ? 'pos' : 'neg'">{{ (d > 0 ? '+' : '') + d }}</span>
</template>
