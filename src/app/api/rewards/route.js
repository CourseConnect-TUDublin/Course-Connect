import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { awardPoints, getLeaderboard } from '../../../services/rewardService';

export async function POST(request) {
  await dbConnect();
  const { userId, action } = await request.json();
  try {
    const user = await awardPoints(userId, action);
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
