// /src/models/SessionRequest.js
const mongoose = require('mongoose');

const sessionRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buddy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preferredTimes: { type: [String], required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.models.SessionRequest || mongoose.model('SessionRequest', sessionRequestSchema);
