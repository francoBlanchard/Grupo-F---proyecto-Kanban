const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Board = require('../models/board-model');
const Column = require('../models/column-model');
const Ticket = require('../models/ticket-model');
require('./setup');

describe('Tableros (Boards) API', () => {
  describe('POST /api/boards', () => {
    it('debe crear un tablero exitosamente con código 201', async () => {
      const res = await request(app)
        .post('/api/boards')
        .send({ title: 'Proyecto Alfa', description: 'Tablero principal' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Proyecto Alfa');
      expect(res.body.description).toBe('Tablero principal');
    });

    it('debe responder 400 si falta el título', async () => {
      const res = await request(app)
        .post('/api/boards')
        .send({ description: 'Sin título' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('debe responder 400 si el título está vacío', async () => {
      const res = await request(app)
        .post('/api/boards')
        .send({ title: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('título');
    });
  });

  describe('GET /api/boards', () => {
    it('debe listar todos los tableros creados', async () => {
      await Board.create([
        { title: 'Tablero 1' },
        { title: 'Tablero 2' }
      ]);

      const res = await request(app).get('/api/boards');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/boards/:boardId', () => {
    it('debe obtener un tablero con sus columnas y tickets poblados', async () => {
      const board = await Board.create({ title: 'Tablero Jerárquico' });
      const column = await Column.create({ title: 'Por Hacer', boardId: board._id });
      await Ticket.create({ title: 'Diseñar API', columnId: column._id });

      const res = await request(app).get(`/api/boards/${board._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(board._id.toString());
      expect(res.body.columns).toHaveLength(1);
      expect(res.body.columns[0].title).toBe('Por Hacer');
      expect(res.body.columns[0].tickets).toHaveLength(1);
      expect(res.body.columns[0].tickets[0].title).toBe('Diseñar API');
    });

    it('debe responder 400 si boardId no es un ObjectId válido', async () => {
      const res = await request(app).get('/api/boards/id-invalido-123');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('ObjectId');
    });

    it('debe responder 404 si el tablero no existe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/boards/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tablero no encontrado');
    });
  });

  describe('PATCH /api/boards/:boardId', () => {
    it('debe actualizar el título y descripción del tablero', async () => {
      const board = await Board.create({ title: 'Original', description: 'Desc' });

      const res = await request(app)
        .patch(`/api/boards/${board._id}`)
        .send({ title: 'Modificado', description: 'Nueva desc' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Modificado');
      expect(res.body.description).toBe('Nueva desc');
    });

    it('debe responder 400 si se intenta actualizar con un título vacío', async () => {
      const board = await Board.create({ title: 'Original' });

      const res = await request(app)
        .patch(`/api/boards/${board._id}`)
        .send({ title: '   ' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/boards/:boardId (Borrado en Cascada)', () => {
    it('debe eliminar el tablero y en cascada todas sus columnas y tickets asociados', async () => {
      const board = await Board.create({ title: 'Tablero a borrar' });
      const column1 = await Column.create({ title: 'Col 1', boardId: board._id });
      const column2 = await Column.create({ title: 'Col 2', boardId: board._id });
      await Ticket.create({ title: 'Ticket 1', columnId: column1._id });
      await Ticket.create({ title: 'Ticket 2', columnId: column2._id });

      // Verificamos existencia previa
      expect(await Column.countDocuments({ boardId: board._id })).toBe(2);
      expect(await Ticket.countDocuments({ columnId: { $in: [column1._id, column2._id] } })).toBe(2);

      // Eliminar tablero
      const res = await request(app).delete(`/api/boards/${board._id}`);
      expect(res.status).toBe(204);

      // Verificar que el tablero fue eliminado
      const foundBoard = await Board.findById(board._id);
      expect(foundBoard).toBeNull();

      // Verificar que las columnas asociadas fueron eliminadas
      const foundColumns = await Column.find({ boardId: board._id });
      expect(foundColumns).toHaveLength(0);

      // Verificar que los tickets asociados fueron eliminados
      const foundTickets = await Ticket.find({ columnId: { $in: [column1._id, column2._id] } });
      expect(foundTickets).toHaveLength(0);
    });

    it('debe responder 404 si el tablero a eliminar no existe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/boards/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tablero no encontrado');
    });
  });
});
