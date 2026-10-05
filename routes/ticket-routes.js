const express = require('express');
const router = express.Router({ mergeParams: true });
const ticketController = require('../controllers/ticket-controller');
const validateObjectId = require('../middlewares/validate-object-id');
const { checkTicketBelongsToColumn } = require('../middlewares/parent-check');

// Rutas de colección: /api/boards/:boardId/columns/:columnId/tickets
router
  .route('/')
  .post(ticketController.createTicket)
  .get(ticketController.getTicketsByColumn);

// Rutas de documento específico: /api/boards/:boardId/columns/:columnId/tickets/:ticketId
router
  .route('/:ticketId')
  .all(validateObjectId('ticketId'), checkTicketBelongsToColumn)
  .get(ticketController.getTicketById)
  .patch(ticketController.updateTicket)
  .delete(ticketController.deleteTicket);

module.exports = router;
