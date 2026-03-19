import api from '../axios'

export const lotesApi = {
  getAll: () => api.get('/admin/lotes'),
  getById: (id) => api.get(`/admin/lotes/${id}`),
  create: (data) => api.post('/admin/lotes', data),
  update: (id, data) => api.put(`/admin/lotes/${id}`, data),
  delete: (id) => api.delete(`/admin/lotes/${id}`),
}
