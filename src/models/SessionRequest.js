// src/models/SessionRequest.js
import mongoose from 'mongoose';

const SessionRequestSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  from: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending','accepted','declined'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SessionRequest || mongoose.model('SessionRequest', SessionRequestSchema);
