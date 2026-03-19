<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    <template v-else-if="contrato">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ contrato.lote?.nombre }}</h2>
          <p class="text-sm" :style="{ color: 'var(--color-muted)' }">{{ contrato.user?.name }} · Contrato #{{ contrato.id }}</p>
        </div>
        <StatusBadge :status="contrato.estado" />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Valor Lote" :value="formatCurrency(contrato.valor_lote)" />
        <StatCard label="A Financiar" :value="formatCurrency(contrato.valor_a_financiar)" />
        <StatCard label="Cuota Mensual" :value="formatCurrency(contrato.valor_cuota_mensual)" />
        <StatCard label="Saldo 70%" :value="formatCurrency(contrato.valor_restante_70_neto)" />
      </div>

      <div>
        <h3 class="font-serif font-semibold mb-4" :style="{ color: 'var(--color-text)' }">Plan de Pagos</h3>
        <PlanPagosTable :cuotas="contrato.plan_pagos || []" @pagar="abrirModalPago" />
      </div>

      <!-- Modal registro pago admin -->
      <Modal v-model="showPagoModal" title="Registrar Pago">
        <div v-if="cuotaSeleccionada" class="space-y-4">
          <p class="text-sm" :style="{ color: 'var(--color-muted)' }">Cuota #{{ cuotaSeleccionada.numero_cuota }} · Saldo: {{ formatCurrency(cuotaSeleccionada.saldo) }}</p>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Valor</label>
            <input v-model="pagoForm.valor" type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Método</label>
            <select v-model="pagoForm.metodo" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }">
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="pse">PSE</option>
              <option value="wompi">Wompi</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Fecha de pago</label>
            <input v-model="pagoForm.fecha_pago" type="date" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
          </div>
          <button @click="registrarPago" :disabled="pagoLoading" class="w-full py-2.5 rounded-lg font-medium text-sm" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
            {{ pagoLoading ? 'Registrando...' : 'Registrar Pago' }}
          </button>
        </div>
      </Modal>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { contratosApi } from '../../api/admin/contratos'
import { pagosAdminApi } from '../../api/admin/pagos'
import StatCard from '../../components/ui/StatCard.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import PlanPagosTable from '../../components/pagos/PlanPagosTable.vue'
import Modal from '../../components/ui/Modal.vue'

const route = useRoute()
const toast = useToast()
const contrato = ref(null)
const loading = ref(false)
const showPagoModal = ref(false)
const cuotaSeleccionada = ref(null)
const pagoLoading = ref(false)
const pagoForm = ref({ valor: 0, metodo: 'transferencia', fecha_pago: new Date().toISOString().split('T')[0] })

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function abrirModalPago(cuota) {
  cuotaSeleccionada.value = cuota
  pagoForm.value.valor = cuota.saldo
  showPagoModal.value = true
}

async function registrarPago() {
  pagoLoading.value = true
  try {
    await pagosAdminApi.create({
      contrato_id: contrato.value.id,
      plan_pago_id: cuotaSeleccionada.value.id,
      ...pagoForm.value,
    })
    toast.success('Pago registrado')
    showPagoModal.value = false
    await fetchContrato()
  } catch (e) {
    toast.error('Error al registrar pago')
  } finally {
    pagoLoading.value = false
  }
}

async function fetchContrato() {
  const { data } = await contratosApi.getById(route.params.id)
  if (data.success) contrato.value = data.data
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchContrato()
  } finally {
    loading.value = false
  }
})
</script>
