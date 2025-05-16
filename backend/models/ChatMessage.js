const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  room: String,
  userId: String,
  userName: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 