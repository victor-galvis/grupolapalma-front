<template>
  <div
    class="rounded-xl p-6 transition-all duration-200"
    :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }"
  >
    <div class="flex items-center justify-between mb-3">
      <p class="text-sm font-medium" :style="{ color: 'var(--color-muted)' }">{{ label }}</p>
      <component :is="icon" v-if="icon" class="w-5 h-5" :style="{ color: 'var(--color-gold)' }" />
    </div>
    <p class="text-2xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ value }}</p>
    <p v-if="sub" class="text-xs mt-1" :style="{ color: 'var(--color-muted)' }">{{ sub }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  sub: String,
  icon: Object,
})
</script>
