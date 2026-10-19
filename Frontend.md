# Especificación de Requerimientos y Reglas de Desarrollo Frontend (SDD) — DevBoard

Este documento (`AGENTS.md`) establece el contrato de **UI/UX, Arquitectura, Manejo de Estado y Sistema de Diseño** bajo la metodología de **Desarrollo Basado en Especificaciones (SDD)**. Todo agente de IA o desarrollador que intervenga en la capa de frontend debe leer y respetar estrictamente estas reglas antes de generar o modificar código, evitando componentes monolíticos que mezclen lógica visual con llamadas de red (`fetch`).

## 1. Configuración del Contexto Global (Frontend Rules)

### Stack Tecnológico Fijo
El proyecto utiliza un stack cerrado que debe mantenerse alineado con los contratos del backend:

- **Core:** React 18+ con Vite como empaquetador y entorno de desarrollo.
- **Enrutamiento:** React Router DOM v6+.
- **Gestión de Estado y Fetches:** React Query (TanStack Query) o Axios + Context API (revisar y mantener consistencia con las definiciones de autenticación y respuestas del backend).
- **Formularios y Validación:** React Hook Form integrado con Zod o Yup.
- **Estilizado:** CSS modular / Custom Properties (o Tailwind CSS configurado sobre variables CSS nativas).

### Patrón de Componentes
Se exige una separación estricta de responsabilidades entre dos tipos de componentes:

1. **Componentes Presentacionales (Dummy / Atómicos):**
   - Solo reciben datos mediante `props` y notifican eventos a través de callbacks (`onClick`, `onDelete`, `onSubmit`).
   - Se encargan exclusivamente de renderizar la interfaz de usuario.
   - **Restricción estricta:** Tienen prohibido utilizar `useEffect` para carga de datos o ejecutar llamadas a la API de forma interna.
2. **Componentes Contenedores / Páginas (Smart / Views):**
   - Gestionan el estado de la vista, obtienen parámetros de ruta, orquestan llamadas a la capa de servicios (`src/api`) y proveen datos a los componentes presentacionales.

### Estructura de Directorios Obligatoria
Toda generación de archivos debe respetar la siguiente organización modular dentro de `src/`:

```text
src/
├── api/        # Funciones aisladas de llamada a los endpoints REST (ej. boardService.js)
├── components/ # Componentes reutilizables y atómicos de UI (Button, Modal, Input, TicketCard)
├── features/   # Módulos organizados por dominio de negocio (boards, columns, tickets)
├── hooks/      # Custom hooks para lógica reutilizable (useAuth, useFetch, useTheme)
├── pages/      # Vistas principales asociadas a rutas de React Router (LoginPage, BoardsListPage, BoardDetailPage)
└── routes/     # Configuración de rutas, layouts y guardias de protección de React Router DOM
```

## 2. Especificación de Contratos de UI y Rutas (SPA Architecture)

### Matriz de Rutas de la Single Page Application (SPA)

