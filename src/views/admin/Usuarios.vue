<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Usuarios</h2>
      <RouterLink to="/admin/usuarios/nuevo" class="px-4 py-2 rounded-lg text-sm font-medium" :style="{ background: 'var(--color-gold)', color: '#1A1812' }">
        Nuevo Usuario
      </RouterLink>
    </div>
    <LoadingSpinner v-if="loading" />
    <DataTable v-else :columns="columns" :data="usuarios">
      <template #roles="{ row }">
        <StatusBadge :status="row.roles?.[0]?.name || 'cliente'" />
      </template>
      <template #active="{ value }">
        <StatusBadge :status="value ? 'activo' : 'cancelado'" />
      </template>
      <template #acciones="{ row }">
        <RouterLink :to="`/admin/usuarios/${row.id}/editar`" class="text-xs mr-2" :style="{ color: 'var(--color-gold)' }">Editar</RouterLink>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usuariosApi } from '../../api/admin/usuarios'
import DataTable from '../../components/ui/DataTable.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const usuarios = ref([])
const loading = ref(false)
const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'roles', label: 'Rol' },
  { key: 'active', label: 'Estado' },
  { key: 'acciones', label: '' },
]

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await usuariosApi.getAll()
    if (data.success) usuarios.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
