// src/models/Timetable.js
import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  programme: String,
  course: String,
  lecturer: String,
  room: String,
  fullDateTime: Date,
  group: String,
});

// Prevent model overwrite in development
const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);

export default Timetable;
