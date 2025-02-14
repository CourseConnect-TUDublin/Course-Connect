
import { NextResponse } from "next/server";

// In-memory database to store timetable entries
let timetableData = [];

// GET: Retrieve all timetable entries
export async function GET() {
  // (For now, simply return the stored events.
  // You could later generate recurring event occurrences here.)
  return NextResponse.json({ data: timetableData });
}

// POST: Add a new timetable entry
export async function POST(req) {
  try {
    const newEntry = await req.json();

    // Validate that all required fields are provided
    if (
      !newEntry.course ||
      !newEntry.lecturer ||
      !newEntry.room ||
      !newEntry.date ||
      !newEntry.time
    ) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    // Determine if the event is recurring; default to false if not provided
    const recurring = newEntry.recurring === true;

    // Create an entry with a unique ID
    const entryWithId = {
      id: timetableData.length + 1,
      course: newEntry.course,
      lecturer: newEntry.lecturer,
      room: newEntry.room,
      date: newEntry.date, // Expected format: "DD/MM/YYYY"
      time: newEntry.time, // Expected format: "HH:mm AM/PM"
      recurring,
    };

    timetableData.push(entryWithId);

    return NextResponse.json(
      { message: "Timetable entry added successfully!", data: entryWithId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON format", details: error.message },
      { status: 400 }
    );
  }
}