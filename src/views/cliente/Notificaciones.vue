<template>
  <div class="space-y-4">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Notificaciones</h2>
    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-3">
      <div
        v-for="n in notificaciones"
        :key="n.id"
        class="rounded-xl p-4 transition-all duration-200"
        :style="{
          background: 'var(--color-surface)',
          border: `1px solid ${n.leida ? 'var(--color-border)' : 'var(--color-gold)'}`,
          opacity: n.leida ? 0.7 : 1
        }"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <p class="font-medium text-sm" :style="{ color: 'var(--color-text)' }">{{ n.titulo }}</p>
            <p class="text-sm mt-1" :style="{ color: 'var(--color-muted)' }">{{ n.mensaje }}</p>
            <p class="text-xs mt-2" :style="{ color: 'var(--color-muted)' }">{{ formatDate(n.created_at) }}</p>
          </div>
          <button
            v-if="!n.leida"
            @click="marcarLeida(n)"
            class="text-xs px-2 py-1 rounded"
            :style="{ color: 'var(--color-gold)', border: '1px solid var(--color-gold)' }"
          >
            Leída
          </button>
        </div>
      </div>
      <div v-if="!notificaciones.length" class="text-center py-8">
        <p :style="{ color: 'var(--color-muted)' }">No hay notificaciones</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { clienteDashboardApi } from '../../api/cliente/dashboard'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const notificaciones = ref([])
const loading = ref(false)

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function marcarLeida(n) {
  await clienteDashboardApi.marcarLeida(n.id)
  n.leida = true
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await clienteDashboardApi.getNotificaciones()
    if (data.success) notificaciones.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
