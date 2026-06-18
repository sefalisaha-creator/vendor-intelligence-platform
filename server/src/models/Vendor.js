const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category (e.g., Facility, IT, Logistics) is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Operating city is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Under Review', 'Escalated', 'Strategic Partner', 'Archived'],
      default: 'Active',
    },
    departmentsUsed: [
      {
        type: String,
        trim: true,
      },
    ],
    scorecard: {
      slaCompliance: { type: Number, min: 0, max: 5, default: 5 },
      communication: { type: Number, min: 0, max: 5, default: 5 },
      qualityOfService: { type: Number, min: 0, max: 5, default: 5 },
    },
    activeContracts: [
      {
        contractId: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        description: String,
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Vendor', VendorSchema);