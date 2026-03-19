import api from '../axios'

export const usuariosApi = {
  getAll: () => api.get('/admin/usuarios'),
  getById: (id) => api.get(`/admin/usuarios/${id}`),
  create: (data) => api.post('/admin/usuarios', data),
  update: (id, data) => api.put(`/admin/usuarios/${id}`, data),
  delete: (id) => api.delete(`/admin/usuarios/${id}`),
}
