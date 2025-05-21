import dbConnect from "frontend/app/lib/dbConnect";
import ChatMessage from "@/models/ChatMessage";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const { room } = params;
  // latest 100 messages
  const messages = await ChatMessage.find({ room })
    .sort("timestamp")
    .limit(100);
  return NextResponse.json(messages);
}

export async function POST(request, { params }) {
  await dbConnect();
  const { room } = params;
  const { userId, userName, message } = await request.json();
  const chatMsg = await ChatMessage.create({ room, userId, userName, message });
  return NextResponse.json(chatMsg, { status: 201 });
}
