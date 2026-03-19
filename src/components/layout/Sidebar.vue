<template>
  <aside class="w-64 flex-shrink-0 flex flex-col h-screen" style="background: #1A1812;">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-6" style="border-bottom: 1px solid rgba(255,255,255,0.08);">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center font-serif font-bold text-lg" style="background: var(--color-gold); color: #1A1812;">
        LP
      </div>
      <div>
        <p class="font-serif font-semibold text-sm" style="color: #F5F0E8;">Grupo La Palma</p>
        <p class="text-xs" style="color: #6B6055;">Portal de Pagos</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        :style="isActive(item.to)
          ? { background: 'var(--color-gold)', color: '#1A1812' }
          : { color: '#8A8070' }"
        @mouseenter="hovered = item.to"
        @mouseleave="hovered = null"
      >
        <component :is="item.icon" class="w-4 h-4" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- User info -->
    <div class="px-4 py-4" style="border-top: 1px solid rgba(255,255,255,0.08);">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style="background: var(--color-gold); color: #1A1812;">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium truncate" style="color: #F5F0E8;">{{ authStore.user?.name }}</p>
          <p class="text-xs truncate" style="color: #6B6055;">{{ authStore.role }}</p>
        </div>
        <button @click="handleLogout" title="Cerrar sesión" style="color: #6B6055;" class="hover:opacity-70">
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeIcon, UsersIcon, MapPinIcon, DocumentTextIcon,
  ChartBarIcon, ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({ role: { type: String, default: 'cliente' } })
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const hovered = ref(null)

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/admin/usuarios', label: 'Usuarios', icon: UsersIcon },
  { to: '/admin/lotes', label: 'Lotes', icon: MapPinIcon },
  { to: '/admin/contratos', label: 'Contratos', icon: DocumentTextIcon },
  { to: '/admin/reportes', label: 'Reportes', icon: ChartBarIcon },
]

const clienteNav = [
  { to: '/cliente/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/cliente/cuotas', label: 'Mis Cuotas', icon: DocumentTextIcon },
  { to: '/cliente/historial', label: 'Historial', icon: ChartBarIcon },
  { to: '/cliente/notificaciones', label: 'Notificaciones', icon: UsersIcon },
]

const navItems = computed(() => props.role === 'admin' ? adminNav : clienteNav)

const isActive = (path) => route.path.startsWith(path)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
