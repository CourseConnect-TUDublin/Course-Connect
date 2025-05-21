import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from '../../../lib/dbConnect.js';
import Task from '../../../models/Task.js';
import User from '../../../models/User.js'; // You need this to look up user._id
import mongoose from 'mongoose';

// ---- GET: Only return tasks for the authenticated user ----
export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const archivedParam = searchParams.get("archived");
    let filter = { user: user._id }; // <--- ONLY show the user's own tasks

    if (archivedParam === "true") {
      filter.archived = true;
    } else {
      filter.archived = false;
    }

    const tasks = await Task.find(filter);

    return new Response(
      JSON.stringify({ success: true, data: tasks }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch tasks" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ---- POST: Always associate new task with current user ----
export async function POST(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
    }

    const body = await req.json();

    if (!body.dueDate) {
      return new Response(
        JSON.stringify({ success: false, error: "Due date is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const dueDate = new Date(body.dueDate);
    if (isNaN(dueDate.getTime())) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid due date" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build new task for the *current* user
    const newTask = new Task({
      user: user._id, // <-- Always use session user ID
      title: body.title,
      description: body.description,
      status: body.status,
      dueDate: dueDate,
      order: body.order || 0,
      priority: body.priority || "Medium",
      category: body.category || "",
      subtasks: body.subtasks || [],
      archived: body.archived || false,
      recurring: body.recurring || false,
    });
    await newTask.save();

    return new Response(
      JSON.stringify({ success: true, data: newTask }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to add task" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ---- PUT: Only allow updates to user's own tasks ----
export async function PUT(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
    }

    const body = await req.json();

    if (!body._id) {
      return new Response(
        JSON.stringify({ success: false, error: "Task ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find and update *only if the task belongs to user*
    const task = await Task.findOne({ _id: body._id, user: user._id });
    if (!task) {
      return new Response(
        JSON.stringify({ success: false, error: "Task not found or access denied" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update task fields
    Object.assign(task, body);
    if (body.dueDate) {
      const dueDate = new Date(body.dueDate);
      if (isNaN(dueDate.getTime())) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid due date" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      task.dueDate = dueDate;
    }
    await task.save();

    return new Response(
      JSON.stringify({ success: true, data: task }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update task" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ---- DELETE: Only allow deletion of user's own tasks ----
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Only delete if the task belongs to the user
    const task = await Task.findOne({ _id: id, user: user._id });
    if (!task) {
      return new Response(
        JSON.stringify({ success: false, error: "Task not found or access denied" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await Task.deleteOne({ _id: id, user: user._id });

    return new Response(
      JSON.stringify({ success: true, message: "Task deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to delete task" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
