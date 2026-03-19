<template>
  <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
    <h3 class="font-serif font-semibold mb-4" :style="{ color: 'var(--color-text)' }">Resumen del Contrato</h3>
    <div v-if="contrato" class="space-y-3">
      <div v-for="item in items" :key="item.label" class="flex justify-between text-sm">
        <span :style="{ color: 'var(--color-muted)' }">{{ item.label }}</span>
        <span :style="{ color: item.highlight ? 'var(--color-gold)' : 'var(--color-text)' }" class="font-medium">
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ contrato: Object })

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0)
}

const items = computed(() => {
  if (!props.contrato) return []
  return [
    { label: 'Valor total lote', value: formatCurrency(props.contrato.valor_lote) },
    { label: 'Financiación 30%', value: formatCurrency(props.contrato.valor_financiacion_30) },
    { label: 'A financiar (cuotas)', value: formatCurrency(props.contrato.valor_a_financiar), highlight: true },
    { label: 'N° cuotas', value: props.contrato.numero_cuotas + ' meses' },
    { label: 'Cuota mensual', value: formatCurrency(props.contrato.valor_cuota_mensual), highlight: true },
    { label: 'Saldo 70% (escrituración)', value: formatCurrency(props.contrato.valor_restante_70_neto) },
  ]
})
</script>
