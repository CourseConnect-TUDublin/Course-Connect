// src/lib/dbConnect.js
import mongoose from "mongoose";

// Log environment variable for debugging
console.log("⏳ MONGODB_URI:", process.env.MONGODB_URI);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your .env.local file"
  );
}

// Use globalThis to persist the connection across hot reloads in development
let cached = globalThis.mongoose;
if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Establishing new MongoDB connection...");
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        console.log("🚀 MongoDB connected");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("⛔ MongoDB connection failed:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Export as a named export "connectToDatabase" and also as the default export
export { dbConnect as connectToDatabase };
export default dbConnect;
