const mongoose = require('mongoose');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const stockSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      enum: bloodGroups,
      required: true,
      unique: true,
    },
    unitsAvailable: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stock', stockSchema);
