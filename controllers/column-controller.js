const Column = require('../models/column-model');

/**
 * POST /api/boards/:boardId/columns
 * Crear una nueva columna dentro de un tablero.
 */
const createColumn = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, order } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'El título de la columna es obligatorio' });
    }

    let columnOrder = 0;
    if (order !== undefined && typeof order === 'number') {
      columnOrder = order;
    } else {
      const count = await Column.countDocuments({ boardId });
      columnOrder = count;
    }

    const column = await Column.create({
      title: title.trim(),
      boardId,
      order: columnOrder
    });

    return res.status(201).json(column);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/boards/:boardId/columns
 * Listar todas las columnas pertenecientes a un tablero.
 */
const getColumnsByBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const columns = await Column.find({ boardId })
      .sort({ order: 1 })
      .populate({
        path: 'tickets',
        options: { sort: { order: 1 } }
      });

    return res.status(200).json(columns);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/boards/:boardId/columns/:columnId
 * Obtener una columna específica por su ID.
 */
const getColumnById = async (req, res, next) => {
  try {
    const column = await req.column.populate({
      path: 'tickets',
      options: { sort: { order: 1 } }
    });

    return res.status(200).json(column);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/boards/:boardId/columns/:columnId
 * Actualizar título u orden de una columna.
 */
const updateColumn = async (req, res, next) => {
  try {
    const { title, order } = req.body;
    const column = req.column;

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'El título de la columna no puede estar vacío' });
      }
      column.title = title.trim();
    }

    if (order !== undefined) {
      if (typeof order !== 'number') {
        return res.status(400).json({ error: 'El orden de la columna debe ser un número' });
      }
      column.order = order;
    }

    await column.save();
    return res.status(200).json(column);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/boards/:boardId/columns/:columnId
 * Eliminar una columna con borrado en cascada de sus tickets asociados.
 */
const deleteColumn = async (req, res, next) => {
  try {
    const column = req.column;

    // Usar deleteOne() sobre el documento para activar el hook de borrado en cascada
    await column.deleteOne();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn
};
