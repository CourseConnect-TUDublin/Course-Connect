// src/app/api/sessions/route.js

import dbConnect from '../../../utils/dbConnect';
import Session from '../../../models/Session';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  try {
    const sessions = await Session.find()
      .populate('host', 'name avatar')
      .populate('participants', 'name avatar');
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const { hostId, participantIds, datetime } = await request.json();
    // Create and save the session
    const sessionDoc = new Session({
      host: hostId,
      participants: participantIds,
      datetime
    });
    await sessionDoc.save();

    // Re-fetch with population
    const populated = await Session.findById(sessionDoc._id)
      .populate('host', 'name avatar')
      .populate('participants', 'name avatar');

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Error creating session:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
