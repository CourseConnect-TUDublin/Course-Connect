import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "../../../lib/dbConnect";
import Timetable from "../../../models/Timetable";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    await connectToDatabase();

    // Log the incoming cookie header for debugging
    const cookieHeader = request.headers.get("cookie");
    console.log("Cookie header in GET:", cookieHeader);

    // Try to extract the token; specify cookieName in case the default is different
    const token = await getToken({ 
      req: request, 
      secret, 
      cookieName: "next-auth.session-token" // adjust if you're using a custom name
    });
    console.log("Token in GET:", token);

    if (!token || !token.id) {
      console.error("Unauthorized - No token found");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id;
    console.log("Fetching timetable for user:", userId);

    const entries = await Timetable.find({ userId });
    console.log("Timetable Entries Found:", entries.length);

    return NextResponse.json({ success: true, data: entries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timetable entries", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const cookieHeader = request.headers.get("cookie");
    console.log("Cookie header in POST:", cookieHeader);

    const token = await getToken({ 
      req: request, 
      secret, 
      cookieName: "next-auth.session-token" 
    });
    console.log("Token in POST:", token);

    if (!token || !token.id) {
      console.error("Unauthorized - No token found");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id;
    const body = await request.json();
    console.log("Adding schedule for user:", userId, "Data:", body);

    const newEntry = new Timetable({
      userId,
      programme: body.programme,
      course: body.course,
      lecturer: body.lecturer,
      room: body.room,
      fullDateTime: new Date(body.fullDateTime),
      group: body.group,
    });

    await newEntry.save();

    return NextResponse.json(
      { success: true, message: "Schedule added successfully", entry: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
