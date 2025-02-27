// /src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Study Buddy Fields:
  subjects: { type: [String], default: [] },
  availability: { type: [String], default: [] },
  learningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
    default: 'reading'
  },
  academicGoals: { type: String },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
