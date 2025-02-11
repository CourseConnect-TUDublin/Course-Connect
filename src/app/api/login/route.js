// src/app/api/login/route.js
import dbConnect from 'src/lib/dbConnect.js';
import User from 'src/models/User.js';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse the login data from the request
    const { email, password } = await req.json();
    console.log("Received Login Data:", { email, password });

    // Find the user by email (normalize the email to lowercase)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize the user object by removing the password field
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Successful login
    return new Response(
      JSON.stringify({ message: "Login successful", user: userWithoutPassword }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
