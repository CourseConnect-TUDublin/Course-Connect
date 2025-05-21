import dbConnect from "@/utils/dbConnect";
import Task from "@/models/Task";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Helper to clean up ID strings
function cleanId(id) {
  return id.replace(/[<>]/g, "");
}

// GET a single task by id
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  const cleanTaskId = cleanId(id);

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
  }

  try {
    const task = await Task.findById(cleanTaskId);

    // Only allow access if this is the user's task
    if (!task || String(task.userId) !== String(user._id)) {
      return new Response(JSON.stringify({ success: false, error: "Task not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: task }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}

// PUT: Update a task by id
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const cleanTaskId = cleanId(id);

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
  }

  try {
    const updatedData = await request.json();
    const task = await Task.findById(cleanTaskId);

    // Only allow if the user owns the task
    if (!task || String(task.userId) !== String(user._id)) {
      return new Response(JSON.stringify({ success: false, error: "Task not found" }), { status: 404 });
    }

    // Update task with new data
    Object.assign(task, updatedData);
    await task.save();

    return new Response(JSON.stringify({ success: true, data: task }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}

// DELETE: Remove a task by id
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  const cleanTaskId = cleanId(id);

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
  }

  try {
    const task = await Task.findById(cleanTaskId);

    // Only allow if the user owns the task
    if (!task || String(task.userId) !== String(user._id)) {
      return new Response(JSON.stringify({ success: false, error: "Task not found" }), { status: 404 });
    }

    await Task.deleteOne({ _id: cleanTaskId });

    return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}
