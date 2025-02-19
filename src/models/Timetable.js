import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Links timetable entry to a user
  programme: { type: String, required: true },
  course: { type: String, required: true },
  lecturer: { type: String, required: true },
  room: { type: String, required: true },
  fullDateTime: { type: Date, required: true },
  group: { type: String, required: true }
});

export default mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);
