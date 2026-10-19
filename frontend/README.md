# DevBoard — Frontend (Single Page Application Kanban)

Aplicación Single Page Application (SPA) para la gestión ágil de flujos de trabajo basada en la jerarquía **Tablero (Board) $\rightarrow$ Columna (Column) $\rightarrow$ Tarea (Ticket)**. Desarrollada bajo la metodología **Desarrollo Basado en Especificaciones (SDD)** e inspirada en el sistema de diseño **Silicon Valley Retro-Tech**.

---

## 1. Decisiones Arquitectónicas y Patrones de Diseño

### 1.1 Separación Estricta: Smart (Views) vs. Dummy (Presentational)
Para evitar componentes monolíticos y garantizar mantenibilidad, testeabilidad y desacoplamiento de la interfaz:
- **Componentes Presentacionales Atómicos (`src/components` / `src/features`):**
  - Componentes puros (`Button`, `Input`, `Textarea`, `Select`, `Badge`, `Modal`, `TicketCard`, `ColumnContainer`, `BoardCard`).
  - **Restricción estricta:** Tienen **prohibido utilizar `useEffect`** para carga de datos o invocar peticiones HTTP (`fetch`/`axios`). Reciben datos únicamente vía `props` y emiten eventos a través de callbacks (`onClick`, `onEdit`, `onDelete`).
- **Componentes Contenedores / Páginas (`src/pages`):**
  - Orquestan el ciclo de vida de la vista, extraen parámetros de ruta (`useParams`), consumen los servicios (`src/api`) y mantienen los estados de interfaz (`isLoading`, `error`, `data`).

### 1.2 Control de Concurrencia y Optimistic UI con Rollback
Para brindar una experiencia de usuario instantánea al mover tickets entre columnas y reordenarlos:
1. **Mutación Optimista Local:** Al soltar un ticket (`onDragEnd`), se genera un respaldo inmutable (`structuredClone(board)`) y se actualiza el estado local de React inmediatamente.
2. **Sincronización en Segundo Plano:** Se ejecuta `ticketService.updateTicket` (`PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId`).
3. **Rollback Automático:** Si el servidor responde con error (`400`, `404` o `500`), el estado se revierte instantáneamente al respaldo previo (`setBoard(previousBoard)`) y se dispara una alerta emergente flotante (`Toast`) informando el motivo del fallo.

### 1.3 Límite Negativo de Enrutamiento (React Router DOM)
- Se prohíbe el uso de componentes `<Link>` para acciones de mutación (crear, editar o eliminar tableros, columnas o tickets).
- La navegación programática (`useNavigate`) se ejecuta **únicamente después** de que la API REST haya respondido de forma exitosa (`200 OK` / `201 Created`).

### 1.4 Formularios y Validación en Cliente vs. Servidor
- Formularios controlados con **React Hook Form (RHF)** y esquemas declarativos **Zod**.
- **Mapeo de errores de backend:** Los errores devueltos por la API (ej. `400 Bad Request` por título duplicado o inválido) se capturan y mapean directamente sobre el input correspondiente (`setError`) sin recargar la página.
- **Feedback de carga (UX):** Todo botón de envío se deshabilita inmediatamente (`disabled={isSubmitting}`) y muestra un `Spinner` mientras la petición HTTP está en curso.

---

## 2. Sistema de Diseño: Silicon Valley Retro-Tech

La identidad visual rinde homenaje a las terminales y sistemas clásicos de Silicon Valley (paletas tipo Solarized):

### 2.1 Paleta Semántica de Tokens CSS

| Token CSS | Rol en la Interfaz | Light Mode (Crema Cálido) | Dark Mode (Petróleo Retro) |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | Fondo principal de la SPA | `#FDF6E3` | `#002B36` |
| `--bg-card` | Superficie de tarjetas y modales | `#EEE8D5` | `#073642` |
| `--text-primary` | Texto principal y encabezados | `#073642` | `#839496` |
| `--text-muted` | Textos secundarios y metadatos | `#586E75` | `#93A1A1` |
| `--accent-color` | Acentos, foco y CTAs | `#CB4B16` (Ladrillo) | `#2AA198` (Cian retro) |
| `--border-color` | Bordes estructurados | `#D3CBB7` | `#0E4856` |
| `--danger-color` | Alertas destructivas y errores | `#DC322F` | `#DC322F` |
| `--warning-color` | Advertencias de prioridad media | `#B58900` | `#B58900` |
| `--success-color` | Confirmaciones exitosas | `#859900` | `#859900` |

### 2.2 Tipografía y Prevención de Parpadeo (Anti-FOUC)
- **JetBrains Mono:** Utilizada obligatoriamente para identificadores técnicos de tickets (`#TK-XXXX`), contadores de columnas `[N]`, métricas y alertas del sistema.
- **Plus Jakarta Sans:** Empleada para textos generales, inputs y botones.
- **Script síncrono anti-FOUC:** Inyectado en `<head>` de `index.html` para leer `localStorage.getItem('theme')` y `matchMedia('(prefers-color-scheme: dark)')` antes del primer pintado, eliminando cualquier parpadeo de estilos al recargar (`F5`).

---

## 3. Stack Tecnológico y Dependencias

