// /src/app/api/sessions/route.js
import dbConnect from '../../../utils/dbConnect';
import Session from '../../../models/Session';

/**
 * POST /api/sessions
 * Creates a new study session.
 */
export async function POST(request) {
  await dbConnect();
  try {
    const { tutor, student, startTime, endTime } = await request.json();

    const newSession = new Session({
      tutor,
      student,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'pending',
    });
    
    await newSession.save();
    
    return new Response(JSON.stringify(newSession), { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return new Response(JSON.stringify({ error: 'Failed to create session' }), { status: 400 });
  }
}

/**
 * GET /api/sessions
 * Fetches all study sessions.
 */
export async function GET() {
  await dbConnect();
  try {
    const sessions = await Session.find({});
    return new Response(JSON.stringify(sessions), { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch sessions' }), { status: 400 });
  }
}
