import mongoose from "mongoose";
const { Schema } = mongoose;

const FocusLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  intendedDuration: { type: Number, required: true }, // in minutes
  actualDuration: { type: Number, required: true },   // in minutes
  xpEarned: { type: Number, required: true },
  type: { type: String, enum: ["complete", "stopped"], default: "complete" },
}, { timestamps: true });

export default mongoose.models.FocusLog || mongoose.model("FocusLog", FocusLogSchema);
