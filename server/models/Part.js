const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
    },
    partNumber: {
      type: String,
      required: [true, 'Part number/OEM code is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required (e.g., Brakes, Engine, Suspension)'],
    },
    compatibleVehicles: [
      {
        make: { type: String, required: true },
        model: { type: String, required: true },
        yearRange: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Part', partSchema);
