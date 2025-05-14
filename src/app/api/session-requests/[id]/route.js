import dbConnect from '../../../../utils/dbConnect';
import SessionRequest from '../../../../models/SessionRequest';
import Session        from '../../../../models/Session';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = params;
  const { action } = await request.json(); // 'accept' or 'decline'

  if (!['accept','decline'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Update the request status
  const newStatus = action === 'accept' ? 'accepted' : 'declined';
  const req = await SessionRequest.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );

  if (!req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  // If they accepted, also add them into the Session document
  if (action === 'accept') {
    await Session.findByIdAndUpdate(
      req.sessionId,
      { 
        // push to the student array if not already there
        $addToSet: { student: req.to } 
      }
    );
  }

  return NextResponse.json(req);
}
