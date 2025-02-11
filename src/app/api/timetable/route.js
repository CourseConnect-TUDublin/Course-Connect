// src/app/api/timetable/route.js

import dbConnect from 'src/lib/dbConnect.js';
import Timetable from 'src/models/Timetable.js';

/**
 * GET endpoint to fetch all timetable entries from MongoDB.
 */
export async function GET(req) {
  try {
    // Connect to MongoDB.
    await dbConnect();

    // Retrieve all timetable entries from the database.
    const entries = await Timetable.find();

    return new Response(
      JSON.stringify({ data: entries }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch timetable entries" }),
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
 * - course (string)
 * - lecturer (string)
 * - room (string)
 * - date (string, e.g., "2025-02-15")
 * - time (string, e.g., "14:30:00")
 */
export async function POST(req) {
  try {
    // Connect to MongoDB.
    await dbConnect();

    // Parse the JSON body from the request.
    const body = await req.json();
    console.log("Received Data from Frontend:", body);

    // Validate required fields.
    if (!body.course || !body.lecturer || !body.room || !body.date || !body.time) {
      console.error("Missing field in API request:", body);
      return new Response(
        JSON.stringify({ error: "All fields are required!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate the date and time formats.
    const date = new Date(body.date);
    // Create a Date object from the time portion.
    const time = new Date(`1970-01-01T${body.time}`);

    if (isNaN(date.getTime()) || isNaN(time.getTime())) {
      console.error("Invalid Date/Time format received:", { date: body.date, time: body.time });
      return new Response(
        JSON.stringify({ error: "Invalid date or time format!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Combine date and time into one Date object.
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    console.log("Final Stored Event Date:", combinedDateTime);

    // Create a new timetable entry document.
    const newEntry = new Timetable({
      course: body.course,
      lecturer: body.lecturer,
      room: body.room,
      fullDateTime: combinedDateTime,
    });

    // Save the entry to MongoDB.
    await newEntry.save();

    return new Response(
      JSON.stringify({ message: "Schedule added successfully", entry: newEntry }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
