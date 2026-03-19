<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Header with lote info and progress -->
      <div class="rounded-2xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
        <div class="flex items-start gap-6">
          <ProgresoCircular :percentage="porcentajePagado" :size="130" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <StatusBadge :status="data?.contrato?.estado || 'activo'" />
            </div>
            <h2 class="text-2xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">
              {{ data?.contrato?.lote?.nombre || 'Mi Lote' }}
            </h2>
            <p class="text-sm" :style="{ color: 'var(--color-muted)' }">
              {{ data?.contrato?.lote?.proyecto }} · Etapa {{ data?.contrato?.lote?.etapa }}
            </p>
            <p class="text-sm mt-2" :style="{ color: 'var(--color-muted)' }">
              Código: <span :style="{ color: 'var(--color-gold)' }" class="font-medium">{{ data?.contrato?.lote?.codigo }}</span>
              &nbsp;·&nbsp;
              Entrega estimada: <span :style="{ color: 'var(--color-text)' }" class="font-medium">{{ formatDate(data?.contrato?.lote?.fecha_estimada_entrega) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pagado"
          :value="formatCurrency(data?.total_pagado)"
          :icon="BanknotesIcon"
        />
        <StatCard
          label="Cuotas Pagadas"
          :value="`${data?.cuotas_pagadas} / ${data?.contrato?.numero_cuotas}`"
          :icon="CheckCircleIcon"
        />
        <StatCard
          label="Saldo Pendiente"
          :value="formatCurrency(data?.saldo_pendiente)"
          :icon="ClockIcon"
        />
        <StatCard
          label="Próximo Vencimiento"
          :value="formatDate(data?.proxima_cuota?.fecha_vencimiento)"
          :sub="formatCurrency(data?.proxima_cuota?.saldo)"
          :icon="CalendarIcon"
        />
      </div>

      <!-- Main content: table + payment panel -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Plan de pagos -->
        <div class="lg:col-span-2 space-y-4">
          <h3 class="font-serif font-semibold text-lg" :style="{ color: 'var(--color-text)' }">Plan de Pagos</h3>
          <PlanPagosTable :cuotas="cuotas" @pagar="abrirModal" />
        </div>

        <!-- Panel derecho -->
        <div class="space-y-4">
          <ProximoPago :cuota="data?.proxima_cuota" @pagar="(m) => abrirModalMetodo(data?.proxima_cuota, m)" />
          <ResumenContrato :contrato="data?.contrato" />
        </div>
      </div>
    </template>

    <!-- Modal de pago -->
    <ModalPago v-model="showModal" :cuota="cuotaSeleccionada" @paid="fetchData" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BanknotesIcon, CheckCircleIcon, ClockIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { useClienteStore } from '../../stores/cliente'
import StatCard from '../../components/ui/StatCard.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import ProgresoCircular from '../../components/pagos/ProgresoCircular.vue'
import PlanPagosTable from '../../components/pagos/PlanPagosTable.vue'
import ProximoPago from '../../components/pagos/ProximoPago.vue'
import ModalPago from '../../components/pagos/ModalPago.vue'
import ResumenContrato from '../../components/pagos/ResumenContrato.vue'

const clienteStore = useClienteStore()
const data = computed(() => clienteStore.dashboardData)
const cuotas = computed(() => clienteStore.cuotas)
const loading = computed(() => clienteStore.loading)

const showModal = ref(false)
const cuotaSeleccionada = ref(null)

const porcentajePagado = computed(() => {
  if (!data.value?.contrato) return 0
  const pagadas = data.value.cuotas_pagadas || 0
  const total = data.value.contrato.numero_cuotas || 1
  return (pagadas / total) * 100
})

function abrirModal(cuota) {
  cuotaSeleccionada.value = cuota
  showModal.value = true
}

function abrirModalMetodo(cuota, metodo) {
  cuotaSeleccionada.value = cuota
  showModal.value = true
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function fetchData() {
  await Promise.all([clienteStore.fetchDashboard(), clienteStore.fetchCuotas()])
}

onMounted(fetchData)
</script>
