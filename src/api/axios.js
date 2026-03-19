import axios from 'axios'
import router from '../router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      router.push('/login')
    }

    if (response?.status === 422) {
      const errors = response.data?.errors || {}
      const messages = Object.values(errors).flat()
      import('../main').then(({ toast }) => {
        messages.forEach(msg => toast.error(msg))
      })
    }

    if (response?.status === 500) {
      import('../main').then(({ toast }) => {
        toast.error('Error del servidor. Intenta nuevamente.')
      })
    }

    return Promise.reject(error)
  }
)

export default api
