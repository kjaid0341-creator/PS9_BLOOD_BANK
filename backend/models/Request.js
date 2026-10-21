const mongoose = require('mongoose');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const requestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroups,
      required: [true, 'Blood group is required'],
    },
    units: {
      type: Number,
      required: [true, 'Units required is mandatory'],
      min: [1, 'At least 1 unit is required'],
    },
    hospital: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    requiredByDate: {
      type: Date,
      required: [true, 'Required-by date is mandatory'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);
