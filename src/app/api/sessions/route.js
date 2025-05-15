// /src/app/api/sessions/route.js
import dbConnect from '../../../utils/dbConnect';
import Session from '../../../models/Session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  try {
    const { hostId, participantIds, datetime } = await request.json();

    const startTime = new Date(datetime);
    const endTime   = new Date(startTime.getTime() + 60 * 60 * 1000); // +1h

    // Create the session
    const sessionDoc = new Session({
      tutor:     hostId,
      student:   participantIds,
      startTime,
      endTime,
      status:    'pending'
    });
    await sessionDoc.save();

    // Populate tutor and student before returning
    const populated = await Session.findById(sessionDoc._id)
      .populate('tutor',   'name avatar')
      .populate('student', 'name avatar');

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  await dbConnect();
  try {
    const url     = new URL(request.url);
    const userId  = url.searchParams.get('user');

    let query = {};

    // If a userId is provided, only fetch sessions where
    // that user is the tutor or a student
    if (userId) {
      query = {
        $or: [
          { tutor: userId },
          { student: userId }
        ]
      };
    }

    const sessions = await Session.find(query)
      .populate('tutor',   'name avatar')
      .populate('student', 'name avatar');

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sessions' },
      { status: 400 }
    );
  }
}
