import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, default: "red" }, // "red", "amber", or "green"
  dueDate: { type: Date, required: true },
  priority: { type: String, default: "Medium" },
  category: { type: String },
  subtasks: { type: [String], default: [] },
  archived: { type: Boolean, default: false },
  recurring: { type: Boolean, default: false }  // New field for recurring tasks
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
