import apiClient from './client';

/**
 * Servicio de integración para el recurso Columnas (/api/boards/:boardId/columns)
 */
export const columnService = {
  /**
   * Listar todas las columnas de un tablero con sus tickets poblados
   * GET /api/boards/:boardId/columns
   * @param {string} boardId - ID del tablero
   * @returns {Promise<Array>} Lista de columnas ordenadas por 'order'
   */
  async getColumns(boardId) {
    if (!boardId) throw new Error('El boardId es obligatorio');
    return apiClient.get(`/boards/${boardId}/columns`);
  },

  /**
   * Obtener una columna específica por su ID
   * GET /api/boards/:boardId/columns/:columnId
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @returns {Promise<Object>} Columna con sus tickets poblados
   */
  async getColumnById(boardId, columnId) {
    if (!boardId || !columnId) throw new Error('boardId y columnId son obligatorios');
    return apiClient.get(`/boards/${boardId}/columns/${columnId}`);
  },

  /**
   * Crear una nueva columna dentro de un tablero
   * POST /api/boards/:boardId/columns
   * @param {string} boardId - ID del tablero padre
   * @param {Object} payload - { title: string, order?: number }
   * @returns {Promise<Object>} Columna creada
   */
  async createColumn(boardId, payload) {
    if (!boardId) throw new Error('El boardId es obligatorio');
    if (!payload?.title?.trim()) {
      throw new Error('El título de la columna es obligatorio');
    }
    return apiClient.post(`/boards/${boardId}/columns`, {
      title: payload.title.trim(),
      ...(payload.order !== undefined && { order: payload.order }),
    });
  },

  /**
   * Actualizar título u orden de una columna
   * PATCH /api/boards/:boardId/columns/:columnId
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @param {Object} payload - { title?: string, order?: number }
   * @returns {Promise<Object>} Columna actualizada
   */
  async updateColumn(boardId, columnId, payload) {
    if (!boardId || !columnId) throw new Error('boardId y columnId son obligatorios');
    return apiClient.patch(`/boards/${boardId}/columns/${columnId}`, payload);
  },

  /**
   * Eliminar una columna con borrado en cascada de sus tickets asociados
   * DELETE /api/boards/:boardId/columns/:columnId
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @returns {Promise<void>}
   */
  async deleteColumn(boardId, columnId) {
    if (!boardId || !columnId) throw new Error('boardId y columnId son obligatorios');
    return apiClient.delete(`/boards/${boardId}/columns/${columnId}`);
  },
};

export default columnService;
