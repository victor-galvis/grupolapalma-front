<template>
  <div class="max-w-lg space-y-6">
    <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

    <div class="rounded-xl p-6" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Nombre</label>
          <input v-model="form.name" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Email</label>
          <input v-model="form.email" type="email" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
        </div>
        <div v-if="!isEdit">
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Contraseña</label>
          <input v-model="form.password" type="password" required class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Teléfono</label>
          <input v-model="form.phone" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Cédula</label>
          <input v-model="form.cedula" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">Rol</label>
          <select v-model="form.role" class="w-full px-3 py-2 rounded-lg text-sm outline-none" :style="{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }">
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" :disabled="loading" class="px-6 py-2 rounded-lg text-sm font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
          <RouterLink to="/admin/usuarios" class="px-6 py-2 rounded-lg text-sm font-medium" :style="{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { usuariosApi } from '../../api/admin/usuarios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const form = ref({ name: '', email: '', password: '', phone: '', cedula: '', role: 'cliente' })

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await usuariosApi.getById(route.params.id)
    if (data.success) {
      const u = data.data
      form.value = { name: u.name, email: u.email, phone: u.phone, cedula: u.cedula, role: u.roles?.[0]?.name || 'cliente' }
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await usuariosApi.update(route.params.id, form.value)
      toast.success('Usuario actualizado')
    } else {
      await usuariosApi.create(form.value)
      toast.success('Usuario creado')
    }
    router.push('/admin/usuarios')
  } catch (e) {
    toast.error('Error al guardar')
  } finally {
    loading.value = false
  }
}
</script>
