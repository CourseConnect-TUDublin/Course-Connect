import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import FocusLog from "@/models/FocusLog";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });

  await dbConnect();

  try {
    const logs = await FocusLog.find({ userId: session.user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: logs });
  } catch (err) {
    console.error("Error fetching focus logs:", err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
