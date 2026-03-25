<template>
  <div class="max-w-2xl space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Nuevo Contrato</h2>
    <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">

          <!-- Autocomplete Cliente -->
          <div class="relative" ref="clienteRef">
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }"> <span :style="{ color: 'var(--color-red)' }"> * </span>Cliente</label>
            <input
              v-model="clienteSearch"
              @input="onClienteInput"
              @focus="showDropdown = true"
              placeholder="Buscar por nombre o cédula..."
              autocomplete="off"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="[inputStyle, errors.user_id ? errorBorderStyle : {}]"
            />
            <!-- Dropdown clientes -->
            <div
              v-if="showDropdown && clientesFiltrados.length > 0"
              class="absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden"
              :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }"
            >
              <button
                v-for="cliente in clientesFiltrados"
                :key="cliente.id"
                type="button"
                @click="seleccionarCliente(cliente)"
                class="w-full px-3 py-2 text-left text-sm hover:opacity-80 transition-opacity"
                :style="{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }"
              >
                <span class="font-medium">{{ cliente.name }}</span>
                <span class="text-xs ml-2" :style="{ color: 'var(--color-muted)' }">{{ cliente.email }}</span>
              </button>
            </div>
            <!-- Sin resultados clientes -->
            <div
              v-if="showDropdown && clienteSearch.length > 1 && clientesFiltrados.length === 0 && !loadingClientes"
              class="absolute z-50 w-full mt-1 rounded-lg px-3 py-2 text-sm"
              :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }"
            >
              Sin resultados
            </div>
            <p v-if="errors.user_id" class="mt-1 text-xs" :style="{ color: 'var(--color-red)' }">
              {{ errors.user_id }}
            </p>
          </div>

          <!-- Autocomplete Lote -->
          <div class="relative" ref="loteRef">
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }"> 
            <span :style="{ color: 'var(--color-red)' }"> * </span>Lote
            </label>
            <input
              v-model="loteSearch"
              @input="() => { showLoteDropdown = true; if (!loteSearch) form.lote_id = '' }"
              @focus="showLoteDropdown = true"
              placeholder="Buscar lote por nombre..."
              autocomplete="off"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="[inputStyle, errors.lote_id ? errorBorderStyle : {}]"
            />
            <!-- Dropdown lotes -->
            <div
              v-if="showLoteDropdown && lotesFiltrados.length > 0"
              class="absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden"
              :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }"
            >
              <button
                v-for="lote in lotesFiltrados"
                :key="lote.id"
                type="button"
                @click="seleccionarLote(lote)"
                class="w-full px-3 py-2 text-left text-sm hover:opacity-80 transition-opacity"
                :style="{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }"
              >
                <span class="font-medium">{{ lote.nombre }}</span>
                <span class="text-xs ml-2" :style="{ color: 'var(--color-muted)' }">{{ lote.estado }}</span>
              </button>
            </div>
            <!-- Sin resultados lotes -->
            <div
              v-if="showLoteDropdown && loteSearch.length > 0 && lotesFiltrados.length === 0"
              class="absolute z-50 w-full mt-1 rounded-lg px-3 py-2 text-sm"
              :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }"
            >
              Sin resultados
            </div>
            <p v-if="errors.lote_id" class="mt-1 text-xs" :style="{ color: 'var(--color-red)' }">
              {{ errors.lote_id }}
            </p>
          </div>
        </div>

        <!-- Fila 2: Valor del Lote + N° Cuotas -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">
             <span :style="{ color: 'var(--color-red)' }"> * </span>Valor del Lote
             </label>
            <input
              type="text"
              :value="formatCOP(form.valor_lote)"
              @input="onMoneyInput($event, 'valor_lote')"
              @focus="onMoneyFocus($event, 'valor_lote')"
              @blur="onMoneyBlur($event, 'valor_lote')"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="[inputStyle, errors.valor_lote ? errorBorderStyle : {}]"
            />
            <p v-if="errors.valor_lote" class="mt-1 text-xs" :style="{ color: 'var(--color-red)' }">
              {{ errors.valor_lote }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">
             <span :style="{ color: 'var(--color-red)' }"> * </span> N° Cuotas
             </label>
            <input
              v-model="form.numero_cuotas"
              required
              type="number"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="inputStyle"
            />
          </div>
        </div>

        <!-- Fila 3: Descuentos -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Anticipo Separación</label>
            <input
              type="text"
              :value="formatCOP(form.anticipo_separacion)"
              @input="onMoneyInput($event, 'anticipo_separacion')"
              @focus="onMoneyFocus($event, 'anticipo_separacion')"
              @blur="onMoneyBlur($event, 'anticipo_separacion')"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="inputStyle"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Descuento Feria</label>
            <input
              type="text"
              :value="formatCOP(form.descuento_feria)"
              @input="onMoneyInput($event, 'descuento_feria')"
              @focus="onMoneyFocus($event, 'descuento_feria')"
              @blur="onMoneyBlur($event, 'descuento_feria')"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="inputStyle"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Otros Descuentos</label>
            <input
              type="text"
              :value="formatCOP(form.otros_descuentos)"
              @input="onMoneyInput($event, 'otros_descuentos')"
              @focus="onMoneyFocus($event, 'otros_descuentos')"
              @blur="onMoneyBlur($event, 'otros_descuentos')"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="inputStyle"
            />
          </div>
        </div>

        <!-- Fila 4: Descuento 70% + Fecha -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Descuento 70% (escrituración)</label>
            <input
              type="text"
              :value="formatCOP(form.descuento_restante_70)"
              @input="onMoneyInput($event, 'descuento_restante_70')"
              @focus="onMoneyFocus($event, 'descuento_restante_70')"
              @blur="onMoneyBlur($event, 'descuento_restante_70')"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="inputStyle"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Fecha inicio pagos</label>
            <input
              v-model="form.fecha_inicio_pagos"
              required
              type="date"
              class="w-full px-3 py-2 rounded-lg text-sm outline-none"
              :style="inputStyle"
            />
          </div>
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            :style="{ background: 'var(--color-gold)', color: '#1A1812' }"
          >
            {{ loading ? 'Creando...' : 'Crear Contrato' }}
          </button>
          <RouterLink
            to="/admin/contratos"
            class="px-6 py-2 rounded-lg text-sm font-medium"
            :style="{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }"
          >
            Cancelar
          </RouterLink>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { contratosApi } from '../../api/admin/contratos'
import { usuariosApi } from '../../api/admin/usuarios'
import { lotesApi } from '../../api/admin/lotes'

const router = useRouter()
const toast = useToast()
const loading = ref(false)

const inputStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
}

