// src/models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true
  },
  type: {
    type: String,
    required: true  // e.g. 'sessionConfirmed'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Notification ||
       mongoose.model("Notification", NotificationSchema);
