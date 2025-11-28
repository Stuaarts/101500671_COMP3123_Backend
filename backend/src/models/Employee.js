const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    position: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    salary: { type: Number, default: 0 },
    dateOfJoining: { type: Date, default: Date.now },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
