const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del tablero es obligatorio'],
      trim: true,
      maxlength: [120, 'El título no puede superar los 120 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar los 500 caracteres'],
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual para poblar columnas sin embeber arreglos en el documento
boardSchema.virtual('columns', {
  ref: 'Column',
  localField: '_id',
  foreignField: 'boardId'
});

// Hook de borrado en cascada para document.deleteOne()
boardSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Column = mongoose.model('Column');
  const Ticket = mongoose.model('Ticket');

  const columns = await Column.find({ boardId: this._id }).select('_id');
  const columnIds = columns.map(c => c._id);

  if (columnIds.length > 0) {
    await Ticket.deleteMany({ columnId: { $in: columnIds } });
    await Column.deleteMany({ boardId: this._id });
  }
});

// Hook de borrado en cascada para findOneAndDelete
boardSchema.pre('findOneAndDelete', async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const Column = mongoose.model('Column');
  const Ticket = mongoose.model('Ticket');

  const columns = await Column.find({ boardId: doc._id }).select('_id');
  const columnIds = columns.map(c => c._id);

  if (columnIds.length > 0) {
    await Ticket.deleteMany({ columnId: { $in: columnIds } });
    await Column.deleteMany({ boardId: doc._id });
  }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
