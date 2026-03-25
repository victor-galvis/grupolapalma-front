# CLAUDE.md — grupolapalma-front (Frontend)

## 📌 Contexto del Proyecto

Sistema de gestión de pagos inmobiliarios para **Grupo La Palma**, constructora en Envigado, Antioquia, Colombia. Este repositorio contiene el **frontend** construido con Vue 3 + Vite.

El backend API está en `grupolapalma-api` y corre en `https://api.grupolapalma.com.co`.
Este frontend se despliega en `https://clientes.grupolapalma.com.co`.

---

## 🏗️ Stack Tecnológico

- **Framework**: Vue 3 + Vite
- **Estado global**: Pinia
- **Routing**: Vue Router 4
- **HTTP**: Axios con interceptors
- **Estilos**: Tailwind CSS v3
- **Iconos**: @heroicons/vue
- **Notificaciones**: Vue Toastification
- **Utilidades**: @vueuse/core
- **Dark mode**: Tailwind class strategy + localStorage
- **Fuentes**: Cormorant Garamond + DM Sans (Google Fonts)
- **JavaScript**: JS vanilla (sin TypeScript)

---

## 🎨 Sistema de Diseño

### Colores — CSS Variables

```css
/* Modo claro (:root) */
--color-bg:         #F5F0E8;
--color-surface:    #FFFFFF;
--color-sidebar:    #1A1812;   /* sidebar siempre oscuro */
--color-text:       #1A1812;
--color-muted:      #8A8070;
--color-gold:       #C9A84C;
--color-gold-light: #E8D08A;
--color-gold-dark:  #8C6D28;
--color-border:     rgba(26,24,18,0.1);
--color-green:      #4A7C59;
--color-red:        #8C3A2E;
--color-orange:     #C97832;

/* Modo oscuro (.dark) */
--color-bg:         #1A1812;
--color-surface:    #2C2820;
--color-sidebar:    #0F0E0A;
--color-text:       #F5F0E8;
--color-muted:      #6B6055;
--color-gold:       #E8D08A;
--color-gold-light: #F5E8B0;
--color-gold-dark:  #C9A84C;
--color-border:     rgba(255,255,255,0.08);
--color-green:      #7DC89A;
--color-red:        #E07A6E;
--color-orange:     #E8A870;
```

### Tipografía
- **Títulos y números grandes**: `Cormorant Garamond` (Google Fonts)
- **Texto general**: `DM Sans` (Google Fonts)

### Dark Mode
- Estrategia: clase `dark` en el `<html>`
- Toggle guardado en `localStorage` con key `theme`
- Implementado en `stores/theme.js`

---

## 📁 Estructura de Carpetas

```
grupolapalma-front/
├── src/
│   ├── api/
│   │   ├── axios.js              ← instancia base + interceptors
│   │   ├── auth.js
│   │   ├── admin/
│   │   │   ├── usuarios.js
│   │   │   ├── lotes.js
│   │   │   ├── contratos.js
│   │   │   ├── pagos.js
│   │   │   └── reportes.js
│   │   └── cliente/
│   │       ├── dashboard.js
│   │       ├── cuotas.js
│   │       └── pagos.js
│   ├── stores/
│   │   ├── auth.js               ← token, user, role
│   │   ├── theme.js              ← dark/light mode
│   │   └── cliente.js            ← contrato activo, cuotas
│   ├── router/
│   │   └── index.js              ← guards por rol
│   ├── views/
│   │   ├── auth/
│   │   │   └── Login.vue
│   │   ├── admin/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Usuarios.vue
│   │   │   ├── UsuarioForm.vue
│   │   │   ├── Lotes.vue
│   │   │   ├── LoteForm.vue
│   │   │   ├── Contratos.vue
│   │   │   ├── ContratoForm.vue
│   │   │   ├── ContratoDetalle.vue
│   │   │   └── Reportes.vue
│   │   └── cliente/
│   │       ├── Dashboard.vue     ← replica el mockup
│   │       ├── MisCuotas.vue
│   │       ├── Historial.vue
│   │       └── Notificaciones.vue
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.vue     ← layout principal con sidebar
│   │   │   ├── Sidebar.vue       ← fondo #1A1812, logo LP dorado
│   │   │   ├── Topbar.vue        ← con toggle dark mode
│   │   │   └── AdminLayout.vue
│   │   ├── ui/
│   │   │   ├── StatCard.vue
│   │   │   ├── StatusBadge.vue
│   │   │   ├── DataTable.vue
│   │   │   ├── Modal.vue
│   │   │   ├── ThemeToggle.vue   ← botón sol/luna
│   │   │   └── LoadingSpinner.vue
│   │   └── pagos/
│   │       ├── ProgresoCircular.vue
│   │       ├── PlanPagosTable.vue
│   │       ├── ModalPago.vue
│   │       ├── ProximoPago.vue
│   │       └── ResumenContrato.vue
│   ├── main.js
│   └── style.css
├── .env
├── .env.example
├── index.html
└── vite.config.js
```

