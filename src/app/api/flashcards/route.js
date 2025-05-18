import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Flashcard from "@/models/Flashcard";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Update path as needed

// GET: Fetch all flashcards for current user
export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const flashcards = await Flashcard.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: flashcards });
}

// POST: Add a new flashcard
export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { question, answer } = await req.json();

  if (!question || !answer) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const card = await Flashcard.create({
    user: userId,
    question,
    answer,
  });

  return NextResponse.json({ success: true, data: card });
}
