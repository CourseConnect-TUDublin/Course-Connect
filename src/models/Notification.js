// src/models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // for session notifications
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"
  },
  // for DM notifications
  conversationId: {
    type: String
  },
  type: {
    type: String,
    required: true  // e.g. 'sessionConfirmed', 'dmMessage'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String    // where to send the user when they click the bell
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Notification ||
       mongoose.model("Notification", NotificationSchema);
