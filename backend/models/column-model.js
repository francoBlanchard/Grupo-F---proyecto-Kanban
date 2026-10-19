const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título de la columna es obligatorio'],
      trim: true,
      maxlength: [80, 'El título no puede superar los 80 caracteres']
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'El ID del tablero padre es obligatorio'],
      index: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual para poblar tickets sin embeber arreglos
columnSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'columnId'
});

// Hook de borrado en cascada para document.deleteOne()
columnSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Ticket = mongoose.model('Ticket');
  await Ticket.deleteMany({ columnId: this._id });
});

// Hook de borrado en cascada para findOneAndDelete
columnSchema.pre('findOneAndDelete', async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const Ticket = mongoose.model('Ticket');
  await Ticket.deleteMany({ columnId: doc._id });
});

const Column = mongoose.model('Column', columnSchema);

module.exports = Column;
