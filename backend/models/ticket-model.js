const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del ticket es obligatorio'],
      trim: true,
      maxlength: [150, 'El título no puede superar los 150 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'La descripción no puede superar los 2000 caracteres'],
      default: ''
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      required: [true, 'El ID de la columna padre es obligatorio'],
      index: true
    },
    order: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'La prioridad debe ser low, medium o high'
      },
      default: 'medium'
    }
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
