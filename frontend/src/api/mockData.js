/**
 * Datos sintéticos espejo de seed.js para desarrollo offline y pruebas unitarias
 * Estructura 100% compatible con los esquemas de Mongoose y MongoDB ObjectIds
 */

export const mockBoards = [
  {
    _id: '67b60e111111111111111001',
    title: 'Plataforma E-Commerce',
    description: 'Tablero de desarrollo y seguimiento del sprint principal',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-15T15:30:00.000Z',
    columns: [
      {
        _id: '67b60e222222222222222001',
        title: 'Backlog',
        boardId: '67b60e111111111111111001',
        order: 0,
        tickets: [
          {
            _id: '67b60e333333333333333001',
            title: 'Diseñar arquitectura de microservicios',
            description: 'Documentar diagramas de secuencia y contratos de OpenAPI.',
            priority: 'high',
            columnId: '67b60e222222222222222001',
            order: 0,
            createdAt: '2026-10-02T11:00:00.000Z',
            updatedAt: '2026-10-02T11:00:00.000Z',
          },
          {
            _id: '67b60e333333333333333002',
            title: 'Investigar integración de pagos',
            description: 'Comparar comisiones y webhooks de Mercado Pago vs Stripe.',
            priority: 'medium',
            columnId: '67b60e222222222222222001',
            order: 1,
            createdAt: '2026-10-03T12:00:00.000Z',
            updatedAt: '2026-10-03T12:00:00.000Z',
          },
        ],
      },
      {
        _id: '67b60e222222222222222002',
        title: 'En Progreso',
        boardId: '67b60e111111111111111001',
        order: 1,
        tickets: [
          {
            _id: '67b60e333333333333333003',
            title: 'Implementar autenticación con JWT',
            description: 'Endpoints de registro, login y refresh token con rotación.',
            priority: 'high',
            columnId: '67b60e222222222222222002',
            order: 0,
            createdAt: '2026-10-04T09:30:00.000Z',
            updatedAt: '2026-10-06T14:20:00.000Z',
          },
          {
            _id: '67b60e333333333333333004',
            title: 'Crear componente de carrito de compras',
            description: 'Persistencia en localStorage y sincronización con backend.',
            priority: 'medium',
            columnId: '67b60e222222222222222002',
            order: 1,
            createdAt: '2026-10-05T16:00:00.000Z',
            updatedAt: '2026-10-07T11:45:00.000Z',
          },
        ],
      },
      {
        _id: '67b60e222222222222222003',
        title: 'En Revisión',
        boardId: '67b60e111111111111111001',
        order: 2,
        tickets: [
          {
            _id: '67b60e333333333333333005',
            title: 'Endpoint de cálculo de costos de envío',
            description: 'Integrar cálculo dinámico por código postal y peso.',
            priority: 'low',
            columnId: '67b60e222222222222222003',
            order: 0,
            createdAt: '2026-10-08T10:00:00.000Z',
            updatedAt: '2026-10-09T18:10:00.000Z',
          },
        ],
      },
      {
        _id: '67b60e222222222222222004',
        title: 'Terminado',
        boardId: '67b60e111111111111111001',
        order: 3,
        tickets: [
          {
            _id: '67b60e333333333333333006',
            title: 'Configurar entorno inicial y Docker',
            description: 'Dockerfile multi-stage y docker-compose para dev.',
            priority: 'medium',
            columnId: '67b60e222222222222222004',
            order: 0,
            createdAt: '2026-10-01T08:00:00.000Z',
            updatedAt: '2026-10-01T16:00:00.000Z',
          },
        ],
      },
    ],
  },
  {
    _id: '67b60e111111111111111002',
    title: 'Campaña de Marketing Q4',
    description: 'Lanzamiento de producto y promociones de fin de año',
    createdAt: '2026-10-10T12:00:00.000Z',
    updatedAt: '2026-10-18T17:00:00.000Z',
    columns: [
      {
        _id: '67b60e222222222222222005',
        title: 'Ideas',
        boardId: '67b60e111111111111111002',
        order: 0,
        tickets: [
          {
            _id: '67b60e333333333333333007',
            title: 'Diseño de banners para redes sociales',
            description: 'Formatos para Instagram Stories y LinkedIn.',
            priority: 'medium',
            columnId: '67b60e222222222222222005',
            order: 0,
            createdAt: '2026-10-11T14:00:00.000Z',
            updatedAt: '2026-10-11T14:00:00.000Z',
          },
        ],
      },
      {
        _id: '67b60e222222222222222006',
        title: 'En Producción',
        boardId: '67b60e111111111111111002',
        order: 1,
        tickets: [
          {
            _id: '67b60e333333333333333008',
            title: 'Redacción de newsletter promocional',
            description: 'Copywriting enfocado en descuentos por lanzamiento.',
            priority: 'high',
            columnId: '67b60e222222222222222006',
            order: 0,
            createdAt: '2026-10-12T10:00:00.000Z',
            updatedAt: '2026-10-14T11:00:00.000Z',
          },
        ],
      },
      {
        _id: '67b60e222222222222222007',
        title: 'Publicado',
        boardId: '67b60e111111111111111002',
        order: 2,
        tickets: [
          {
            _id: '67b60e333333333333333009',
            title: 'Comunicado de prensa oficial',
            description: 'Distribución a medios de tecnología.',
            priority: 'low',
            columnId: '67b60e222222222222222007',
            order: 0,
            createdAt: '2026-10-15T09:00:00.000Z',
            updatedAt: '2026-10-16T12:00:00.000Z',
          },
        ],
      },
    ],
  },
];

/**
 * Servicio Mock para emulación offline del backend
 */
export const mockService = {
  async getBoards() {
    return structuredClone(mockBoards);
  },
  async getBoardById(id) {
    const board = mockBoards.find((b) => b._id === id);
    if (!board) throw new Error('Tablero no encontrado');
    return structuredClone(board);
  },
};

export default mockBoards;
