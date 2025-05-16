const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  disciplineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discipline',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for unique course names within a discipline
courseSchema.index({ name: 1, disciplineId: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema); 