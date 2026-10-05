# Directivas de Desarrollo y Especificación del Sistema

## 1. Stack Tecnológico y Entorno

- **Runtime**: Node.js 20 (versión LTS)
- **Framework Web**: Express.js 4
- **Base de Datos**: MongoDB
- **ODM**: Mongoose
- **Convención de Nomenclatura**: CamelCase para variables y funciones, PascalCase para modelos/clases, kebab-case para nombres de archivos y carpetas.

---

## 2. Estructura de Directorios Mandatoria

El proyecto debe respetar la separación estricta de responsabilidades:

```text
├── config/             # Configuración de base de datos y entorno
├── controllers/        # Controladores (lógica de petición/respuesta)
├── middlewares/        # Validaciones de ID, Parent Check y manejo global de errores
├── models/             # Esquemas de Mongoose con hooks de borrado en cascada
├── routes/             # Enrutadores Express (rutas anidadas RESTful)
├── .env.example        # Variables de entorno requeridas
├── AGENTS.md           # Reglas del proyecto para agentes
├── package.json
└── server.js           # Punto de entrada de la aplicación
```

---

## 3. Jerarquía y Rutas RESTful

La jerarquía del dominio es: **Board $\rightarrow$ Column $\rightarrow$ Ticket**.

Todas las rutas deben estructurarse de forma anidada:

| Método | Endpoint | Respuesta Exitosa | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/boards` | `201 Created` | Crear un tablero |
| `GET` | `/api/boards/:boardId` | `200 OK` | Obtener un tablero con sus columnas pobladas |
| `POST` | `/api/boards/:boardId/columns` | `201 Created` | Crear una columna dentro de un tablero |
| `DELETE` | `/api/boards/:boardId/columns/:columnId` | `204 No Content` | Eliminar columna (con borrado en cascada) |
| `POST` | `/api/boards/:boardId/columns/:columnId/tickets` | `201 Created` | Crear ticket dentro de una columna |
| `PATCH` | `/api/boards/:boardId/columns/:columnId/tickets/:ticketId` | `200 OK` | Mover ticket o actualizar contenido |

---

## 4. Reglas de Negocio y Restricciones Estrictas

1. **Parent Check (Verificación de Jerarquía)**:
   - Antes de crear o modificar un recurso hijo, verificar siempre que la entidad padre exista en la base de datos.
   - En rutas de tickets (`.../columns/:columnId/tickets...`), comprobar que la columna pertenece efectivamente al `boardId` provisto en la URL.
   - Si la columna no pertenece a ese tablero, responder inmediatamente `400 Bad Request` o `404 Not Found`.

2. **Borrado en Cascada**:
   - Al eliminar un `Board`, se deben eliminar todas sus `Column`s y los `Ticket`s asociados a estas.
   - Al eliminar una `Column`, se deben eliminar todos los `Ticket`s que contiene.
   - Implementar esta lógica mediante hooks de Mongoose (`pre('deleteOne')` / `pre('findOneAndDelete')`) o servicios dedicados.

3. **Validación de IDs de MongoDB**:
   - Todos los parámetros de ruta que representen IDs (`:boardId`, `:columnId`, `:ticketId`) deben validarse antes de consultar la base de datos:
     - Formato inválido (no coincide con un ObjectId de 24 caracteres hexadecimales) $\rightarrow$ `400 Bad Request`.
     - Formato válido pero inexistente en la base de datos $\rightarrow$ `404 Not Found`.
   - **NUNCA** dejar que una consulta con ID malformado alcance Mongoose y genere una excepción `CastError` no controlada.

4. **Idempotencia y Operaciones PATCH**:
   - Las operaciones de modificación deben ser seguras frente a múltiples ejecuciones idénticas sin duplicar ni corromper referencias.
   - Si se cambia un ticket de columna (`targetColumnId`), validar que la columna destino exista antes de actualizar el campo `columnId`.

---

## 5. Formato Estándar de Errores

Todas las respuestas de error deben usar exclusivamente formato JSON con la siguiente estructura:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

Códigos de estado esperados:
- `400 Bad Request`: Payload incompleto, tipos de datos erróneos o ID malformado.
- `404 Not Found`: Tablero, columna o ticket inexistente.
- `500 Internal Server Error`: Fallos inesperados no controlados en el servidor.

---

## 6. Partición Generativa (Evitar el "Hazlo Todo")

1. **Idempotencia y Operaciones PATCH**:
   - **Fase 1 (Datos)**: Basado en la especificación, genera solo los esquemas de Mongoose con sus referencias y el middleware pre('deleteOne') para el borrado en cascada.
   - **Fase 2 (Validacion)**: Genera el middleware que verifique la existencia del recurso padre (Parent Check) para las rutas anidadas.
   - **Fase 3 (Controladores)**: Implementa el controlador para POST /api/boards/:boardId/columns/:columnId/tickets utilizando los modelos y middlewares previamente generados.
   - **Fase 4 (Configuración)**: Crea el archivo de configuración de Express y el servidor en server.js.
   - **Fase 5 (Variables de Entorno)**: Crea el archivo .env.example con las variables de entorno requeridas.
   - **Fase 6 (Validación Final)**: Verifica que todos los middlewares, modelos y controladores estén correctamente conectados y funcionales.

## 7. Límites Negativos (Lo que NUNCA debes hacer)

- ❌ **NO** utilices arreglos embebidos simples para Tickets dentro del documento Column ni para Columns dentro de Board; utiliza referencias con `ObjectId` y colecciones separadas.
- ❌ **NO** devuelvas código `500` cuando un recurso no se encuentra; debe ser siempre `404`.
- ❌ **NO** utilices `findByIdAndDelete` sin garantizar la eliminación en cascada de los recursos hijos.
- ❌ **NO** proceses peticiones con `req.body` sin sanitizar o validar campos obligatorios.
- ❌ **NO** hardcodees cadenas de conexión a bases de datos ni puertos en el código; utiliza variables de entorno mediante `process.env`.
- ❌ **NO** expongas trazas de error internas (`stack traces`) al cliente en respuestas de producción.

---

## 8. Convenciones de Commits (Conventional Commits)

Cada commit generado debe seguir estrictamente el estándar:

- `feat: <descripción>` (nueva funcionalidad o endpoint)
- `fix: <descripción>` (corrección de errores o validaciones)
- `refactor: <descripción>` (cambios de estructura sin alterar comportamiento)
- `docs: <descripción>` (modificaciones a documentación)
- `test: <descripción>` (añadido o ajuste de tests/colecciones)