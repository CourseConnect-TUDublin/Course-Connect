import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Task from "@/models/Task";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request) {
  await dbConnect();

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Find the user's _id via email (always works, even after login)
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get today’s date range
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  // Find tasks for this user, due today
  const tasks = await Task.find({
    user: user._id,   // Ensure this is ObjectId!
    dueDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    archived: false, // Optionally exclude archived tasks
  })
    .select("title dueDate priority")
    .sort({ dueDate: 1 });

  // Format tasks for the frontend
  const tasksFormatted = tasks.map((task) => ({
    title: task.title,
    dueTime: task.dueDate
      ? new Date(task.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
    priority: task.priority,
  }));

  return NextResponse.json({
    count: tasks.length,
    tasks: tasksFormatted,
  });
}
