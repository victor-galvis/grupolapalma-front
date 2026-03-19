<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    <template v-else>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Clientes Activos" :value="String(stats?.clientes_activos || 0)" :icon="UsersIcon" />
        <StatCard label="Contratos Activos" :value="String(stats?.contratos_activos || 0)" :icon="DocumentTextIcon" />
        <StatCard label="Recaudado este mes" :value="formatCurrency(stats?.recaudado_mes)" :icon="BanknotesIcon" />
        <StatCard label="Cuotas Vencidas" :value="String(stats?.cuotas_vencidas || 0)" :icon="ExclamationTriangleIcon" />
      </div>

      <div class="rounded-2xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Contratos Recientes</h3>
          <div class="flex gap-2">
            <RouterLink to="/admin/contratos/nuevo" class="px-3 py-1.5 rounded-lg text-xs font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
              Nuevo Contrato
            </RouterLink>
          </div>
        </div>
        <DataTable :columns="columns" :data="stats?.contratos_recientes || []">
          <template #user="{ row }">{{ row.user?.name }}</template>
          <template #lote="{ row }">{{ row.lote?.nombre }}</template>
          <template #estado="{ value }"><StatusBadge :status="value" /></template>
          <template #valor_lote="{ value }"><span class="font-serif">{{ formatCurrency(value) }}</span></template>
          <template #acciones="{ row }">
            <RouterLink :to="`/admin/contratos/${row.id}`" class="text-xs" :style="{ color: 'var(--color-gold)' }">Ver</RouterLink>
          </template>
        </DataTable>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UsersIcon, DocumentTextIcon, BanknotesIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { reportesApi } from '../../api/admin/reportes'
import StatCard from '../../components/ui/StatCard.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import DataTable from '../../components/ui/DataTable.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const stats = ref(null)
const loading = ref(false)
const columns = [
  { key: 'user', label: 'Cliente' },
  { key: 'lote', label: 'Lote' },
  { key: 'valor_lote', label: 'Valor' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: '' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await reportesApi.dashboard()
    if (data.success) stats.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
