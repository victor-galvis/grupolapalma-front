<template>
  <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
    <h3 class="font-serif font-semibold text-lg mb-4" :style="{ color: 'var(--color-text)' }">Próximo Pago</h3>

    <div v-if="cuota" class="space-y-4">
      <div class="text-center py-4">
        <p class="text-3xl font-serif font-bold" :style="{ color: 'var(--color-gold)' }">
          {{ formatCurrency(cuota.saldo) }}
        </p>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-muted)' }">
          Cuota {{ cuota.numero_cuota }} · {{ formatDate(cuota.fecha_vencimiento) }}
        </p>
      </div>

      <!-- Countdown -->
      <div v-if="daysLeft !== null" class="text-center">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          :style="daysLeft <= 0
            ? { background: 'rgba(140,58,46,0.15)', color: 'var(--color-red)' }
            : daysLeft <= 5
              ? { background: 'rgba(201,120,50,0.15)', color: 'var(--color-orange)' }
              : { background: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)' }"
        >
          <span v-if="daysLeft <= 0">Vencida hace {{ Math.abs(daysLeft) }} días</span>
          <span v-else>{{ daysLeft }} días restantes</span>
        </div>
      </div>

      <div class="space-y-2">
        <button
          @click="$emit('pagar', 'pse')"
          class="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-150"
          :style="{ background: 'var(--color-gold)', color: '#1A1812' }"
        >
          Pagar por PSE
        </button>
        <button
          @click="$emit('pagar', 'tarjeta')"
          class="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-150"
          :style="{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)', background: 'transparent' }"
        >
          Pagar con Tarjeta
        </button>
        <button
          @click="$emit('pagar', 'wompi')"
          class="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-150"
          :style="{ border: '1px solid var(--color-border)', color: 'var(--color-muted)', background: 'transparent' }"
        >
          Pagar con Wompi
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p :style="{ color: 'var(--color-muted)' }">No hay cuotas pendientes</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ cuota: Object })
defineEmits(['pagar'])

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

const daysLeft = computed(() => {
  if (!props.cuota?.fecha_vencimiento) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(props.cuota.fecha_vencimiento)
  return Math.round((due - today) / (1000 * 60 * 60 * 24))
})
</script>
