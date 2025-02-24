import { connectToDatabase } from '../../../lib/dbConnect.js';
import Task from '../../../models/Task.js';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const archivedParam = searchParams.get("archived");
    let filter = {};
    if (archivedParam === "true") {
      filter.archived = true;
    } else {
      // By default, return only active tasks (not archived)
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

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    // Validate required fields...
    if (!body.userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
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
    if (!mongoose.Types.ObjectId.isValid(body.userId)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid user ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = new mongoose.Types.ObjectId(body.userId);
    const newTask = new Task({
      title: body.title,
      description: body.description,
      status: body.status,
      dueDate: dueDate,
      userId: userId,
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

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body._id) {
      return new Response(
        JSON.stringify({ success: false, error: "Task ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (body.dueDate) {
      const dueDate = new Date(body.dueDate);
      if (isNaN(dueDate.getTime())) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid due date" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      body.dueDate = dueDate;
    }
    const updatedTask = await Task.findByIdAndUpdate(body._id, body, { new: true });
    return new Response(
      JSON.stringify({ success: true, data: updatedTask }),
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

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Task.findByIdAndDelete(id);
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
