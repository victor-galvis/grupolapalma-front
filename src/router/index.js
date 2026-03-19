import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { guest: true },
  },
  // Admin routes
  {
    path: '/admin',
    component: () => import('../components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'usuarios', name: 'Usuarios', component: () => import('../views/admin/Usuarios.vue') },
      { path: 'usuarios/nuevo', name: 'NuevoUsuario', component: () => import('../views/admin/UsuarioForm.vue') },
      { path: 'usuarios/:id/editar', name: 'EditarUsuario', component: () => import('../views/admin/UsuarioForm.vue') },
      { path: 'lotes', name: 'Lotes', component: () => import('../views/admin/Lotes.vue') },
      { path: 'lotes/nuevo', name: 'NuevoLote', component: () => import('../views/admin/LoteForm.vue') },
      { path: 'lotes/:id/editar', name: 'EditarLote', component: () => import('../views/admin/LoteForm.vue') },
      { path: 'contratos', name: 'Contratos', component: () => import('../views/admin/Contratos.vue') },
      { path: 'contratos/nuevo', name: 'NuevoContrato', component: () => import('../views/admin/ContratoForm.vue') },
      { path: 'contratos/:id', name: 'ContratoDetalle', component: () => import('../views/admin/ContratoDetalle.vue') },
      { path: 'reportes', name: 'Reportes', component: () => import('../views/admin/Reportes.vue') },
    ],
  },
  // Cliente routes
  {
    path: '/cliente',
    component: () => import('../components/layout/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'cliente' },
    children: [
      { path: '', redirect: '/cliente/dashboard' },
      { path: 'dashboard', name: 'ClienteDashboard', component: () => import('../views/cliente/Dashboard.vue') },
      { path: 'cuotas', name: 'MisCuotas', component: () => import('../views/cliente/MisCuotas.vue') },
      { path: 'historial', name: 'Historial', component: () => import('../views/cliente/Historial.vue') },
      { path: 'notificaciones', name: 'Notificaciones', component: () => import('../views/cliente/Notificaciones.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.guest && authStore.isAuthenticated) {
    if (authStore.isAdmin) return next('/admin/dashboard')
    if (authStore.isCliente) return next('/cliente/dashboard')
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.role && authStore.role !== to.meta.role) {
    if (authStore.isAdmin) return next('/admin/dashboard')
    if (authStore.isCliente) return next('/cliente/dashboard')
    return next('/login')
  }

  next()
})

export default router
