const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board-controller');
const columnRouter = require('./column-routes');
const validateObjectId = require('../middlewares/validate-object-id');
const { checkBoardExists } = require('../middlewares/parent-check');

// Anidamiento del enrutador de columnas: /api/boards/:boardId/columns
router.use(
  '/:boardId/columns',
  validateObjectId('boardId'),
  checkBoardExists,
  columnRouter
);

// Rutas de colección: /api/boards
router
  .route('/')
  .post(boardController.createBoard)
  .get(boardController.getAllBoards);

// Rutas de documento específico: /api/boards/:boardId
router
  .route('/:boardId')
  .all(validateObjectId('boardId'))
  .get(boardController.getBoardById)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
