<template>
  <header class="flex items-center justify-between px-6 py-4" :style="{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }">
    <div>
      <h1 class="text-lg font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ title }}</h1>
    </div>
    <div class="flex items-center gap-2">
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ThemeToggle from '../ui/ThemeToggle.vue'

const route = useRoute()
const titles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/usuarios': 'Usuarios',
  '/admin/lotes': 'Lotes',
  '/admin/contratos': 'Contratos',
  '/admin/reportes': 'Reportes',
  '/cliente/dashboard': 'Mi Panel',
  '/cliente/cuotas': 'Mis Cuotas',
  '/cliente/historial': 'Historial de Pagos',
  '/cliente/notificaciones': 'Notificaciones',
}
const title = computed(() => titles[route.path] || 'Grupo La Palma')
</script>
