const mongoose = require('mongoose');

const studyPathSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  group: {
    type: String,
    required: true,
    trim: true
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

module.exports = mongoose.model('StudyPath', studyPathSchema); 