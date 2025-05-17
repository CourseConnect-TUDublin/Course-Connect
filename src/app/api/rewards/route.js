import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { awardPoints, getLeaderboard } from '../../../services/rewardService';

export async function POST(request) {
  await dbConnect();

  // Parse incoming body
  const { userId, type, taskId } = await request.json();

  // Validate inputs
  if (!userId || !type) {
    return NextResponse.json({ success: false, error: "Missing userId or type" }, { status: 400 });
  }

  try {
    // Award points based on action type (type = "task_completed", etc)
    const user = await awardPoints(userId, type, taskId); // pass taskId if your rewardService uses it
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  const leaderboard = await getLeaderboard(10);
  return NextResponse.json({ leaderboard });
}
