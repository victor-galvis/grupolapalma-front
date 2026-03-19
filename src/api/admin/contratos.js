import api from '../axios'

export const contratosApi = {
  getAll: () => api.get('/admin/contratos'),
  getById: (id) => api.get(`/admin/contratos/${id}`),
  create: (data) => api.post('/admin/contratos', data),
  update: (id, data) => api.put(`/admin/contratos/${id}`, data),
  getPlanPagos: (id) => api.get(`/admin/contratos/${id}/plan-pagos`),
  generarPlan: (id) => api.post(`/admin/contratos/${id}/generar-plan`),
}
