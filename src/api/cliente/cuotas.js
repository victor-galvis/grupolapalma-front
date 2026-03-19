import api from '../axios'

export const cuotasApi = {
  getAll: () => api.get('/cliente/cuotas'),
}
