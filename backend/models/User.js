const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  selectedCourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  selectedStudyPathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyPath'
  },
  selectedModuleIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  registrationComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 