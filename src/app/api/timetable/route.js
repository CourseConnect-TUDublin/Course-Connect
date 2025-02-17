// src/app/api/timetable/route.js
import { connectToDatabase } from '../../../lib/dbConnect.js';
import Timetable from '../../../models/Timetable.js';

export async function GET(req) {
  try {
    const conn = await connectToDatabase();
    console.log("Mongoose connection readyState:", conn.connection.readyState); // Should be 1 for connected

    const entries = await Timetable.find();
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
    const body = await req.json();
    console.log("Received Data from Frontend:", body);
    const newEntry = new Timetable({
      programme: body.programme,
      course: body.course,
      lecturer: body.lecturer,
      room: body.room,
      fullDateTime: new Date(body.fullDateTime),
      group: body.group,
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
