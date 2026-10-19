/**
 * Middleware global de manejo de errores.
 * Garantiza respuestas uniformes en formato JSON: { "error": "Mensaje descriptivo" }
 * y previene la exposición de stack traces en producción.
 */
const errorHandler = (err, req, res, next) => {
  // Manejo de JSON malformado en el body de la petición
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Cuerpo de la petición (JSON) con sintaxis inválida' });
  }

  // Manejo de errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Manejo de CastError de Mongoose (en caso de que algún ID no haya sido interceptado por el middleware)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Formato inválido para el campo '${err.path}': valor proporcionado '${err.value}'`
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Error interno del servidor'
      : err.message || 'Error interno del servidor';

  return res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
