const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const boardRoutes = require('./routes/board-routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montaje de rutas jerárquicas
app.use('/api/boards', boardRoutes);

// Manejo de rutas inexistentes (404)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Middleware global de manejo de errores
app.use(errorHandler);

// Iniciar servidor solo si no estamos en entorno de testing
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`[Servidor] Escuchando en el puerto ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[Servidor] No se pudo iniciar el servidor debido a error de BD:', err);
      process.exit(1);
    });
}

module.exports = app;
