import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Timetable from "@/models/Timetable"; // adjust if needed
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;
    const upcoming = await Timetable.find({ userId })
      .sort({ fullDateTime: 1 })
      .limit(1);

    if (!upcoming.length) {
      return NextResponse.json({ className: "No classes", time: "—" });
    }

    const nextClass = upcoming[0];
    return NextResponse.json({
      className: nextClass.title || "Class",
      time: new Date(nextClass.fullDateTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  } catch (err) {
    console.error("Error in /api/timetable/next:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
