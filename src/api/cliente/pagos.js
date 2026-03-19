import api from '../axios'

export const clientePagosApi = {
  getAll: () => api.get('/cliente/pagos'),
  iniciarPago: (data) => api.post('/cliente/pagar', data),
}
