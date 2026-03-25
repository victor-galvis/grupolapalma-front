<template>
  <div class="max-w-lg space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ isEdit ? 'Editar Lote' : 'Nuevo Lote' }}</h2>
    <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <form @submit.prevent="handleSubmit" class="space-y-4">

        <!-- Fila 1: Código + Nombre -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">
              Código <span :style="{ color: 'var(--color-red)' }">*</span>
            </label>
            <input
              v-model="form.codigo"
              required
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="[inputStyle, errors.codigo ? errorBorderStyle : {}]"
              @input="errors.codigo = ''"
            />
            <p v-if="errors.codigo" class="mt-1 text-xs" :style="{ color: 'var(--color-red)' }">
              {{ errors.codigo }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">
              Nombre <span :style="{ color: 'var(--color-red)' }">*</span>
            </label>
            <input v-model="form.nombre" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
          </div>
        </div>

        <!-- Proyecto -->
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">
            Proyecto <span :style="{ color: 'var(--color-red)' }">*</span>
          </label>
          <input v-model="form.proyecto" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>

        <!-- Fila 2: Etapa + Área -->
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

        <!-- Valor Total -->
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">
            Valor Total <span :style="{ color: 'var(--color-red)' }">*</span>
          </label>
          <input
            type="text"
            :value="formatCOP(form.valor_total)"
            @input="onMoneyInput($event, 'valor_total')"
            @focus="onMoneyFocus($event, 'valor_total')"
            @blur="onMoneyBlur($event, 'valor_total')"
            class="w-full px-3 py-2 rounded-lg text-sm outline-none"
            :style="[inputStyle, errors.valor_total ? errorBorderStyle : {}]"
          />
          <p v-if="errors.valor_total" class="mt-1 text-xs" :style="{ color: 'var(--color-red)' }">
            {{ errors.valor_total }}
          </p>
        </div>

        <!-- Fecha Estimada de Entrega -->
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Fecha Estimada de Entrega</label>
          <input v-model="form.fecha_estimada_entrega" type="date" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle" />
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Estado</label>
          <select v-model="form.estado" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="inputStyle">
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-2">
          <button type="submit" :disabled="loading" class="px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
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

const form = ref({
  codigo: '',
  nombre: '',
  proyecto: '',
  etapa: '',
  area_m2: '',
  valor_total: '',
  fecha_estimada_entrega: '',
  estado: 'disponible',
})

const inputStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
}

const errorBorderStyle = {
  border: '1px solid var(--color-red)',
}

// ─── Validación ──────────────────────────────────────────────────────────────
const errors = ref({
  codigo: '',
  valor_total: '',
})

function validar() {
  errors.value = { codigo: '', valor_total: '' }
  let valido = true
  if (!form.value.valor_total) {
    errors.value.valor_total = 'El valor total es requerido'
    valido = false
  }
  return valido
}

// ─── Formateo COP ─────────────────────────────────────────────────────────────
const formatCOP = (valor) => {
  if (!valor && valor !== 0) return ''
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(valor)
}

function onMoneyInput(e, field) {
  const raw = e.target.value.replace(/\D/g, '')
  form.value[field] = raw ? parseInt(raw) : ''
  e.target.value = raw ? formatCOP(parseInt(raw)) : ''
  if (field === 'valor_total' && raw) errors.value.valor_total = ''
}

function onMoneyFocus(e, field) {
  e.target.value = form.value[field] || ''
}

function onMoneyBlur(e, field) {
  e.target.value = form.value[field] ? formatCOP(form.value[field]) : ''
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (isEdit.value) {
    const { data } = await lotesApi.getById(route.params.id)
    if (data.success) form.value = { ...data.data }
  }
})

// ─── Submit ──────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validar()) return
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
    const backendErrors = e.response?.data?.errors
    if (backendErrors?.codigo) {
      errors.value.codigo = 'Este código ya está en uso, elige otro'
    } else {
      toast.error('Error al guardar')
    }
  } finally {
    loading.value = false
  }
}
</script>