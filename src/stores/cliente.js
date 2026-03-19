import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clienteDashboardApi } from '../api/cliente/dashboard'
import { cuotasApi } from '../api/cliente/cuotas'

export const useClienteStore = defineStore('cliente', () => {
  const contrato = ref(null)
  const cuotas = ref([])
  const dashboardData = ref(null)
  const loading = ref(false)

  async function fetchDashboard() {
    loading.value = true
    try {
      const { data } = await clienteDashboardApi.getDashboard()
      if (data.success) {
        dashboardData.value = data.data
        contrato.value = data.data.contrato
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchCuotas() {
    const { data } = await cuotasApi.getAll()
    if (data.success) cuotas.value = data.data
  }

  return { contrato, cuotas, dashboardData, loading, fetchDashboard, fetchCuotas }
})
