import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const role = ref(localStorage.getItem('role') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'admin')
  const isCliente = computed(() => role.value === 'cliente')

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    if (data.success) {
      token.value = data.data.token
      user.value = data.data.user
      role.value = data.data.role
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('role', data.data.role)
    }
    return data
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (e) {}
    token.value = null
    user.value = null
    role.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  }

  return { token, user, role, isAuthenticated, isAdmin, isCliente, login, logout }
})
