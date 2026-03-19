<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Reportes</h2>

    <div class="flex gap-3">
      <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :style="activeTab === tab.value ? { background: 'var(--color-gold)', color: '#1A1812' } : { border: '1px solid var(--color-border)', color: 'var(--color-muted)' }">
        {{ tab.label }}
      </button>
    </div>

    <LoadingSpinner v-if="loading" />
    <template v-else>
      <DataTable v-if="activeTab === 'cuotas'" :columns="cuotasCols" :data="cuotasVencidas">
        <template #cliente="{ row }">{{ row.contrato?.user?.name }}</template>
        <template #saldo="{ value }"><span class="font-serif" :style="{ color: 'var(--color-red)' }">{{ formatCurrency(value) }}</span></template>
        <template #fecha_vencimiento="{ value }">{{ formatDate(value) }}</template>
      </DataTable>
      <DataTable v-if="activeTab === 'pagos'" :columns="pagosCols" :data="pagosMes">
        <template #valor="{ value }"><span class="font-serif" :style="{ color: 'var(--color-green)' }">{{ formatCurrency(value) }}</span></template>
        <template #fecha_pago="{ value }">{{ formatDate(value) }}</template>
      </DataTable>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { reportesApi } from '../../api/admin/reportes'
import DataTable from '../../components/ui/DataTable.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const activeTab = ref('cuotas')
const loading = ref(false)
const cuotasVencidas = ref([])
const pagosMes = ref([])

const tabs = [
  { value: 'cuotas', label: 'Cuotas Vencidas' },
  { value: 'pagos', label: 'Pagos del Mes' },
]

const cuotasCols = [
  { key: 'numero_cuota', label: '#' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'fecha_vencimiento', label: 'Vencimiento' },
  { key: 'saldo', label: 'Saldo' },
]

const pagosCols = [
  { key: 'fecha_pago', label: 'Fecha' },
  { key: 'valor', label: 'Valor' },
  { key: 'metodo', label: 'Método' },
  { key: 'referencia', label: 'Referencia' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function fetchData() {
  loading.value = true
  try {
    if (activeTab.value === 'cuotas') {
      const { data } = await reportesApi.cuotasVencidas()
      if (data.success) cuotasVencidas.value = data.data
    } else {
      const { data } = await reportesApi.pagosMes()
      if (data.success) pagosMes.value = data.data
    }
  } finally {
    loading.value = false
  }
}

watch(activeTab, fetchData)
onMounted(fetchData)
</script>
