import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Level-up logic (if you want to handle automatic level increase)
function getLevelInfo(xp) {
  let level = 1;
  let required = 100;
  let remainingXP = xp;

  while (remainingXP >= required) {
    remainingXP -= required;
    level++;
    required = 100 + (level - 1) * 50;
  }
  return { level, xpIntoLevel: remainingXP, xpToNext: required };
}

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { amount = 0, points = 0 } = await req.json();

  if (!amount || typeof amount !== "number") {
    return NextResponse.json({ success: false, error: "XP amount required" }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  user.xp = (user.xp ?? 0) + amount;
  user.points = (user.points ?? 0) + points;


  const { level } = getLevelInfo(user.xp);
  user.level = level;

  await user.save();

  return NextResponse.json({
    success: true,
    xp: user.xp,
    points: user.points,
    level: user.level,
  });
}
