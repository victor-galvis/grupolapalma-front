<template>
  <button
    @click="themeStore.toggle()"
    class="p-2 rounded-lg transition-colors duration-200"
    :style="{ color: 'var(--color-muted)' }"
    :title="themeStore.isDark ? 'Modo claro' : 'Modo oscuro'"
  >
    <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
    <MoonIcon v-else class="w-5 h-5" />
  </button>
</template>

<script setup>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '../../stores/theme'
const themeStore = useThemeStore()
</script>
