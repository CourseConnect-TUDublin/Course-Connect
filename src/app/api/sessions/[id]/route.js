import dbConnect from "../../../../utils/dbConnect";
import Session from "../../../../models/Session";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await dbConnect();
  try {
    const { status } = await req.json();
    const updated = await Session.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate("host", "name avatar")
     .populate("participants", "name avatar");

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
