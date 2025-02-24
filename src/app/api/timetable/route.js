import { connectToDatabase } from '../../../lib/dbConnect.js';
import Timetable from '../../../models/Timetable.js';
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = await getToken({ req, secret });
    console.log("Token in GET:", token);
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - No token found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const userId = token.id || token.sub;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Token missing user id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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

    // Create the initial entry
    const newEntry = new Timetable({
      programme: body.programme,
      course: body.course,
      lecturer: body.lecturer,
      room: body.room,
      fullDateTime: new Date(body.fullDateTime),
      group: body.group,
      userId: userId,
      recurring: body.recurring || false,
    });
    await newEntry.save();

    // If recurring is enabled, create additional entries (e.g., for 4 more weeks)
    let recurringEntries = [];
    if (body.recurring) {
      for (let i = 1; i <= 4; i++) {
        const recurringDate = new Date(newEntry.fullDateTime);
        recurringDate.setDate(recurringDate.getDate() + 7 * i);
        const recurringEntry = new Timetable({
          programme: body.programme,
          course: body.course,
          lecturer: body.lecturer,
          room: body.room,
          fullDateTime: recurringDate,
          group: body.group,
          userId: userId,
          recurring: true,
        });
        await recurringEntry.save();
        recurringEntries.push(recurringEntry);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: body.recurring
          ? "Schedule and recurring events added successfully"
          : "Schedule added successfully",
        entry: newEntry,
        recurringEntries,
      }),
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