| Tecnología / Librería | Versión | Justificación Técnica |
| :--- | :---: | :--- |
| **React** | `18.3.1` | Core de la aplicación, concurrencia y compatibilidad 100% con librerías de drag & drop. |
| **Vite** | `5.4.11` | Empaquetador ultrarrápido con HMR y compilación optimizada en producción. |
| **React Router DOM** | `6.28.1` | Enrutamiento declarativo para SPA con soporte de rutas anidadas y guardias protegidas. |
| **Axios** | `1.7.9` | Cliente HTTP centralizado con interceptores de autenticación y normalización de errores. |
| **React Hook Form** | `7.54.2` | Manejo de formularios de alto rendimiento sin re-renderizados innecesarios. |
| **Zod** + **@hookform/resolvers** | `3.24.1` / `3.9.1` | Validación declarativa de esquemas con tipado e inferencia segura en formularios. |
| **@hello-pangea/dnd** | `17.0.0` | Fork moderno y mantenido de react-beautiful-dnd para drag and drop accesible. |
| **Lucide React** | `0.469.0` | Iconografía técnica, minimalista y visualmente consistente con Retro-Tech. |
| **Tailwind CSS** + **PostCSS** | `3.4.17` | Utilidades de estilizado configuradas sobre variables CSS nativas (`darkMode: 'class'`). |

---

## 4. Estructura del Proyecto (`src/`)

```text
frontend/src/
├── api/                  # Capa de red desacoplada (Axios, servicios REST y datos sintéticos)
│   ├── client.js         # Instancia centralizada con interceptores y normalización de errores
│   ├── boardService.js   # Integración con /api/boards
│   ├── columnService.js  # Integración con /api/boards/:boardId/columns
│   ├── ticketService.js  # Integración con /api/boards/:boardId/columns/:columnId/tickets
│   ├── mockData.js       # Espejo sintético de seed.js para fallback offline
│   └── index.js          # Barrel export
├── components/           # Componentes presentacionales atómicos puros (0 useEffect, 0 API)
│   ├── Button.jsx        # Botón con variantes semánticas y spinner isSubmitting
│   ├── Input.jsx         # Input compatible con RHF y errores inline
│   ├── Textarea.jsx      # Textarea compatible con RHF
│   ├── Select.jsx        # Selector desplegable compatible con RHF
│   ├── Badge.jsx         # Indicador monoespaciado de prioridades y estados
│   ├── Modal.jsx         # Contenedor modal accesible con backdrop blur
│   ├── ConfirmDialog.jsx # Diálogo destructivo con advertencia de borrado en cascada
│   ├── Spinner.jsx       # Indicador animado de carga minimalista
│   ├── Navbar.jsx        # Barra superior con ThemeToggle y control de sesión
│   └── index.js          # Barrel export
├── features/             # Módulos organizados por dominio de negocio
│   ├── boards/           # BoardCard, BoardFormModal y boardSchema (Zod)
│   ├── columns/          # ColumnContainer, ColumnFormModal y columnSchema (Zod)
│   └── tickets/          # TicketCard, TicketFormModal y ticketSchema (Zod)
├── hooks/                # Contextos y hooks globales reutilizables
│   ├── useTheme.jsx      # ThemeContext (Light/Dark + anti-FOUC + localStorage)
│   ├── useAuth.jsx       # AuthContext (Sesión simulada persistida o JWT)
│   ├── useToast.jsx      # ToastContext (Sistema de alertas para Optimistic UI)
│   └── index.js          # Barrel export
├── pages/                # Vistas principales (Smart / Containers)
│   ├── LoginPage.jsx     # Formulario público de autenticación con RHF + Zod
│   ├── BoardsListPage.jsx# Listado general de tableros con carga asíncrona y creación
│   ├── BoardDetailPage.jsx# Tablero Kanban interactivo con Drag & Drop y Optimistic Rollback
│   ├── NotFoundPage.jsx  # Vista 404 de recurso no localizado
│   └── index.js          # Barrel export
├── routes/               # Configuración de enrutamiento y guardias
│   ├── AppRoutes.jsx     # Matriz de rutas de la aplicación
│   └── ProtectedRoute.jsx# Guardia de protección para usuarios autenticados
├── App.jsx               # Ensamblador raíz de proveedores y rutas
├── main.jsx              # Punto de entrada de React 18 (createRoot)
└── index.css             # Directivas Tailwind, tokens semánticos y scrollbars retro
```

---

## 5. Matriz de Rutas de la SPA

| Ruta | Componente | Acceso | Descripción |
| :--- | :--- | :---: | :--- |
| `/login` | `LoginPage` | Público | Formulario de autenticación con validación Zod y autocompletado demo. |
| `/boards` | `BoardsListPage` | Protegido | Listado de tableros pertenecientes al usuario con métricas y creación. |
| `/boards/:boardId` | `BoardDetailPage` | Protegido | Tablero Kanban con columnas y tickets ordenables mediante Drag & Drop. |
| `*` | `NotFoundPage` | Público | Vista de error 404 para URLs no mapeadas. |

---

## 6. Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js 18+ (recomendado LTS v20 o superior).
- npm 9+ o pnpm / yarn.

### 6.1 Instalación de Dependencias
```bash
cd frontend
npm install
```

### 6.2 Configuración de Variables de Entorno
Copia el archivo de ejemplo y ajusta la URL del servidor backend:
```bash
cp .env.example .env
```
Contenido de `.env`:
```ini
# URL base de la API REST del backend DevBoard
VITE_API_URL=http://localhost:5000/api
```

### 6.3 Ejecución en Modo Desarrollo
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:5173`.

### 6.4 Ejecución Offline (Sin Backend Activo)
Si el backend local no está en ejecución, la aplicación detectará automáticamente el estado de desconexión y ofrecerá el botón **"Cargar Datos Sintéticos (Offline)"**, permitiendo navegar y probar todas las funcionalidades con el conjunto de datos de `mockData.js`.

### 6.5 Compilación para Producción y Verificación
```bash
npm run build
```
Genera el paquete optimizado en `dist/` listo para su despliegue estático (Vercel, Netlify, Nginx, AWS S3).
