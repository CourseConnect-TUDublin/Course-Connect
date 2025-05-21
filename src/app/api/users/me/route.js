import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Get user profile
export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Return all relevant user fields for Rewards/Leaderboard/Settings consistency
  return NextResponse.json({
    name: user.name,
    email: user.email,
    theme: user.theme || "auto",
    xp: user.xp ?? 0,
    points: user.points ?? 0,
    streak: user.streak ?? 0,
    badges: user.badges ?? [],
    avatar: user.avatar ?? null,
  });
}

// Update user profile
export async function PATCH(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { name, email, theme } = await req.json();

  // Prevent email change to a duplicate
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.theme = theme ?? user.theme;

  await user.save();

  return NextResponse.json({
    name: user.name,
    email: user.email,
    theme: user.theme || "auto",
    xp: user.xp ?? 0,
    points: user.points ?? 0,
    streak: user.streak ?? 0,
    badges: user.badges ?? [],
    avatar: user.avatar ?? null,
  });
}

// Delete user account
export async function DELETE(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await User.deleteOne({ email: session.user.email });
  // Optionally: delete related user data (tasks, etc.)

  return NextResponse.json({ ok: true });
}
