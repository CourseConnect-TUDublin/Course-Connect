// src/models/Flashcard.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const FlashcardSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  // You can add: userId, tags, subject, createdAt, etc.
});

export default mongoose.models.Flashcard || mongoose.model("Flashcard", FlashcardSchema);
