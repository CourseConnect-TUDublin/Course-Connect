import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageSchema = new Schema({
  room:      { type: String, required: true, index: true },
  sender:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
