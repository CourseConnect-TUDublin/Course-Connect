// src/app/api/login/route.js
import dbConnect from '../../../lib/dbConnect.js';
import User from '../../../models/User.js';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await dbConnect();

    // Parse the login data from the request
    const { email, password } = await req.json();
    console.log("Received Login Data:", { email, password });

    // Normalize email and trim password
    const normalizedEmail = email.toLowerCase();
    const trimmedPassword = password.trim();
    console.log("Login trimmed password:", `"${trimmedPassword}"`, `Length: ${trimmedPassword.length}`);

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });
    console.log("Found user:", user);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compare the provided trimmed password with the stored hash
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Remove sensitive fields
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return new Response(
      JSON.stringify({ message: "Login successful", user: userWithoutPassword }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
