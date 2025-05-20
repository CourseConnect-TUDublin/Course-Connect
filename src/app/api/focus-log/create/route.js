import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import FocusLog from "@/models/FocusLog";
import User from "@/models/User";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });

  await dbConnect();

  try {
    const { module, type, startTime, endTime, intendedDuration, actualDuration, xpEarned } = await req.json();
    const userId = session.user._id;

    const log = await FocusLog.create({
      userId,
      module,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      intendedDuration,
      actualDuration,
      xpEarned,
      type
    });

    return NextResponse.json({ success: true, data: log });
  } catch (err) {
    console.error("Error creating focus log:", err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
