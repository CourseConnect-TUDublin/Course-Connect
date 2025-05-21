const mongoose = require('mongoose');

const studyPathSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    ref: 'Course'
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  group: {
    type: String,
    required: true,
    enum: ['General', 'A', 'B', 'C']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for unique study paths
studyPathSchema.index(
  { courseId: 1, year: 1, semester: 1, group: 1 },
  { unique: true }
);

const StudyPath = mongoose.model('StudyPath', studyPathSchema);

module.exports = StudyPath; 