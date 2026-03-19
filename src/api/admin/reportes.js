import api from '../axios'

export const reportesApi = {
  dashboard: () => api.get('/admin/dashboard'),
  cartera: () => api.get('/admin/reportes/cartera'),
  pagosMes: () => api.get('/admin/reportes/pagos-mes'),
  cuotasVencidas: () => api.get('/admin/reportes/cuotas-vencidas'),
}
