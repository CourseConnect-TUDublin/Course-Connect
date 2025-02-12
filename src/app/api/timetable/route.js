// src/app/api/timetable/route.js

import { connectToDatabase } from 'src/lib/dbConnect.js';
import Timetable from 'src/models/Timetable.js';

/**
 * GET endpoint to fetch all timetable entries from MongoDB.
 */
export async function GET(req) {
  try {
    // Connect to MongoDB.
    await connectToDatabase();

    // Retrieve all timetable entries from the database.
    const entries = await Timetable.find();

    return new Response(
      JSON.stringify({ success: true, data: entries }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch timetable entries" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * POST endpoint for adding a new timetable entry.
 * Expects a JSON payload with the following fields:
 * - programme (string)
 * - course (string)
 * - lecturer (string)
 * - room (string)
 * - fullDateTime (string in a format recognized by Date, e.g., ISO string)
 * - group (string, optional)
 */
export async function POST(req) {
  try {
    // Connect to MongoDB.
    await connectToDatabase();

    // Parse the JSON body from the request.
    const body = await req.json();
    console.log("Received Data from Frontend:", body);

    // Validate required fields.
    if (!body.course || !body.lecturer || !body.room || !body.fullDateTime) {
      console.error("Missing field in API request:", body);
      return new Response(
        JSON.stringify({ success: false, error: "All required fields are needed!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate the fullDateTime format.
    const combinedDateTime = new Date(body.fullDateTime);
    if (isNaN(combinedDateTime.getTime())) {
      console.error("Invalid fullDateTime format received:", body.fullDateTime);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid date format!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a new timetable entry document.
    const newEntry = new Timetable({
      programme: body.programme,
      course: body.course,
      lecturer: body.lecturer,
      room: body.room,
      fullDateTime: combinedDateTime,
      group: body.group,
    });

    // Save the entry to MongoDB.
    await newEntry.save();

    return new Response(
      JSON.stringify({ success: true, message: "Schedule added successfully", entry: newEntry }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
