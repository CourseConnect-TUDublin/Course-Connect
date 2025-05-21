// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect.js';
import User from '../../../models/User.js';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse and validate incoming JSON
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing name, email, or password' },
        { status: 400 }
      );
    }

    console.log('Received registration data:', { name, email, password });

    // Normalize and trim inputs
    const normalizedEmail = email.toLowerCase();
    const trimmedPassword = password.trim();
    console.log(
      'Registration trimmed password:',
      `"${trimmedPassword}"`,
      `Length: ${trimmedPassword.length}`
    );

    // Check for existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      subjects: [],
      availability: [],
      learningStyle: 'reading',
    });
    await newUser.save();

    // Respond with success
    return NextResponse.json(
      { message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
