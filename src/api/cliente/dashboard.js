import api from '../axios'

export const clienteDashboardApi = {
  getDashboard: () => api.get('/cliente/dashboard'),
  getContrato: () => api.get('/cliente/contrato'),
  getNotificaciones: () => api.get('/cliente/notificaciones'),
  marcarLeida: (id) => api.put(`/cliente/notificaciones/${id}/leer`),
}
