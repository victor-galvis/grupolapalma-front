<template>
  <Modal :modelValue="modelValue" title="Realizar Pago" @update:modelValue="$emit('update:modelValue', $event)">
    <div v-if="cuota" class="space-y-4">
      <div class="rounded-lg p-4" :style="{ background: 'var(--color-bg)' }">
        <div class="flex justify-between text-sm mb-2">
          <span :style="{ color: 'var(--color-muted)' }">Cuota</span>
          <span :style="{ color: 'var(--color-text)' }">#{{ cuota.numero_cuota }}</span>
        </div>
        <div class="flex justify-between text-sm mb-2">
          <span :style="{ color: 'var(--color-muted)' }">Vencimiento</span>
          <span :style="{ color: 'var(--color-text)' }">{{ formatDate(cuota.fecha_vencimiento) }}</span>
        </div>
        <div class="flex justify-between font-medium">
          <span :style="{ color: 'var(--color-muted)' }">Saldo a pagar</span>
          <span class="font-serif text-lg" :style="{ color: 'var(--color-gold)' }">{{ formatCurrency(cuota.saldo) }}</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text)' }">Método de pago</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="method in methods"
            :key="method.value"
            @click="selectedMethod = method.value"
            class="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 text-center"
            :style="selectedMethod === method.value
              ? { background: 'var(--color-gold)', color: '#1A1812' }
              : { border: '1px solid var(--color-border)', color: 'var(--color-text)', background: 'transparent' }"
          >
            {{ method.label }}
          </button>
        </div>
      </div>

      <button
        @click="handlePagar"
        :disabled="!selectedMethod || loading"
        class="w-full py-3 rounded-xl font-medium text-sm transition-all duration-150 disabled:opacity-50"
        :style="{ background: 'var(--color-gold)', color: '#1A1812' }"
      >
        {{ loading ? 'Procesando...' : 'Confirmar Pago' }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '../ui/Modal.vue'
import { clientePagosApi } from '../../api/cliente/pagos'
import { useToast } from 'vue-toastification'

const props = defineProps({ modelValue: Boolean, cuota: Object })
const emit = defineEmits(['update:modelValue', 'paid'])
const toast = useToast()
const selectedMethod = ref(null)
const loading = ref(false)

const methods = [
  { value: 'pse', label: 'PSE' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'wompi', label: 'Wompi' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function handlePagar() {
  if (!selectedMethod.value || !props.cuota) return
  loading.value = true
  try {
    const { data } = await clientePagosApi.iniciarPago({
      plan_pago_id: props.cuota.id,
      metodo: selectedMethod.value,
    })
    if (data.success) {
      toast.success('Orden de pago creada. Referencia: ' + data.data.referencia)
      emit('update:modelValue', false)
      emit('paid')
    }
  } catch (e) {
    toast.error('Error al procesar el pago')
  } finally {
    loading.value = false
  }
}
</script>
