import mongoose from "mongoose";
const { Schema } = mongoose;

const FlashcardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Flashcard || mongoose.model("Flashcard", FlashcardSchema);
