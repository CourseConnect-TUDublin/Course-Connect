// src/app/api/sessions/[id]/route.js
import dbConnect from "../../../../../frontend/app/utils/dbConnect";
import Session from "../../../../models/Session";
import Notification from "../../../../models/Notification";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  await dbConnect();
  try {
    const { status } = await req.json();

    // Update session status and populate user info
    const updated = await Session.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
      .populate("host", "name avatar")
      .populate("participants", "name avatar");

    // If session was just confirmed, notify the other participant(s)
    if (status === "confirmed" && updated) {
      // Send to everyone in participants except the host
      const recipients = updated.participants
        .filter(p => p._id.toString() !== updated.host._id.toString())
        .map(p => p._id);

      const notifications = recipients.map(userId => ({
        userId,
        sessionId: updated._id,
        type: "sessionConfirmed",
      }));

      await Notification.insertMany(notifications);
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error in PATCH /api/sessions/[id]:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
