# Sistema de Gestión de Proyectos (Estilo Kanban) - Backend API

Backend desarrollado en Node.js, Express y MongoDB para la gestión ágil de proyectos mediante tableros Kanban, con soporte para rutas anidadas RESTful, verificación de jerarquía (*Parent Check*), borrado en cascada y manipulación idempotente de tickets.

---

## 👥 Integrantes del Equipo (Grupo F)

- **Alexis Fernando Rojas**
- **Emanuel Ramirez**
- **Franco Blanchard**
- **Julian Muiños**
- **Santino Marchesini**

---

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución**: [Node.js](https://nodejs.org/) (v20+ LTS)
- **Framework Web**: [Express.js](https://expressjs.com/) (v4.21+)
- **Base de Datos**: [MongoDB](https://www.mongodb.com/) (Atlas / Local)
- **ODM**: [Mongoose](https://mongoosejs.com/) (v8.10+)
- **Seguridad y CORS**: `cors` y `dotenv` para gestión de variables de entorno
- **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest) y [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) (base de datos en memoria para pruebas sin dependencias externas)
- **Desarrollo**: [Nodemon](https://nodemon.io/) para recarga en caliente

---

## 🏛️ Arquitectura del Sistema y Reglas de Negocio

La jerarquía del dominio sigue una relación estricta de 3 niveles:

$$\mathbf{Board} \longrightarrow \mathbf{Column} \longrightarrow \mathbf{Ticket}$$

### Principios y Patrones Aplicados

1. **Diseño RESTful Anidado**:
   Las rutas expresan claramente la relación jerárquica de los recursos (`/api/boards/:boardId/columns/:columnId/tickets`) utilizando sustantivos en plural y verbos HTTP para definir las operaciones.
2. **Parent Check (Verificación de Jerarquía)**:
   Antes de procesar cualquier recurso hijo, middlewares dedicados verifican en la base de datos que el recurso padre exista (`404 Not Found`) y que el hijo pertenezca efectivamente a dicho padre (`400 Bad Request`).
3. **Colecciones Normalizadas y Desacopladas**:
   Se evita el antipatrón de arreglos embebidos simples en documentos principales. Cada entidad reside en su propia colección y se vincula mediante referencias de `ObjectId`. Para consultas que requieren la jerarquía completa, se utiliza **Virtual Populate** de Mongoose.
4. **Borrado en Cascada Concurrente**:
   - Eliminar un **Board** remueve de forma automática y recursiva todas sus **Columns** y los **Tickets** asociados a estas.
   - Eliminar una **Column** remueve todos sus **Tickets**, sin afectar a columnas hermanas ni a otros tableros.
   Implementado mediante hooks de Mongoose (`pre('deleteOne')` y `pre('findOneAndDelete')`).
5. **Validación Preventiva de ObjectIds**:
   Todos los parámetros de ruta (`:boardId`, `:columnId`, `:ticketId`) son validados contra el estándar de 24 caracteres hexadecimales antes de consultar Mongoose, retornando `400 Bad Request` en caso de malformación y previniendo excepciones `CastError` no controladas.
6. **Idempotencia y Reubicación de Tickets (PATCH)**:
   Permite actualizar el contenido del ticket o moverlo a otra columna mediante el campo `targetColumnId`, validando que la columna de destino exista y pertenezca al mismo tablero.
7. **Formato Estándar de Errores**:
   Todas las respuestas de error utilizan exclusivamente el formato JSON unificado:
   ```json
   {
     "error": "Mensaje descriptivo del error"
   }
   ```

---

## 📂 Estructura del Proyecto

El proyecto respeta la separación estricta de responsabilidades y la convención `kebab-case` para nombres de archivos y carpetas:

```text
├── config/
│   └── db.js                        # Conexión Mongoose y lectura de variables de entorno
├── controllers/
│   ├── board-controller.js          # Controladores CRUD de tableros
│   ├── column-controller.js         # Controladores CRUD de columnas
│   └── ticket-controller.js         # Controladores CRUD y movimiento de tickets
├── middlewares/
│   ├── error-handler.js             # Formato unificado de error y captura global
│   ├── parent-check.js              # Validación de pertenencia y existencia padre
│   └── validate-object-id.js        # Validación estricta de formato ObjectId
├── models/
│   ├── board-model.js               # Esquema Board, virtuals y hook de cascada
│   ├── column-model.js              # Esquema Column, virtuals y hook de cascada
│   └── ticket-model.js              # Esquema Ticket con referencia ObjectId
├── routes/
│   ├── board-routes.js              # Rutas /api/boards y anidamiento
│   ├── column-routes.js             # Rutas /api/boards/:boardId/columns (mergeParams)
│   └── ticket-routes.js             # Rutas .../columns/:columnId/tickets (mergeParams)
├── tests/
│   ├── setup.js                     # Servidor MongoDB en memoria para pruebas
│   ├── boards.test.js               # Tests de integración para Tableros y cascada
│   ├── columns.test.js              # Tests de integración para Columnas y Parent Check
│   └── tickets.test.js              # Tests de integración para Tickets y movimiento
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Archivos ignorados por Git
├── AGENTS.md                        # Directivas y especificaciones del sistema
├── kanban_postman_collection.json   # Colección exportable para Postman con tests
├── package.json                     # Scripts y dependencias
├── seed.js                          # Script para poblar la base de datos con datos de ejemplo
├── server.js                        # Punto de entrada de la aplicación Express
└── README.md                        # Documentación general del proyecto
```

---

## 📡 Endpoints de la API REST

### 1. Tableros (`Boards`)
| Método | Endpoint | Código Exitoso | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/boards` | `201 Created` | Crear un nuevo tablero (`title`, `description`). |
| `GET` | `/api/boards` | `200 OK` | Listar todos los tableros ordenados por fecha. |
| `GET` | `/api/boards/:boardId` | `200 OK` | Obtener un tablero con sus columnas y tickets poblados. |
| `PATCH` | `/api/boards/:boardId` | `200 OK` | Actualizar título o descripción del tablero. |
| `DELETE` | `/api/boards/:boardId` | `204 No Content` | Eliminar tablero con borrado en cascada (columnas y tickets). |

### 2. Columnas (`Columns`)
| Método | Endpoint | Código Exitoso | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/boards/:boardId/columns` | `201 Created` | Crear columna dentro de un tablero (`title`, `order`). |
| `GET` | `/api/boards/:boardId/columns` | `200 OK` | Listar todas las columnas del tablero con sus tickets. |
| `GET` | `/api/boards/:boardId/columns/:columnId` | `200 OK` | Obtener columna específica (valida pertenencia al tablero). |
| `PATCH` | `/api/boards/:boardId/columns/:columnId` | `200 OK` | Modificar título u orden de la columna. |
| `DELETE` | `/api/boards/:boardId/columns/:columnId` | `204 No Content` | Eliminar columna con borrado en cascada (sus tickets). |

### 3. Tickets (`Tickets`)
| Método | Endpoint | Código Exitoso | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/boards/:boardId/columns/:columnId/tickets` | `201 Created` | Crear ticket (`title`, `description`, `priority`, `order`). |
| `GET` | `/api/boards/:boardId/columns/:columnId/tickets` | `200 OK` | Listar tickets de la columna ordenados. |
| `GET` | `/api/boards/:boardId/columns/:columnId/tickets/:ticketId` | `200 OK` | Obtener detalle de un ticket específico. |
| `PATCH` | `/api/boards/:boardId/columns/:columnId/tickets/:ticketId` | `200 OK` | Actualizar contenido o mover a otra columna (`targetColumnId`). |
| `DELETE` | `/api/boards/:boardId/columns/:columnId/tickets/:ticketId` | `204 No Content` | Eliminar un ticket específico. |

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- [Node.js](https://nodejs.org/) v20 o superior.
- Instancia activa de MongoDB (local o en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd Grupo-F---proyecto-Kanban
npm install
```

### 2. Configurar las variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/kanban?retryWrites=true&w=majority
NODE_ENV=development
```

> **Nota**: Si te conectas a MongoDB Atlas, asegúrate de habilitar tu IP en **Network Access** (`0.0.0.0/0` para desarrollo).

### 3. Poblar la base de datos (Seed)
Para cargar datos de ejemplo realistas (2 tableros con múltiples columnas y tickets):
```bash
npm run seed
```

### 4. Iniciar el servidor
- En modo desarrollo (con recarga automática mediante Nodemon):
  ```bash
  npm run dev
  ```
- En modo producción:
  ```bash
  npm start
  ```
El servidor quedará disponible en `http://localhost:5000` (o el puerto configurado en el archivo `.env`).

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una suite completa de pruebas unitarias y de integración desarrolladas con **Jest**, **Supertest** y **mongodb-memory-server**.

Para ejecutar los tests automatizados:
```bash
npm test
```

Verificaciones cubiertas:
- ✅ Códigos de estado HTTP y respuestas en formato estándar `{ "error": "..." }`.
- ✅ Rechazo preventivo de ObjectIds malformados (`400 Bad Request`).
- ✅ Recurso inexistente con ObjectId válido (`404 Not Found`).
- ✅ Controles de jerarquía (*Parent Check*) para columnas y tickets (`400 Bad Request`).
- ✅ Borrado en cascada íntegro al eliminar un tablero o columna.
- ✅ Reubicación de tickets mediante `targetColumnId` y rechazo de columnas ajenas al tablero.

---

## 📬 Pruebas con Postman

El repositorio incluye el archivo listo para importar:
📄 **`kanban_postman_collection.json`**

1. Abre Postman y haz clic en **Import**.
2. Selecciona o arrastra el archivo `kanban_postman_collection.json`.
3. La colección incluye variables automáticas que capturan los IDs generados (`boardId`, `column1Id`, `ticketId`, etc.) para ejecutar el flujo de pruebas de forma continua y sin configuración manual.