const errorBorderStyle = {
  border: '1px solid var(--color-red)',
}

// ─── Form ────────────────────────────────────────────────────────────────────
const form = ref({
  user_id: '',
  lote_id: '',
  valor_lote: '',
  numero_cuotas: 36,
  anticipo_separacion: 0,
  descuento_feria: 0,
  otros_descuentos: 0,
  descuento_restante_70: 0,
  fecha_inicio_pagos: new Date().toISOString().split('T')[0],
})

// ─── Validación ──────────────────────────────────────────────────────────────
const errors = ref({
  user_id: '',
  lote_id: '',
  valor_lote: '',
})

function validar() {
  errors.value = { user_id: '', lote_id: '', valor_lote: '' }
  let valido = true
  if (!form.value.user_id) {
    errors.value.user_id = 'Selecciona un cliente de la lista'
    valido = false
  }
  if (!form.value.lote_id) {
    errors.value.lote_id = 'Selecciona un lote de la lista'
    valido = false
  }
  if (!form.value.valor_lote) {
    errors.value.valor_lote = 'El valor del lote es requerido'
    valido = false
  }
  return valido
}

// ─── Submit ──────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validar()) return
  loading.value = true
  try {
    const { data } = await contratosApi.create(form.value)
    if (data.success) {
      toast.success('Contrato creado con plan de pagos')
      router.push(`/admin/contratos/${data.data.id}`)
    }
  } catch {
    toast.error('Error al crear contrato')
  } finally {
    loading.value = false
  }
}

// ─── Autocomplete Cliente ─────────────────────────────────────────────────────
const clientes = ref([])
const clienteSearch = ref('')
const showDropdown = ref(false)
const loadingClientes = ref(false)
const clienteRef = ref(null)

const clientesFiltrados = computed(() => {
  if (clienteSearch.value.length < 2) return []
  const q = clienteSearch.value.toLowerCase()
  return clientes.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.cedula && c.cedula.toLowerCase().includes(q)) ||
    c.email.toLowerCase().includes(q)
  )
})

async function cargarClientes() {
  loadingClientes.value = true
  try {
    const { data } = await usuariosApi.getAll()
    clientes.value = data.data || []
  } catch {
    toast.error('Error al cargar clientes')
  } finally {
    loadingClientes.value = false
  }
}

function onClienteInput() {
  showDropdown.value = true
  if (!clienteSearch.value) {
    form.value.user_id = ''
  }
}

function seleccionarCliente(cliente) {
  form.value.user_id = cliente.id
  clienteSearch.value = cliente.name
  showDropdown.value = false
  errors.value.user_id = ''
}

function handleClickOutside(e) {
  if (clienteRef.value && !clienteRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}

// ─── Autocomplete Lote ────────────────────────────────────────────────────────
const lotes = ref([])
const loteSearch = ref('')
const showLoteDropdown = ref(false)
const loteRef = ref(null)

const lotesFiltrados = computed(() => {
  if (loteSearch.value.length < 1) return []
  const q = loteSearch.value.toLowerCase()
  return lotes.value.filter(l => l.nombre.toLowerCase().includes(q))
})

async function cargarLotes() {
  try {
    const { data } = await lotesApi.getAll()
    lotes.value = (data.data || []).filter(l =>
      ['disponible', 'reservado'].includes(l.estado)
    )
  } catch {
    toast.error('Error al cargar lotes')
  }
}

function seleccionarLote(lote) {
  form.value.lote_id = lote.id
  loteSearch.value = lote.nombre
  showLoteDropdown.value = false
  errors.value.lote_id = ''
}

function handleLoteClickOutside(e) {
  if (loteRef.value && !loteRef.value.contains(e.target)) {
    showLoteDropdown.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  cargarClientes()
  cargarLotes()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('click', handleLoteClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('click', handleLoteClickOutside)
})

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
  form.value[field] = raw ? parseInt(raw) : 0
  e.target.value = raw ? formatCOP(parseInt(raw)) : ''
  if (field === 'valor_lote' && raw) errors.value.valor_lote = ''
}

function onMoneyFocus(e, field) {
  e.target.value = form.value[field] || ''
}

function onMoneyBlur(e, field) {
  e.target.value = form.value[field] ? formatCOP(form.value[field]) : ''
}
</script>