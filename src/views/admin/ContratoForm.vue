<template>
  <div class="max-w-2xl space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Nuevo Contrato</h2>
    <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Cliente (ID)</label>
            <input v-model="form.user_id" required type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Lote (ID)</label>
            <input v-model="form.lote_id" required type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Valor del Lote</label>
            <input v-model="form.valor_lote" required type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">N° Cuotas</label>
            <input v-model="form.numero_cuotas" required type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Anticipo Separación</label>
            <input v-model="form.anticipo_separacion" type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Descuento Feria</label>
            <input v-model="form.descuento_feria" type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Otros Descuentos</label>
            <input v-model="form.otros_descuentos" type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Descuento 70% (escrituración)</label>
          <input v-model="form.descuento_restante_70" type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Fecha inicio pagos</label>
          <input v-model="form.fecha_inicio_pagos" required type="date" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" :disabled="loading" class="px-6 py-2 rounded-lg text-sm font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
            {{ loading ? 'Creando...' : 'Crear Contrato' }}
          </button>
          <RouterLink to="/admin/contratos" class="px-6 py-2 rounded-lg text-sm font-medium" :style="{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { contratosApi } from '../../api/admin/contratos'

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const inputStyle = { background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }
const form = ref({
  user_id: '', lote_id: '', valor_lote: '', numero_cuotas: 36,
  anticipo_separacion: 0, descuento_feria: 0, otros_descuentos: 0,
  descuento_restante_70: 0, fecha_inicio_pagos: new Date().toISOString().split('T')[0],
})

async function handleSubmit() {
  loading.value = true
  try {
    const { data } = await contratosApi.create(form.value)
    if (data.success) {
      toast.success('Contrato creado con plan de pagos')
      router.push(`/admin/contratos/${data.data.id}`)
    }
  } catch (e) {
    toast.error('Error al crear contrato')
  } finally {
    loading.value = false
  }
}
</script>
