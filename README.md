# Sistema de Gestión de Proyectos (Estilo Kanban) - Grupo F

Aplicación fullstack para la gestión ágil de proyectos mediante tableros Kanban interactivos, desarrollada con una arquitectura desacoplada: **Backend API RESTful** (Node.js, Express, MongoDB) y **Frontend SPA reactivo** (React 19, Vite, Tailwind CSS).

---

## 👥 Integrantes del Equipo (Grupo F)

- **Alexis Fernando Rojas**
- **Emanuel Ramirez**
- **Franco Blanchard**
- **Julian Muiños**
- **Santino Marchesini**

---

## 🏛️ Arquitectura Global del Repositorio

El proyecto se encuentra organizado en dos módulos independientes y desacoplados:

```text
Grupo-F---proyecto-Kanban/
├── backend/                         # Servidor y API RESTful (Node.js, Express, MongoDB)
│   ├── config/                      # Conexión Mongoose y entorno
│   ├── controllers/                 # Lógica de petición/respuesta por entidad
│   ├── middlewares/                 # Validaciones de ID, Parent Check y manejo global de errores
│   ├── models/                      # Esquemas de Mongoose con hooks de borrado en cascada
│   ├── routes/                      # Enrutadores Express (rutas anidadas RESTful)
│   ├── tests/                       # Suite de pruebas automatizadas (Jest, Supertest)
│   ├── .env.example                 # Variables de entorno requeridas para el backend
│   ├── .gitignore                   # Exclusiones de Git para el backend
│   ├── kanban_postman_collection.json # Colección exportable de Postman con pruebas automáticas
│   ├── package.json                 # Dependencias y scripts de backend
│   ├── seed.js                      # Script para poblar la base de datos con datos de prueba
│   ├── server.js                    # Punto de entrada de la aplicación Express
│   └── README.md                    # Documentación detallada de la API backend
│
├── frontend/                        # Aplicación de usuario (SPA con React 19 + Vite)
│   ├── src/                         # Código fuente (componentes, páginas, hooks, api, context)
│   ├── public/                      # Recursos estáticos
│   ├── .env.example                 # Variables de entorno requeridas para el frontend
│   ├── package.json                 # Dependencias y scripts de frontend
│   ├── tailwind.config.js           # Configuración de Tailwind CSS y paleta de diseño
│   ├── vite.config.js               # Configuración de compilador y bundler Vite
│   └── README.md                    # Documentación técnica completa del frontend
│
├── .gitignore                       # Exclusiones globales de Git
├── AGENTS.md                        # Directivas y especificaciones técnicas del sistema
└── README.md                        # Este documento general
```

---

## 🚀 Puesta en Marcha Rápida

### 1. Iniciar el Backend

1. Navegar al directorio del backend:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Ajustar `MONGODB_URI` y `PORT=5000` si es necesario).*
4. Poblar la base de datos con datos iniciales (opcional):
   ```bash
   npm run seed
   ```
5. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:5000`.

### 2. Iniciar el Frontend

1. En una nueva terminal, navegar al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Asegurarse de que `VITE_API_URL=http://localhost:5000/api`)*.
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación web estará disponible en `http://localhost:5173`.

---

## 🧪 Pruebas Automatizadas del Backend

Dentro de `backend/`:
```bash
cd backend
npm test
```

Ejecuta la suite completa de pruebas en memoria con **Jest**, **Supertest** y **mongodb-memory-server**, verificando:
- Rutas anidadas y jerarquía `Board -> Column -> Ticket`.
- Validaciones preventivas de ObjectId (`400 Bad Request` vs `404 Not Found`).
- Middlewares de *Parent Check*.
- Borrado en cascada en cascada de tableros y columnas.
- Idempotencia y movimiento de tickets entre columnas.

---

## 📖 Documentación Específica por Módulo

- Consulta [backend/README.md](file:///c:/Users/santi/Documents/Grupo-F---proyecto-Kanban/backend/README.md) para la referencia completa de endpoints, contratos JSON, modelos y pruebas con Postman.
- Consulta [frontend/README.md](file:///c:/Users/santi/Documents/Grupo-F---proyecto-Kanban/frontend/README.md) para la arquitectura de componentes, diseño Atomic Design, manejo de estado y contratos de integración con la API.
