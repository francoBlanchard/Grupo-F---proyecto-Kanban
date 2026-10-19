const Board = require('../models/board-model');
const Column = require('../models/column-model');
const Ticket = require('../models/ticket-model');

/**
 * Middleware que verifica que el tablero especificado en :boardId exista en la BD.
 */
const checkBoardExists = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware que verifica que la columna especificada en :columnId exista
 * y pertenezca efectivamente al tablero especificado en :boardId.
 */
const checkColumnBelongsToBoard = async (req, res, next) => {
  try {
    const { boardId, columnId } = req.params;
    const column = await Column.findById(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Columna no encontrada' });
    }

    if (column.boardId.toString() !== boardId) {
      return res.status(400).json({
        error: 'La columna no pertenece al tablero especificado'
      });
    }

    req.column = column;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware que verifica que el ticket especificado en :ticketId exista
 * y pertenezca efectivamente a la columna especificada en :columnId.
 */
const checkTicketBelongsToColumn = async (req, res, next) => {
  try {
    const { columnId, ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    if (ticket.columnId.toString() !== columnId) {
      return res.status(400).json({
        error: 'El ticket no pertenece a la columna especificada'
      });
    }

    req.ticket = ticket;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkBoardExists,
  checkColumnBelongsToBoard,
  checkTicketBelongsToColumn
};
