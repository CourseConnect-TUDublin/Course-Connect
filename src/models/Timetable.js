// src/models/Timetable.js

import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema(
  {
    course: { type: String, required: true },
    lecturer: { type: String, required: true },
    room: { type: String, required: true },
    // We'll store the combined date and time as a single Date field.
    fullDateTime: { type: Date, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent model recompilation in development
export default mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);
