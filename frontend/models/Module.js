import mongoose from 'mongoose';

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
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  studyPathId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'StudyPath'
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
  isElective: {
    type: Boolean,
    required: true,
    default: false
  },
  credits: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for common queries
moduleSchema.index({ courseId: 1, year: 1, semester: 1 });
moduleSchema.index({ studyPathId: 1 });
moduleSchema.index({ code: 1 }, { unique: true });

// Export the model, using mongoose.models to prevent model recompilation
export default mongoose.models?.Module || mongoose.model('Module', moduleSchema); 