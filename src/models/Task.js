import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  priority: { type: String, default: "Medium" },
  category: { type: String },
  subtasks: { type: [String], default: [] },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
