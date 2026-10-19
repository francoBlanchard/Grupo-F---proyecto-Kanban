import apiClient from './client';

/**
 * Servicio de integración para el recurso Tickets (/api/boards/:boardId/columns/:columnId/tickets)
 */
export const ticketService = {
  /**
   * Listar todos los tickets pertenecientes a una columna
   * GET /api/boards/:boardId/columns/:columnId/tickets
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @returns {Promise<Array>} Lista de tickets ordenados
   */
  async getTickets(boardId, columnId) {
    if (!boardId || !columnId) throw new Error('boardId y columnId son obligatorios');
    return apiClient.get(`/boards/${boardId}/columns/${columnId}/tickets`);
  },

  /**
   * Obtener un ticket específico por su ID
   * GET /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @param {string} ticketId - ID del ticket
   * @returns {Promise<Object>} Ticket
   */
  async getTicketById(boardId, columnId, ticketId) {
    if (!boardId || !columnId || !ticketId) {
      throw new Error('boardId, columnId y ticketId son obligatorios');
    }
    return apiClient.get(`/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`);
  },

  /**
   * Crear un nuevo ticket dentro de una columna
   * POST /api/boards/:boardId/columns/:columnId/tickets
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna padre
   * @param {Object} payload - { title: string, description?: string, priority?: 'low'|'medium'|'high', order?: number }
   * @returns {Promise<Object>} Ticket creado
   */
  async createTicket(boardId, columnId, payload) {
    if (!boardId || !columnId) throw new Error('boardId y columnId son obligatorios');
    if (!payload?.title?.trim()) {
      throw new Error('El título del ticket es obligatorio');
    }

    return apiClient.post(`/boards/${boardId}/columns/${columnId}/tickets`, {
      title: payload.title.trim(),
      description: payload.description ? payload.description.trim() : '',
      priority: payload.priority || 'medium',
      ...(payload.order !== undefined && { order: payload.order }),
    });
  },

  /**
   * Mover ticket de columna o actualizar sus propiedades (Optimistic UI target)
   * PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   * @param {string} boardId - ID del tablero actual
   * @param {string} columnId - ID de la columna de origen
   * @param {string} ticketId - ID del ticket a modificar
   * @param {Object} payload - { title?: string, description?: string, priority?: string, order?: number, targetColumnId?: string }
   * @returns {Promise<Object>} Ticket actualizado
   */
  async updateTicket(boardId, columnId, ticketId, payload) {
    if (!boardId || !columnId || !ticketId) {
      throw new Error('boardId, columnId y ticketId son obligatorios');
    }
    return apiClient.patch(
      `/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`,
      payload
    );
  },

  /**
   * Eliminar un ticket específico
   * DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId
   * @param {string} boardId - ID del tablero
   * @param {string} columnId - ID de la columna
   * @param {string} ticketId - ID del ticket
   * @returns {Promise<void>}
   */
  async deleteTicket(boardId, columnId, ticketId) {
    if (!boardId || !columnId || !ticketId) {
      throw new Error('boardId, columnId y ticketId son obligatorios');
    }
    return apiClient.delete(`/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`);
  },
};

export default ticketService;