---

## 🔐 Variables de Entorno (.env)

```env
VITE_API_URL=https://api.grupolapalma.com.co/api
VITE_WOMPI_PUBLIC_KEY=
VITE_APP_NAME="Grupo La Palma"
```

---

## 🔄 Axios — Configuración (src/api/axios.js)

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Request: añadir token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response: manejo de errores global
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 🛣️ Router Guards (src/router/index.js)

```
/           → redirige a /login si no autenticado
/login      → si autenticado, redirige según role:
                admin   → /admin/dashboard
                cliente → /cliente/dashboard
/admin/*    → solo role:admin, sino → /login
/cliente/*  → solo role:cliente, sino → /login
```

---

## 🖥️ Dashboard Cliente — Diseño (replica del mockup)

El `cliente/Dashboard.vue` debe mostrar exactamente:

### 1. Sidebar
- Fondo siempre oscuro `#1A1812` (no cambia con dark mode)
- Logo: cuadro dorado con letras "LP" + texto "Grupo La Palma"
- Nav items: Resumen, Plan de Pagos, Historial, Documentos, Mensajes
- Item activo: fondo dorado tenue + línea dorada izquierda
- Footer: avatar del usuario + nombre + rol

### 2. Topbar
- Título: "Bienvenido, {nombre}"
- Subtítulo: fecha actual + lote asignado
- Botones: "Realizar Pago" (ghost) + "Descargar Estado" (dorado)
- Toggle dark/light mode (sol/luna)

### 3. Tarjeta del Inmueble (PropertyHero)
- Fondo oscuro `#1A1812`
- Emoji/imagen del lote
- Badge verde "Activo · En Financiación"
- Nombre del lote y proyecto
- Detalles: área m², valor total, cuota inicial, saldo financiado, fecha compra
- Progreso circular dorado con % pagado del 30%

### 4. Stat Cards (4 tarjetas)
- Total Pagado (acento dorado)
- Cuotas Pagadas X/30 (acento verde)
- Saldo Pendiente (acento naranja)
- Próximo Vencimiento (acento rojo)

### 5. Tabla de Cuotas
- Columnas: #, Vencimiento, Valor, Estado, Acción
- Estados con badges de color:
  - `pagado` → verde
  - `proximo` → dorado (borde)
  - `pendiente` → naranja
  - `vencido` → rojo
- Botón "Pagar" solo habilitado en la cuota próxima/activa
- Scroll interno máximo 400px

### 6. Panel Próximo Pago (columna derecha)
- Fondo oscuro
- Tag "⏱ Próximo Pago"
- Número de cuota y valor
- Fecha de vencimiento
- Countdown: días / horas / minutos
- Botón principal "Pagar Ahora" (dorado)
- Botones secundarios: PSE / Tarjeta / Wompi

### 7. Modal de Pago
- Header oscuro con título y botón cerrar
- Resumen: cliente, lote, cuota, fecha vencimiento
- Total destacado
- Selección de método: PSE / Tarjeta / Wompi (grid 3 columnas)
- Botón "Proceder al Pago Seguro"
- Nota de seguridad SSL

### 8. Barra de Progreso
- Track con fill dorado
- Punto indicador en posición actual
- Labels: fecha inicio / % actual / fecha fin

---

## 🖥️ Dashboard Admin — Diseño

El `admin/Dashboard.vue` debe mostrar:

- **4 métricas**: clientes activos, recaudado este mes, cuotas vencidas, contratos activos
- **Tabla de contratos recientes** con filtros por estado
- **Accesos rápidos**: nuevo contrato, registrar pago, reporte de cartera
- **Alertas**: cuotas vencidas destacadas en rojo

---

## 📋 Convenciones de Código

- Composition API con `<script setup>` en todos los componentes
- Nombres de componentes en PascalCase
- Nombres de archivos de vistas en PascalCase
- Variables y funciones en camelCase
- Emits documentados con `defineEmits`
- Props documentadas con `defineProps`
- Llamadas a la API siempre en los stores o en el archivo correspondiente de `src/api/`
- Los componentes de vistas NO hacen llamadas directas a Axios
- Manejo de loading y error en cada vista
- Formateo de pesos colombianos:
```javascript
const formatCOP = (valor) => 
  new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP',
    minimumFractionDigits: 0 
  }).format(valor)
```

---

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 🌐 Despliegue en cPanel

El build de producción (`npm run build`) genera la carpeta `dist/`.
Subir el contenido de `dist/` al subdominio `clientes.grupolapalma.com.co` en cPanel.
Agregar archivo `.htaccess` en la raíz para SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```