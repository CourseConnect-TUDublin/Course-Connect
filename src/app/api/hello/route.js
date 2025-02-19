// src/app/api/hello/route.js
import dbConnect from 'src/lib/dbConnect.js';

export async function GET(request) {
  try {
    // Establish connection to MongoDB
    await dbConnect();
    
    // Return a success JSON response
    return new Response(
      JSON.stringify({ message: 'Hello, World! Connected to MongoDB!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Return an error JSON response if connection fails
    return new Response(
      JSON.stringify({ error: 'Failed to connect to MongoDB', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
