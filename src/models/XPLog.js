import mongoose from "mongoose";
const { Schema } = mongoose;

const XPLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true }, // e.g. "focus-session"
  date: { type: Date, default: Date.now },
});

export default mongoose.models.XPLog || mongoose.model("XPLog", XPLogSchema);
