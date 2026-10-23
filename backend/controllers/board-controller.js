const Board = require('../models/board-model');

/**
 * POST /api/boards
 * Crear un nuevo tablero.
 */
const createBoard = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'El título del tablero es obligatorio' });
    }

    const board = await Board.create({
      title: title.trim(),
      description: description ? description.trim() : ''
    });

    return res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/boards
 * Listar todos los tableros.
 */
const getAllBoards = async (req, res, next) => {
  try {
    const boards = await Board.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'columns',
        options: { sort: { order: 1 } },
        populate: {
          path: 'tickets',
          options: { sort: { order: 1 } }
        }
      });
    return res.status(200).json(boards);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/boards/:boardId
 * Obtener un tablero por su ID con sus columnas y tickets poblados.
 */
const getBoardById = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId).populate({
      path: 'columns',
      options: { sort: { order: 1 } },
      populate: {
        path: 'tickets',
        options: { sort: { order: 1 } }
      }
    });

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    return res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/boards/:boardId
 * Actualizar datos de un tablero.
 */
const updateBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, description } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'El título del tablero no puede estar vacío' });
      }
      board.title = title.trim();
    }

    if (description !== undefined) {
      board.description = typeof description === 'string' ? description.trim() : '';
    }

    await board.save();
    return res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/boards/:boardId
 * Eliminar un tablero con borrado en cascada garantizado (columnas y tickets).
 */
const deleteBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    // Usar deleteOne() sobre el documento para activar el hook de borrado en cascada
    await board.deleteOne();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard
};
