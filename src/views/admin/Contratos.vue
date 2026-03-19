<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Contratos</h2>
      <RouterLink to="/admin/contratos/nuevo" class="px-4 py-2 rounded-lg text-sm font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">Nuevo Contrato</RouterLink>
    </div>
    <LoadingSpinner v-if="loading" />
    <DataTable v-else :columns="columns" :data="contratos">
      <template #cliente="{ row }">{{ row.user?.name }}</template>
      <template #lote="{ row }">{{ row.lote?.nombre }}</template>
      <template #valor_lote="{ value }"><span class="font-serif">{{ formatCurrency(value) }}</span></template>
      <template #estado="{ value }"><StatusBadge :status="value" /></template>
      <template #acciones="{ row }">
        <RouterLink :to="`/admin/contratos/${row.id}`" class="text-xs" :style="{ color: 'var(--color-gold)' }">Ver detalle</RouterLink>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { contratosApi } from '../../api/admin/contratos'
import DataTable from '../../components/ui/DataTable.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const contratos = ref([])
const loading = ref(false)
const columns = [
  { key: 'cliente', label: 'Cliente' },
  { key: 'lote', label: 'Lote' },
  { key: 'valor_lote', label: 'Valor' },
  { key: 'numero_cuotas', label: 'Cuotas' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: '' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await contratosApi.getAll()
    if (data.success) contratos.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
