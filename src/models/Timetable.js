import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema({
  programme: { type: String, required: true },
  course: { type: String, required: true },
  lecturer: { type: String, required: true },
  room: { type: String, required: true },
  fullDateTime: { type: Date, required: true },
  group: { type: String, required: true },
  userId: { type: String, required: true },
  recurring: { type: Boolean, default: false } // This line adds the recurring field
});

export default mongoose.models.Timetable ||
  mongoose.model('Timetable', TimetableSchema);
