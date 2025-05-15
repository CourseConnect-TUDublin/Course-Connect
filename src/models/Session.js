import mongoose from 'mongoose';
const { Schema } = mongoose;

const SessionSchema = new Schema({
  host:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  datetime:     { type: Date, required: true },
  createdAt:    { type: Date, default: Date.now }
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
