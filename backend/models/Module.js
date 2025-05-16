const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
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
  semester: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  credits: {
    type: Number,
    required: true,
    default: 5,
    min: 1,
    max: 30
  },
  isElective: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for unique module names within a course
moduleSchema.index(
  { name: 1, courseId: 1, year: 1, semester: 1 },
  { unique: true }
);

module.exports = mongoose.model('Module', moduleSchema); 