| Ruta | Componente | Acceso | Descripción / Requerimiento |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginPage` | Público | Formulario de autenticación de usuarios. |
| `/boards` | `BoardsListPage` | Protegido | Vista de listado general de tableros pertenecientes al usuario autenticado. |
| `/boards/:boardId` | `BoardDetailPage` | Protegido | Vista principal del tablero Kanban. Carga columnas y tickets de forma anidada. |

### Límite Negativo de Enrutamiento (React Router)
> **REGLA ESTRICTA:** NO utilices componentes `<Link>` para acciones de mutación (crear, borrar o mover tickets/tableros). Utiliza navegación programática (`useNavigate`) **únicamente después** de que la mutación en la API haya respondido de forma exitosa.

## 3. Especificación para Formularios y Mantenimiento de Estado (Forms & Validations)

Para evitar código redundante o manejo manual propenso a errores en formularios, toda implementación debe cumplir:

### Validación en Cliente vs. Servidor
- **Esquemas Declarativos:** Es obligatorio utilizar **React Hook Form** junto con esquemas de validación declarativos (**Zod** o **Yup**) para validar campos antes del envío.
- **Mapeo de Errores del Servidor en UI:** Los errores devueltos por el backend (por ejemplo, `400 Bad Request` debido a un título duplicado o datos inválidos) deben capturarse y mapearse directamente a las alertas visuales de los inputs correspondientes dentro del formulario (usando `setError` de React Hook Form o estado de alerta acoplado al campo), **sin recargar la página**.

### Manejo de Estados de Carga (UX Feedback)
> **REGLA ESTRICTA:** Todo formulario que realice una petición `POST`, `PATCH` o `DELETE` debe deshabilitar inmediatamente el botón de envío (`disabled={isSubmitting}`) y mostrar un indicador visual de carga (`spinner`) mientras la petición HTTP se encuentre en curso.

## 4. Partición Generativa en el Frontend (Fases SDD)

El desarrollo asistido por IA debe ejecutarse de manera secuencial y modular siguiendo tres fases bien delimitadas para evitar estados inmanejables:

### Fase 1: Capa de Servicio API (`src/api`)
Escribir únicamente los métodos de integración con los endpoints REST del backend ya desarrollados, aislando la configuración del cliente HTTP.

- **Objetivo:** Centralizar llamadas HTTP, cabeceras de autorización, manejo de errores y propagación de excepciones.
- **Directriz de Implementación (Prompt Modelo):**
  > *"Basándote en la especificación de endpoints REST de DevBoard (`POST /api/boards`, `GET /api/boards/:boardId`, etc.), genera un módulo cliente en `src/api/boardService.js` utilizando Axios. Incluye manejo de errores y propagación de excepciones."*

### Fase 2: Componentes Atómicos de UI (`src/components` / `src/features`)
Construir la biblioteca de componentes presentacionales (dummy) completamente desacoplados de la red.

- **Objetivo:** Validar el diseño visual, las `props` y la accesibilidad sin depender del backend.
- **Directriz de Implementación (Prompt Modelo):**
  > *"Crea un componente `TicketCard.jsx` que reciba por props un objeto `ticket` (`{ id, title, description, priority }`) y un callback `onDelete`. Aplica los estilos del sistema de diseño y asegúrate de que no contenga ningún `useEffect` ni llamada a API interna."*

### Fase 3: Integración de Vistas y Rutas (`src/pages` / `src/routes`)
Ensamblar las páginas conectando la capa de servicios (`src/api`) con los componentes atómicos mediante `React Router DOM`.

- **Objetivo:** Gestionar el ciclo de vida de la vista, parámetros de URL y estados de interfaz (`loading`, `error`, `data`).
- **Directriz de Implementación (Prompt Modelo):**
  > *"Crea la vista `BoardDetailPage.jsx` asociada a la ruta `/boards/:boardId`. Usa `useParams` para obtener el ID, consume `boardService.getBoardById` al montar el componente, e implementa estados de `loading`, `error` y `data`."*

## 5. Control de Concurrencia Visual y Sincronización (Optimistic UI)

En el tablero Kanban, la fluidez al arrastrar o mover tickets entre columnas (`PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId`) requiere una estrategia explícita de sincronización:

- **Estrategia Seleccionada:** **Actualización Optimista (Optimistic UI)** para movimientos de tickets entre columnas y reordenamientos; **Petición Estándar** (esperar `200 OK` / `201 Created`) para creación de entidades nuevas cuando se requiera el ID generado por el servidor.
- **Regla de Sincronización y Rollback:**
  > *"Al mover un ticket de columna, aplica actualización optimista en el estado local de inmediato antes de que el servidor responda. Si el backend responde con un error (`400`, `404` o `500`), revierte el ticket a su columna y posición original en el estado local y despliega un mensaje emergente (`Toast`) notificando el fallo al usuario."*

## 6. Integración con el Workflow de Desarrollo (Vite & Mocking)

Para garantizar que el desarrollo y las pruebas de componentes frontend puedan avanzar sin depender al 100% de que el servidor backend local esté activo en todo momento:

- **Mocks y Datos Sintéticos (`MSW` / `mockData.js`):**
  - Generar un módulo de datos sintéticos (`src/api/mockData.js`) o configurar **Mock Service Worker (MSW)** respetando exactamente los esquemas y contratos JSON definidos en el backend (tableros, columnas anidadas y tickets con prioridades).
- **Variables de Entorno con Vite:**
  - Queda prohibido definir URLs de servidor fijas en el código fuente.
  - El endpoint base de la API debe consumirse exclusivamente desde `import.meta.env.VITE_API_URL` (definido en archivos `.env` / `.env.example`) para facilitar el despliegue continuo entre entornos locales y producción.

## 7. Sistema de Diseño e Implementación Visual: Silicon Valley Retro-Tech

La identidad visual elegida para la aplicación es **Opción 4: Silicon Valley Retro-Tech**.

### Concepto Estético y Tipografía
- **Inspiración:** Un guiño estético a las interfaces de sistemas informáticos clásicos de Silicon Valley (inspirado en paletas cálidas tipo Solarized y terminales clásicas), combinado con una experiencia de usuario moderna, limpia y ergonómica.
- **Regla Tipográfica:** Utilizar una fuente sans-serif legible para textos generales y **obligatoriamente tipografías monoespaciadas** (`font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace`) para los **identificadores de tickets** (ej. `TICKET-104`, `#42`), metadatos técnicos, etiquetas de estado y contadores de columnas.

