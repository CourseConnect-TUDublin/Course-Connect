// src/app/api/register/route.js

import dbConnect from '../../../lib/dbConnect.js';
import User from '../../../models/User.js';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    // Ensure a connection to MongoDB
    await dbConnect();

    // Parse the JSON body from the request
    const { name, email, password } = await req.json();

    // Normalize the email to lowercase to avoid duplicates
    const normalizedEmail = email.toLowerCase();

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document using the User model
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return new Response(
      JSON.stringify({ message: "Registration successful" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
