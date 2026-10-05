const mongoose = require('mongoose');
const Ticket = require('../models/ticket-model');
const Column = require('../models/column-model');

/**
 * POST /api/boards/:boardId/columns/:columnId/tickets
 * Crear un ticket dentro de una columna.
 */
const createTicket = async (req, res, next) => {
  try {
    const { columnId } = req.params;
    const { title, description, priority, order } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'El título del ticket es obligatorio' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        error: "La prioridad del ticket debe ser 'low', 'medium' o 'high'"
      });
    }

    let ticketOrder = 0;
    if (order !== undefined && typeof order === 'number') {
      ticketOrder = order;
    } else {
      const count = await Ticket.countDocuments({ columnId });
      ticketOrder = count;
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      columnId,
      priority: priority || 'medium',
      order: ticketOrder
    });

    return res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/boards/:boardId/columns/:columnId/tickets
 * Listar todos los tickets pertenecientes a una columna.
 */
const getTicketsByColumn = async (req, res, next) => {
  try {
    const { columnId } = req.params;
    const tickets = await Ticket.find({ columnId }).sort({ order: 1 });
    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/boards/:boardId/columns/:columnId/tickets/:ticketId
 * Obtener un ticket específico.
 */
const getTicketById = async (req, res, next) => {
  try {
    return res.status(200).json(req.ticket);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
 * Mover ticket de columna o actualizar su contenido.
 * Valida la existencia y pertenencia de la columna destino (targetColumnId).
 */
const updateTicket = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, description, priority, order, targetColumnId } = req.body;
    const ticket = req.ticket;

    // Validación y movimiento a columna destino (targetColumnId)
    if (targetColumnId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(targetColumnId)) {
        return res.status(400).json({
          error: "El parámetro 'targetColumnId' no es un ObjectId válido"
        });
      }

      const targetColumn = await Column.findById(targetColumnId);
      if (!targetColumn) {
        return res.status(404).json({
          error: 'Columna de destino no encontrada'
        });
      }

      if (targetColumn.boardId.toString() !== boardId) {
        return res.status(400).json({
          error: 'La columna de destino no pertenece al tablero actual'
        });
      }

      ticket.columnId = targetColumnId;
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'El título del ticket no puede estar vacío' });
      }
      ticket.title = title.trim();
    }

    if (description !== undefined) {
      ticket.description = typeof description === 'string' ? description.trim() : '';
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
          error: "La prioridad del ticket debe ser 'low', 'medium' o 'high'"
        });
      }
      ticket.priority = priority;
    }

    if (order !== undefined) {
      if (typeof order !== 'number') {
        return res.status(400).json({ error: 'El orden del ticket debe ser un número' });
      }
      ticket.order = order;
    }

    await ticket.save();
    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId
 * Eliminar un ticket.
 */
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = req.ticket;
    await ticket.deleteOne();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTicketsByColumn,
  getTicketById,
  updateTicket,
  deleteTicket
};
