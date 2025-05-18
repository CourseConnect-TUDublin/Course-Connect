// src/app/api/rewards/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { awardPoints, getLeaderboard } from "@/services/rewardService";

export async function POST(request) {
  await dbConnect();
  // Accept both 'type' and 'action' for backwards compatibility
  const { userId, type, action, taskId } = await request.json();
  const rewardType = type || action; // Allow both keys

  // Validate required fields
  if (!userId || !rewardType) {
    return NextResponse.json(
      { success: false, error: "Missing userId or type/action" },
      { status: 400 }
    );
  }

  try {
    const user = await awardPoints(userId, rewardType, taskId);
    // Return relevant user info only
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        points: user.points,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
      },
    });
  } catch (err) {
    console.error("Error in /api/rewards POST:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const leaderboard = await getLeaderboard(10);
    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("Error in /api/rewards GET:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
