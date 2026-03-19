<template>
  <div class="max-w-lg space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ isEdit ? 'Editar Lote' : 'Nuevo Lote' }}</h2>
    <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Código</label>
            <input v-model="form.codigo" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Nombre</label>
            <input v-model="form.nombre" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Proyecto</label>
          <input v-model="form.proyecto" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Etapa</label>
            <input v-model="form.etapa" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Área m²</label>
            <input v-model="form.area_m2" type="number" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Valor Total (COP)</label>
          <input v-model="form.valor_total" type="number" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Fecha Estimada de Entrega</label>
          <input v-model="form.fecha_estimada_entrega" type="date" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Estado</label>
          <select v-model="form.estado" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle">
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" :disabled="loading" class="px-6 py-2 rounded-lg text-sm font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <RouterLink to="/admin/lotes" class="px-6 py-2 rounded-lg text-sm font-medium" :style="{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { lotesApi } from '../../api/admin/lotes'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const form = ref({ codigo: '', nombre: '', proyecto: '', etapa: '', area_m2: '', valor_total: '', fecha_estimada_entrega: '', estado: 'disponible' })
const inputStyle = { background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await lotesApi.getById(route.params.id)
    if (data.success) form.value = { ...data.data }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await lotesApi.update(route.params.id, form.value)
      toast.success('Lote actualizado')
    } else {
      await lotesApi.create(form.value)
      toast.success('Lote creado')
    }
    router.push('/admin/lotes')
  } catch (e) {
    toast.error('Error al guardar')
  } finally {
    loading.value = false
  }
}
</script>
