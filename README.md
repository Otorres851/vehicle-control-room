<img width="1774" height="887" alt="Image" src="https://github.com/user-attachments/assets/50208e7e-3569-47ab-922a-f65ec0be4a6f" />

# 🚗 Vehicle Control Room

Monitor de vehículo en tiempo real desarrollado como prueba técnica para el rol de **Design Engineer (UX/UI)**.

La aplicación se conecta a Traccar para autenticar usuarios, obtener dispositivos disponibles y visualizar telemetría GPS en tiempo real mediante una interfaz moderna, accesible y responsive.

---

## 🌐 Demo

### Aplicación desplegada

👉 [URL de Vercel o Netlify]

### Repositorio

👉 [https://github.com/Otorres851]

---

## ✨ Características

- Autenticación contra Traccar.
- Consulta de dispositivos disponibles.
- Selección dinámica de vehículos.
- Telemetría GPS en tiempo real.
- Mapa interactivo con Leaflet.
- Marker Smoothing mediante interpolación.
- Skeleton Loading States.
- Error States con botón Retry.
- Modo oscuro / claro.
- Internacionalización Español / Inglés.
- Diseño responsive.
- Accesibilidad WCAG 2.1 AA.

---

## 🛠 Tecnologías Utilizadas

- React
- TypeScript
- Vite
- Sass Modules
- TanStack Query
- React Leaflet
- Leaflet
- Framer Motion
- Lucide React
- i18next
- pnpm

---

## 🚀 Instalación Local

```bash
git clone https://github.com/Otorres851/vehicle-control-room.git
cd vehicle-control-room
```

Instalar dependencias:

```bash
pnpm install
```

Ejecutar entorno de desarrollo:

```bash
pnpm dev
```

Aplicación disponible en:

```txt
http://localhost:5173
```

---

## 📦 Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm preview
```

---

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_TRACCAR_BASE_URL=https://demo4.traccar.org
VITE_TRACCAR_EMAIL=your-email@example.com
VITE_TRACCAR_PASSWORD=your-password
```

### Descripción

Traccar demo no trae datos de muestra predefinidos, debes registrarte y usar un GPS traker o la app de traccar client en tu
Smartphone para generar posiciones reales.

| Variable              | Descripción                                |
| --------------------- | ------------------------------------------ |
| VITE_TRACCAR_BASE_URL | URL base del servidor Traccar              |
| VITE_TRACCAR_EMAIL    | Correo que utilices para autenticación     |
| VITE_TRACCAR_PASSWORD | Contraseña que utilices para autenticación |

> No incluyas credenciales reales en el repositorio.

### .env.example

```env
VITE_TRACCAR_BASE_URL=https://demo4.traccar.org
VITE_TRACCAR_EMAIL=your-email@example.com
VITE_TRACCAR_PASSWORD=your-password
```

---

## 🛰 Endpoints Utilizados

| Método | Endpoint       | Uso                                     |
| ------ | -------------- | --------------------------------------- |
| POST   | /api/session   | Autenticación                           |
| GET    | /api/devices   | Obtener vehículos                       |
| GET    | /api/positions | Obtener posiciones GPS haciendo polling |

---

## ♿ Accesibilidad

- HTML semántico.
- Navegación por teclado.
- Etiquetas ARIA.
- Focus visible.
- aria-live.
- role="alert" para errores.

---

## 🌍 Internacionalización

- Español
- Inglés

---

## 📁 Estructura del Proyecto

```txt
src
├── api
├── assets
│   └── images
├── features
│   └── vehicle-monitor
│       ├── components
│       ├── hooks
│       └── utils
├── hooks
├── i18n
├── styles
│   └── abstracts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## ✅ Validación

```bash
pnpm lint
pnpm build
```

---

## 📄 Licencia

Proyecto desarrollado exclusivamente con fines de evaluación técnica.
