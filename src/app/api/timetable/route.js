// /src/app/api/timetable/route.js
import { connectToDatabase } from '../../../lib/dbConnect.js';
import Timetable from '../../../models/Timetable.js';
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = await getToken({ req, secret });
    console.log("Token in GET:", token);  // Log the token to check its structure
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - No token found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Use token.id if available, otherwise use token.sub
    const userId = token.id || token.sub;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Token missing user id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter timetable entries by userId
    const entries = await Timetable.find({ userId });
    return new Response(
      JSON.stringify({ success: true, data: entries }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch timetable entries" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const token = await getToken({ req, secret });
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - No token found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await req.json();
    console.log("Received Data from Frontend:", body);
    
    const userId = token.id || token.sub;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing userId in token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newEntry = new Timetable({
      programme: body.programme,
      course: body.course,
      lecturer: body.lecturer,
      room: body.room,
      fullDateTime: new Date(body.fullDateTime),
      group: body.group,
      userId: userId, // Associate the entry with the logged-in user
    });
    await newEntry.save();
    return new Response(
      JSON.stringify({ success: true, message: "Schedule added successfully", entry: newEntry }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