### Paleta de Colores Oficial (Tokens Semánticos)

| Token CSS | Rol en la Interfaz | Light Mode (Crema Cálido) | Dark Mode (Petróleo Retro) |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | Fondo principal de la aplicación | `#FDF6E3` (Crema cálido) | `#002B36` (Petróleo muy oscuro) |
| `--bg-card` | Superficie de tarjetas, columnas y modales | `#EEE8D5` (Arena suave) | `#073642` (Petróleo oscuro) |
| `--text-primary` | Texto principal y encabezados | `#073642` (Azul petróleo oscuro) | `#839496` (Gris verdoso) |
| `--accent-color` | Acento principal (CTAs, estados activos, foco) | `#CB4B16` (Naranja ladrillo) | `#2AA198` (Cian retro) |

### Requerimientos Arquitectónicos del Theme Switch (Light / Dark Mode)

1. **Variables CSS (Custom Properties) Obligatorias:**
   - **Prohibición de Hardcoding:** Queda estrictamente prohibido "hardcodear" colores hexadecimales directamente en los componentes JSX o en clases aisladas.
   - Todos los estilos deben referenciar los tokens globales definidos en el nivel raíz del diseño (`:root` y `.dark`).

   ```css
   :root {
     --bg-primary: #FDF6E3;
     --bg-card: #EEE8D5;
     --text-primary: #073642;
     --accent-color: #CB4B16;
     --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
   }

   html.dark,
   body.dark {
     --bg-primary: #002B36;
     --bg-card: #073642;
     --text-primary: #839496;
     --accent-color: #2AA198;
   }
   ```

2. **Detección de Preferencia del Sistema Operativo:**
   - Al iniciar por primera vez (cuando no exista aún una preferencia guardada en `localStorage`), la aplicación debe evaluar la media query `@media (prefers-color-scheme: dark)` mediante `window.matchMedia('(prefers-color-scheme: dark)').matches` para adoptar automáticamente el tema nativo del sistema operativo del usuario sin intervención manual.

3. **Gestión y Persistencia de Estado sin Parpadeo (FOUC Prevention):**
   - La selección explícita del usuario mediante el interruptor (Theme Toggle) de la interfaz debe inyectar o remover la clase global `.dark` en la etiqueta `<html>` o `<body>`.
   - Dicha preferencia debe persistirse en `localStorage` (ej. bajo la clave `theme`).
   - Se debe inicializar el tema de forma síncrona antes del primer pintado (por ejemplo, con un script ligero en `index.html` o en la inicialización de estado del proveedor de tema) para sobrevivir a los refrescos de página y evitar el "parpadeo" de estilos (Flash of Unstyled/Wrong Theme Content) al cargar el sitio.

## 8. Entregables, Documentación y Despliegue

Para dar por completada la iteración bajo este contrato SDD, el agente y el equipo de desarrollo deben cumplir con los siguientes pasos finales:

1. **Cumplimiento de `AGENTS.md`:** Verificar que toda generación de código respete la separación de componentes, límites negativos de React Router, manejo de formularios con React Hook Form + Zod/Yup, Optimistic UI con rollback y tokens CSS de **Silicon Valley Retro-Tech**.
2. **Documentación Técnica (`README.md`):** Generar documentos `.md` detallados tanto para el repositorio **frontend** como para el **backend**, explicando:
   - Decisiones de arquitectura y patrones aplicados (SDD, separación Contenedor/Presentacional, Optimistic UI).
   - Frameworks y librerías utilizadas con su justificación técnica.
   - Guía de configuración de variables de entorno (`VITE_API_URL`, etc.), ejecución con mocks (`mockData.js` / MSW) y comandos de construcción.
3. **Actualización y Despliegue:** Actualizar los repositorios remotos y desplegar tanto el backend como el frontend en sus respectivos entornos de hosting, verificando que la comunicación CORS, variables de entorno y flujos completos funcionen de extremo a extremo.
