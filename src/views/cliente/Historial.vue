<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Historial de Pagos</h2>
    <LoadingSpinner v-if="loading" />
    <DataTable v-else :columns="columns" :data="pagos">
      <template #valor="{ value }">
        <span class="font-serif" :style="{ color: 'var(--color-green)' }">{{ formatCurrency(value) }}</span>
      </template>
      <template #metodo="{ value }">
        <span class="capitalize">{{ value }}</span>
      </template>
      <template #fecha_pago="{ value }">
        {{ formatDate(value) }}
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { clientePagosApi } from '../../api/cliente/pagos'
import DataTable from '../../components/ui/DataTable.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const pagos = ref([])
const loading = ref(false)
const columns = [
  { key: 'fecha_pago', label: 'Fecha' },
  { key: 'valor', label: 'Valor' },
  { key: 'metodo', label: 'Método' },
  { key: 'referencia', label: 'Referencia' },
  { key: 'tipo', label: 'Tipo' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await clientePagosApi.getAll()
    if (data.success) pagos.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
