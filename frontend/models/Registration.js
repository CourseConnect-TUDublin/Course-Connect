import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Make userId required
  },
  disciplineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discipline',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
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
    trim: true
  },
  selectedModules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
registrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add index to prevent duplicate registrations for the same user and course
registrationSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models?.Registration || mongoose.model('Registration', registrationSchema);