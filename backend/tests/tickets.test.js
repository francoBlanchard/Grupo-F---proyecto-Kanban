const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Board = require('../models/board-model');
const Column = require('../models/column-model');
const Ticket = require('../models/ticket-model');
require('./setup');

describe('Tickets API, Parent Check y Movimiento', () => {
  let board;
  let column1;
  let column2;

  beforeEach(async () => {
    board = await Board.create({ title: 'Tablero Sprint' });
    column1 = await Column.create({ title: 'Por Hacer', boardId: board._id, order: 0 });
    column2 = await Column.create({ title: 'En Progreso', boardId: board._id, order: 1 });
  });

  describe('POST /api/boards/:boardId/columns/:columnId/tickets', () => {
    it('debe crear un ticket dentro de la columna con código 201', async () => {
      const res = await request(app)
        .post(`/api/boards/${board._id}/columns/${column1._id}/tickets`)
        .send({
          title: 'Configurar Docker',
          description: 'Crear Dockerfile y docker-compose',
          priority: 'high'
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Configurar Docker');
      expect(res.body.columnId).toBe(column1._id.toString());
      expect(res.body.priority).toBe('high');
    });

    it('debe responder 400 si falta el título del ticket', async () => {
      const res = await request(app)
        .post(`/api/boards/${board._id}/columns/${column1._id}/tickets`)
        .send({ priority: 'low' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('debe responder 400 si la prioridad no es válida', async () => {
      const res = await request(app)
        .post(`/api/boards/${board._id}/columns/${column1._id}/tickets`)
        .send({ title: 'Test', priority: 'urgente' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('prioridad');
    });

    it('debe responder 400 si la columna no pertenece al tablero provisto en la URL', async () => {
      const otherBoard = await Board.create({ title: 'Otro Tablero' });

      const res = await request(app)
        .post(`/api/boards/${otherBoard._id}/columns/${column1._id}/tickets`)
        .send({ title: 'Ticket Inválido' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('La columna no pertenece al tablero especificado');
    });
  });

  describe('Parent Check: GET /api/boards/:boardId/columns/:columnId/tickets/:ticketId', () => {
    it('debe obtener el ticket si pertenece a la columna', async () => {
      const ticket = await Ticket.create({
        title: 'Crear esquema',
        columnId: column1._id
      });

      const res = await request(app)
        .get(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Crear esquema');
    });

    it('debe responder 400 si el ticket pertenece a OTRA columna', async () => {
      const ticketInCol2 = await Ticket.create({
        title: 'Ticket en col 2',
        columnId: column2._id
      });

      const res = await request(app)
        .get(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticketInCol2._id}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El ticket no pertenece a la columna especificada');
    });

    it('debe responder 400 si ticketId tiene formato inválido', async () => {
      const res = await request(app)
        .get(`/api/boards/${board._id}/columns/${column1._id}/tickets/formato-invalido`);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('ObjectId');
    });

    it('debe responder 404 si el ticket no existe', async () => {
      const nonExistentTicketId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/boards/${board._id}/columns/${column1._id}/tickets/${nonExistentTicketId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Ticket no encontrado');
    });
  });

  describe('PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId (Actualizar y Mover)', () => {
    let ticket;

    beforeEach(async () => {
      ticket = await Ticket.create({
        title: 'Ticket de prueba',
        description: 'Inicial',
        priority: 'medium',
        columnId: column1._id
      });
    });

    it('debe actualizar los campos del ticket correctamente', async () => {
      const res = await request(app)
        .patch(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`)
        .send({
          title: 'Título modificado',
          priority: 'high'
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Título modificado');
      expect(res.body.priority).toBe('high');
    });

    it('debe mover el ticket a otra columna (targetColumnId) del mismo tablero', async () => {
      const res = await request(app)
        .patch(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`)
        .send({
          targetColumnId: column2._id.toString()
        });

      expect(res.status).toBe(200);
      expect(res.body.columnId).toBe(column2._id.toString());

      // Verificar persistencia en base de datos
      const updated = await Ticket.findById(ticket._id);
      expect(updated.columnId.toString()).toBe(column2._id.toString());
    });

    it('debe responder 400 si targetColumnId no es un ObjectId válido', async () => {
      const res = await request(app)
        .patch(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`)
        .send({ targetColumnId: 'id-invalido' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('ObjectId');
    });

    it('debe responder 404 si targetColumnId no existe en la base de datos', async () => {
      const nonExistentColumnId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .patch(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`)
        .send({ targetColumnId: nonExistentColumnId.toString() });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Columna de destino no encontrada');
    });

    it('debe responder 400 si targetColumnId pertenece a otro tablero', async () => {
      const otherBoard = await Board.create({ title: 'Otro Proyecto' });
      const columnOfOtherBoard = await Column.create({ title: 'Columna Otra', boardId: otherBoard._id });

      const res = await request(app)
        .patch(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`)
        .send({ targetColumnId: columnOfOtherBoard._id.toString() });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('La columna de destino no pertenece al tablero actual');
    });
  });

  describe('DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId', () => {
    it('debe eliminar el ticket exitosamente con código 204', async () => {
      const ticket = await Ticket.create({
        title: 'Ticket para borrar',
        columnId: column1._id
      });

      const res = await request(app)
        .delete(`/api/boards/${board._id}/columns/${column1._id}/tickets/${ticket._id}`);

      expect(res.status).toBe(204);
      expect(await Ticket.findById(ticket._id)).toBeNull();
    });

    it('debe responder 400 si se intenta eliminar un ticket indicando la columna equivocada', async () => {
      const ticketInCol1 = await Ticket.create({
        title: 'Ticket en col 1',
        columnId: column1._id
      });

      const res = await request(app)
        .delete(`/api/boards/${board._id}/columns/${column2._id}/tickets/${ticketInCol1._id}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El ticket no pertenece a la columna especificada');
    });
  });
});
