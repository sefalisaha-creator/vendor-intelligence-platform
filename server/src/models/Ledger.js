const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'An experience ledger entry must be tied to a specific vendor'],
    },
    author: {
      type: String,
      required: [true, 'Author name or Department is required'],
      trim: true,
    },
    entryType: {
      type: String,
      enum: ['Review', 'Success Story', 'Warning'],
      required: [true, 'Entry type must be Review, Success Story, or Warning'],
    },
    message: {
      type: String,
      required: [true, 'Ledger commentary details cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ledger', LedgerSchema);