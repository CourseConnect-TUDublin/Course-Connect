// /src/app/api/session-requests/route.js
import dbConnect from '../../../utils/dbConnect';
import SessionRequest from '../../../models/SessionRequest';

export async function POST(request) {
  await dbConnect();
  try {
    const { requester, buddy, preferredTimes, message } = await request.json();
    const newRequest = new SessionRequest({ requester, buddy, preferredTimes, message });
    await newRequest.save();
    return new Response(JSON.stringify(newRequest), { status: 201 });
  } catch (error) {
    console.error("Error creating session request:", error);
    return new Response(JSON.stringify({ error: 'Failed to create session request' }), { status: 400 });
  }
}

export async function GET(request) {
  await dbConnect();
  try {
    // Optionally, filter by requester or buddy using query parameters
    const requests = await SessionRequest.find({}).populate('requester buddy');
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    console.error("Error fetching session requests:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch session requests' }), { status: 400 });
  }
}
