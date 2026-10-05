const express = require('express');
const router = express.Router({ mergeParams: true });
const columnController = require('../controllers/column-controller');
const ticketRouter = require('./ticket-routes');
const validateObjectId = require('../middlewares/validate-object-id');
const { checkColumnBelongsToBoard } = require('../middlewares/parent-check');

// Anidamiento del enrutador de tickets: /api/boards/:boardId/columns/:columnId/tickets
router.use(
  '/:columnId/tickets',
  validateObjectId('columnId'),
  checkColumnBelongsToBoard,
  ticketRouter
);

// Rutas de colección: /api/boards/:boardId/columns
router
  .route('/')
  .post(columnController.createColumn)
  .get(columnController.getColumnsByBoard);

// Rutas de documento específico: /api/boards/:boardId/columns/:columnId
router
  .route('/:columnId')
  .all(validateObjectId('columnId'), checkColumnBelongsToBoard)
  .get(columnController.getColumnById)
  .patch(columnController.updateColumn)
  .delete(columnController.deleteColumn);

module.exports = router;
