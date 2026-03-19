<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :style="badgeStyle">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: String,
})

const configs = {
  pagado: { bg: 'rgba(74,124,89,0.15)', color: 'var(--color-green)', label: 'Pagado' },
  pendiente: { bg: 'rgba(201,120,50,0.15)', color: 'var(--color-orange)', label: 'Pendiente' },
  vencido: { bg: 'rgba(140,58,46,0.15)', color: 'var(--color-red)', label: 'Vencido' },
  parcial: { bg: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)', label: 'Parcial' },
  activo: { bg: 'rgba(74,124,89,0.15)', color: 'var(--color-green)', label: 'Activo' },
  disponible: { bg: 'rgba(74,124,89,0.15)', color: 'var(--color-green)', label: 'Disponible' },
  vendido: { bg: 'rgba(140,58,46,0.15)', color: 'var(--color-red)', label: 'Vendido' },
  reservado: { bg: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)', label: 'Reservado' },
  finalizado: { bg: 'rgba(138,128,112,0.15)', color: 'var(--color-muted)', label: 'Finalizado' },
  cancelado: { bg: 'rgba(140,58,46,0.15)', color: 'var(--color-red)', label: 'Cancelado' },
  proxima: { bg: 'rgba(201,168,76,0.2)', color: 'var(--color-gold)', label: 'Próxima' },
}

const config = computed(() => configs[props.status] || { bg: 'rgba(138,128,112,0.15)', color: 'var(--color-muted)', label: props.status })
const label = computed(() => config.value.label)
const badgeStyle = computed(() => ({ background: config.value.bg, color: config.value.color }))
</script>
