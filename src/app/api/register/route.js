// src/app/api/register/route.js
import dbConnect from '../../../lib/dbConnect.js';
import User from '../../../models/User.js';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();
    console.log("Received registration data:", { name, email, password });

    const normalizedEmail = email.toLowerCase();
    const trimmedPassword = password.trim();
    console.log("Registration trimmed password:", `"${trimmedPassword}"`, `Length: ${trimmedPassword.length}`);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    await newUser.save();

    return new Response(
      JSON.stringify({ message: "Registration successful" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
