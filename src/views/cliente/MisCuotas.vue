<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Mis Cuotas</h2>
      <div class="flex gap-2">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="filter = f.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          :style="filter === f.value
            ? { background: 'var(--color-gold)', color: '#1A1812' }
            : { border: '1px solid var(--color-border)', color: 'var(--color-muted)', background: 'transparent' }"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />
    <PlanPagosTable v-else :cuotas="cuotasFiltradas" @pagar="abrirModal" />

    <ModalPago v-model="showModal" :cuota="cuotaSeleccionada" @paid="fetchCuotas" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClienteStore } from '../../stores/cliente'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PlanPagosTable from '../../components/pagos/PlanPagosTable.vue'
import ModalPago from '../../components/pagos/ModalPago.vue'

const clienteStore = useClienteStore()
const loading = ref(false)
const filter = ref('todos')
const showModal = ref(false)
const cuotaSeleccionada = ref(null)

const filters = [
  { value: 'todos', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'pagado', label: 'Pagadas' },
  { value: 'vencido', label: 'Vencidas' },
]

const cuotasFiltradas = computed(() => {
  if (filter.value === 'todos') return clienteStore.cuotas
  return clienteStore.cuotas.filter(c => c.estado === filter.value)
})

function abrirModal(cuota) {
  cuotaSeleccionada.value = cuota
  showModal.value = true
}

async function fetchCuotas() {
  loading.value = true
  try {
    await clienteStore.fetchCuotas()
  } finally {
    loading.value = false
  }
}

onMounted(fetchCuotas)
</script>
