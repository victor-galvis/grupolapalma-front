import api from '../axios'

export const pagosAdminApi = {
  getAll: () => api.get('/admin/pagos'),
  getById: (id) => api.get(`/admin/pagos/${id}`),
  create: (data) => api.post('/admin/pagos', data),
  getAbonos: () => api.get('/admin/abonos'),
  createAbono: (data) => api.post('/admin/abonos', data),
  getDescuentos: () => api.get('/admin/descuentos'),
  createDescuento: (data) => api.post('/admin/descuentos', data),
  deleteDescuento: (id) => api.delete(`/admin/descuentos/${id}`),
}
