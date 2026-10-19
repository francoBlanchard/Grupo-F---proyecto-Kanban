const mongoose = require('mongoose');

/**
 * Middleware factory para validar que uno o más parámetros de la ruta
 * tengan un formato válido de MongoDB ObjectId (24 caracteres hexadecimales).
 * Evita que consultas malformadas generen excepciones CastError no controladas.
 *
 * @param  {...string} paramNames Nombres de los parámetros en req.params (ej: 'boardId', 'columnId', 'ticketId')
 */
const validateObjectId = (...paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      if (id !== undefined && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: `El parámetro '${paramName}' no es un ObjectId de MongoDB válido`
        });
      }
    }
    next();
  };
};

module.exports = validateObjectId;
