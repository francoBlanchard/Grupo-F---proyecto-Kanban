const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB utilizando la variable de entorno MONGODB_URI.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('La variable de entorno MONGODB_URI no está definida.');
  }

  try {
    const conn = await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[MongoDB] Conectado exitosamente: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Error al conectar: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
