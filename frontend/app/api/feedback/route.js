// /src/app/api/feedback/route.js
import dbConnect from '../../../utils/dbConnect';
import Feedback from '../../../models/Feedback';

export async function POST(request) {
  await dbConnect();
  try {
    const { sessionId, user, rating, comments } = await request.json();
    const feedback = new Feedback({ sessionId, user, rating, comments });
    await feedback.save();
    return new Response(JSON.stringify(feedback), { status: 201 });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 400 });
  }
}
