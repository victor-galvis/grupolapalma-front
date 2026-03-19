<template>
  <div class="relative inline-flex items-center justify-center">
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        fill="none"
        stroke="var(--color-border)"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        fill="none"
        stroke="var(--color-gold)"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="transition-all duration-700"
      />
    </svg>
    <div class="absolute text-center">
      <p class="font-serif font-bold" :style="{ fontSize: size > 100 ? '1.5rem' : '1rem', color: 'var(--color-text)' }">
        {{ Math.round(percentage) }}%
      </p>
      <p class="text-xs" :style="{ color: 'var(--color-muted)' }">pagado</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: { type: Number, default: 0 },
  size: { type: Number, default: 120 },
  strokeWidth: { type: Number, default: 10 },
})

const radius = computed(() => (props.size / 2) - props.strokeWidth)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value - (props.percentage / 100) * circumference.value)
</script>
