import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import XPLog from "@/models/XPLog";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: "Unauthenticated" });

  await dbConnect();

  const { amount } = await req.json();
  const userId = session.user._id;

  try {
    const user = await User.findById(userId);

    const oldXP = user.xp;
    user.xp += amount;

    // Handle level-up
    const newLevel = calculateLevel(user.xp);
    if (newLevel > user.level) {
      user.level = newLevel;
      // You can also update badges here
    }

    await user.save();

    // Log the XP gain
    await XPLog.create({
      userId,
      amount,
      date: new Date(),
      source: "focus-session",
    });

    return NextResponse.json({ success: true, xp: user.xp, level: user.level });
  } catch (err) {
    console.error("XP gain error:", err);
    return NextResponse.json({ success: false, message: "Error updating XP" });
  }
}

// Same logic used in frontend for level calc
function calculateLevel(xp) {
  let level = 1;
  let xpRequired = 100;
  while (xp >= xpRequired) {
    xp -= xpRequired;
    level++;
    xpRequired = 100 + (level - 1) * 50;
  }
  return level;
}
