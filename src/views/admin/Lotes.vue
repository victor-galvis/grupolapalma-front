<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Lotes</h2>
      <RouterLink to="/admin/lotes/nuevo" class="px-4 py-2 rounded-lg text-sm font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">Nuevo Lote</RouterLink>
    </div>
    <LoadingSpinner v-if="loading" />
    <DataTable v-else :columns="columns" :data="lotes">
      <template #valor_total="{ value }"><span class="font-serif">{{ formatCurrency(value) }}</span></template>
      <template #estado="{ value }"><StatusBadge :status="value" /></template>
      <template #acciones="{ row }">
        <RouterLink :to="`/admin/lotes/${row.id}/editar`" class="text-xs mr-2" :style="{ color: 'var(--color-gold)' }">Editar</RouterLink>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { lotesApi } from '../../api/admin/lotes'
import DataTable from '../../components/ui/DataTable.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const lotes = ref([])
const loading = ref(false)
const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'proyecto', label: 'Proyecto' },
  { key: 'etapa', label: 'Etapa' },
  { key: 'valor_total', label: 'Valor Total' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: '' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await lotesApi.getAll()
    if (data.success) lotes.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
