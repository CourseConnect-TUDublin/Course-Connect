import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:         { type: String, required: true },
  email:        { type: String, unique: true, required: true },
  password:     { type: String, required: true },
  avatar:       { type: String },
  status:       { type: String, enum: ['online','offline','busy'], default: 'offline' },
  subjects:     { type: [String], required: true },
  availability: { type: [String], required: true },

  // --- Gamification Fields ---
  points:      { type: Number, default: 0 },
  xp:          { type: Number, default: 0 },
  level:       { type: Number, default: 1 },
  streak:      { type: Number, default: 0 },
  lastActivity:{ type: Date },
  badges:      { type: [String], default: [] }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
