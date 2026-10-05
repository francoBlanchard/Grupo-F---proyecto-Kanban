const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Board = require('../models/board-model');
const Column = require('../models/column-model');
const Ticket = require('../models/ticket-model');
require('./setup');

describe('Columnas (Columns) API y Parent Check', () => {
  let board;

  beforeEach(async () => {
    board = await Board.create({ title: 'Tablero Principal' });
  });

  describe('POST /api/boards/:boardId/columns', () => {
    it('debe crear una columna en el tablero exitosamente con código 201', async () => {
      const res = await request(app)
        .post(`/api/boards/${board._id}/columns`)
        .send({ title: 'En Progreso', order: 1 });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('En Progreso');
      expect(res.body.boardId).toBe(board._id.toString());
      expect(res.body.order).toBe(1);
    });

    it('debe responder 400 si falta el título de la columna', async () => {
      const res = await request(app)
        .post(`/api/boards/${board._id}/columns`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('debe responder 404 si el tablero padre no existe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/boards/${nonExistentId}/columns`)
        .send({ title: 'Columna huérfana' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tablero no encontrado');
    });

    it('debe responder 400 si boardId tiene formato inválido', async () => {
      const res = await request(app)
        .post('/api/boards/formato-invalido/columns')
        .send({ title: 'Columna' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('ObjectId');
    });
  });

  describe('GET /api/boards/:boardId/columns', () => {
    it('debe listar las columnas del tablero ordenadas', async () => {
      await Column.create([
        { title: 'Segunda', boardId: board._id, order: 2 },
        { title: 'Primera', boardId: board._id, order: 1 }
      ]);

      const res = await request(app).get(`/api/boards/${board._id}/columns`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Primera');
      expect(res.body[1].title).toBe('Segunda');
    });
  });

  describe('Parent Check: GET /api/boards/:boardId/columns/:columnId', () => {
    it('debe obtener la columna si pertenece al tablero indicado', async () => {
      const column = await Column.create({ title: 'Backlog', boardId: board._id });

      const res = await request(app).get(`/api/boards/${board._id}/columns/${column._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(column._id.toString());
    });

    it('debe responder 400 si la columna pertenece a OTRO tablero (Parent Check)', async () => {
      const otherBoard = await Board.create({ title: 'Otro Tablero' });
      const columnOfOtherBoard = await Column.create({ title: 'Columna Ajena', boardId: otherBoard._id });

      const res = await request(app).get(`/api/boards/${board._id}/columns/${columnOfOtherBoard._id}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('La columna no pertenece al tablero especificado');
    });

    it('debe responder 404 si la columna no existe', async () => {
      const nonExistentColumnId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/boards/${board._id}/columns/${nonExistentColumnId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Columna no encontrada');
    });
  });

  describe('DELETE /api/boards/:boardId/columns/:columnId (Borrado en Cascada)', () => {
    it('debe eliminar la columna y sus tickets en cascada sin afectar otras columnas', async () => {
      const columnToDel = await Column.create({ title: 'A borrar', boardId: board._id });
      const otherColumn = await Column.create({ title: 'A conservar', boardId: board._id });

      await Ticket.create({ title: 'Ticket a borrar', columnId: columnToDel._id });
      const keptTicket = await Ticket.create({ title: 'Ticket a conservar', columnId: otherColumn._id });

      const res = await request(app).delete(`/api/boards/${board._id}/columns/${columnToDel._id}`);
      expect(res.status).toBe(204);

      // Columna eliminada
      expect(await Column.findById(columnToDel._id)).toBeNull();
      // Ticket de la columna eliminada debe desaparecer
      expect(await Ticket.countDocuments({ columnId: columnToDel._id })).toBe(0);
      // Otra columna y su ticket deben mantenerse
      expect(await Column.findById(otherColumn._id)).not.toBeNull();
      expect(await Ticket.findById(keptTicket._id)).not.toBeNull();
    });

    it('debe responder 400 si se intenta eliminar una columna que pertenece a otro tablero', async () => {
      const otherBoard = await Board.create({ title: 'Otro Tablero' });
      const columnOfOtherBoard = await Column.create({ title: 'Columna Ajena', boardId: otherBoard._id });

      const res = await request(app).delete(`/api/boards/${board._id}/columns/${columnOfOtherBoard._id}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('La columna no pertenece al tablero especificado');
    });
  });
});
