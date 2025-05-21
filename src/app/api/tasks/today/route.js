import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Task from "@/models/Task";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request) {
  await dbConnect();

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Find tasks due today for this user
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  // You may need to adjust field names depending on your schema
  const tasks = await Task.find({
    user: session.user.id, // or session.user._id
    dueDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .select("title dueDate priority") // add any fields you want returned
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
