// src/app/api/flashcards/route.js
import dbConnect from "@/lib/dbConnect";
import Flashcard from "@/models/Flashcard";
import { NextResponse } from "next/server";

// GET /api/flashcards – Fetch all flashcards
export async function GET() {
  await dbConnect();
  try {
    const flashcards = await Flashcard.find().select("question answer");
    return NextResponse.json({ success: true, data: flashcards });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/flashcards – Add a new flashcard
export async function POST(request) {
  await dbConnect();
  try {
    const { question, answer } = await request.json();
    if (!question || !answer) {
      return NextResponse.json({ success: false, error: "Question and answer are required." }, { status: 400 });
    }
    const flashcard = await Flashcard.create({ question, answer });
    return NextResponse.json({ success: true, data: flashcard });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
