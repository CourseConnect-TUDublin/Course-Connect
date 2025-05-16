// src/app/api/notifications/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await dbConnect();
  try {
    const updated = await Notification.findByIdAndUpdate(
      params.id,
      { read: true },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/notifications/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
