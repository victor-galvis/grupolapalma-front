<template>
  <div class="min-h-screen flex items-center justify-center p-4" :style="{ background: 'var(--color-bg)' }">
    <!-- Theme toggle in corner -->
    <div class="fixed top-4 right-4">
      <ThemeToggle />
    </div>

    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center font-serif font-bold text-2xl mx-auto mb-4" style="background: var(--color-gold); color: #1A1812;">
          LP
        </div>
        <h1 class="text-3xl font-serif font-semibold" :style="{ color: 'var(--color-text)' }">Grupo La Palma</h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-muted)' }">Portal de Pagos Inmobiliarios</p>
      </div>

      <!-- Form -->
      <div class="rounded-2xl p-8 shadow-sm" :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
        <h2 class="text-xl font-serif font-semibold mb-6" :style="{ color: 'var(--color-text)' }">Iniciar Sesión</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">Correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
              :style="{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
              :style="{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }"
            />
          </div>

          <div v-if="error" class="text-sm p-3 rounded-lg" :style="{ background: 'rgba(140,58,46,0.1)', color: 'var(--color-red)' }">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl font-medium text-sm transition-all duration-150 disabled:opacity-60 mt-2"
            :style="{ background: 'var(--color-gold)', color: '#1A1812' }"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs mt-6" :style="{ color: 'var(--color-muted)' }">
        Grupo La Palma © {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import ThemeToggle from '../../components/ui/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  loading.value = true
  error.value = null
  try {
    const data = await authStore.login(form.value)
    if (data.success) {
      if (data.data.role === 'admin') router.push('/admin/dashboard')
      else router.push('/cliente/dashboard')
    } else {
      error.value = data.message
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
