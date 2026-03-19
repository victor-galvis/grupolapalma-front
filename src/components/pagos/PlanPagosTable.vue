<template>
  <div class="overflow-x-auto rounded-xl" :style="{ border: '1px solid var(--color-border)' }">
    <table class="w-full text-sm">
      <thead>
        <tr :style="{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }">
          <th class="px-4 py-3 text-left font-medium" :style="{ color: 'var(--color-muted)' }">#</th>
          <th class="px-4 py-3 text-left font-medium" :style="{ color: 'var(--color-muted)' }">Vencimiento</th>
          <th class="px-4 py-3 text-right font-medium" :style="{ color: 'var(--color-muted)' }">Valor</th>
          <th class="px-4 py-3 text-right font-medium" :style="{ color: 'var(--color-muted)' }">Saldo</th>
          <th class="px-4 py-3 text-center font-medium" :style="{ color: 'var(--color-muted)' }">Estado</th>
          <th class="px-4 py-3 text-center font-medium" :style="{ color: 'var(--color-muted)' }">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="cuota in cuotas"
          :key="cuota.id"
          :style="{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }"
        >
          <td class="px-4 py-3 font-medium" :style="{ color: 'var(--color-text)' }">{{ cuota.numero_cuota }}</td>
          <td class="px-4 py-3" :style="{ color: 'var(--color-text)' }">{{ formatDate(cuota.fecha_vencimiento) }}</td>
          <td class="px-4 py-3 text-right font-serif" :style="{ color: 'var(--color-text)' }">{{ formatCurrency(cuota.valor_cuota) }}</td>
          <td class="px-4 py-3 text-right font-serif" :style="{ color: 'var(--color-text)' }">{{ formatCurrency(cuota.saldo) }}</td>
          <td class="px-4 py-3 text-center">
            <StatusBadge :status="cuota.estado" />
          </td>
          <td class="px-4 py-3 text-center">
            <button
              v-if="cuota.estado !== 'pagado'"
              @click="$emit('pagar', cuota)"
              class="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150"
              :style="{ background: 'var(--color-gold)', color: '#1A1812' }"
            >
              Pagar
            </button>
            <span v-else class="text-xs" :style="{ color: 'var(--color-muted)' }">-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import StatusBadge from '../ui/StatusBadge.vue'

defineProps({ cuotas: Array })
defineEmits(['pagar'])

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
