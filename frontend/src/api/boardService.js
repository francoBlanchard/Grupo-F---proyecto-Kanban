import apiClient from './client';

/**
 * Servicio de integración para el recurso Tableros (/api/boards)
 */
export const boardService = {
  /**
   * Obtener todos los tableros
   * GET /api/boards
   * @returns {Promise<Array>} Lista de tableros ordenados por fecha de creación
   */
  async getAllBoards() {
    return apiClient.get('/boards');
  },

  /**
   * Obtener un tablero por su ID con sus columnas y tickets poblados
   * GET /api/boards/:boardId
   * @param {string} boardId - ID del tablero
   * @returns {Promise<Object>} Tablero con jerarquía anidada completa
   */
  async getBoardById(boardId) {
    if (!boardId) throw new Error('El boardId es obligatorio');
    return apiClient.get(`/boards/${boardId}`);
  },

  /**
   * Crear un nuevo tablero
   * POST /api/boards
   * @param {Object} payload - { title: string, description?: string }
   * @returns {Promise<Object>} Tablero creado
   */
  async createBoard(payload) {
    if (!payload?.title?.trim()) {
      throw new Error('El título del tablero es obligatorio');
    }
    return apiClient.post('/boards', {
      title: payload.title.trim(),
      description: payload.description ? payload.description.trim() : '',
    });
  },

  /**
   * Actualizar datos de un tablero existente
   * PATCH /api/boards/:boardId
   * @param {string} boardId - ID del tablero
   * @param {Object} payload - { title?: string, description?: string }
   * @returns {Promise<Object>} Tablero actualizado
   */
  async updateBoard(boardId, payload) {
    if (!boardId) throw new Error('El boardId es obligatorio');
    return apiClient.patch(`/boards/${boardId}`, payload);
  },

  /**
   * Eliminar un tablero con borrado en cascada de sus columnas y tickets
   * DELETE /api/boards/:boardId
   * @param {string} boardId - ID del tablero
   * @returns {Promise<void>}
   */
  async deleteBoard(boardId) {
    if (!boardId) throw new Error('El boardId es obligatorio');
    return apiClient.delete(`/boards/${boardId}`);
  },
};

export default boardService;
