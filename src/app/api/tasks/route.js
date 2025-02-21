// /src/app/api/tasks/route.js
import dbConnect from "../../../lib/dbConnect.js";
import Task from "../../../models/Task.js";

// GET tasks: Optionally filter by userId and archived status.
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const archived = searchParams.get("archived");

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing userId query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build the query object.
    const query = { userId };
    if (archived !== null) {
      query.archived = archived === "true";
    }

    const tasks = await Task.find(query);
    return new Response(
      JSON.stringify({ success: true, data: tasks }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST tasks: Create a new task.
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // Validate required fields.
    if (!data.userId || !data.title || !data.dueDate) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Create the new task.
    const task = await Task.create(data);
    return new Response(
      JSON.stringify({ success: true, data: task }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT tasks: Update an existing task (e.g., for archiving or editing).
export async function PUT(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { id, ...updateData } = data;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing task id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTask) {
      return new Response(
        JSON.stringify({ success: false, error: "Task not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: updatedTask }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// DELETE tasks: Remove a task from the database.
export async function DELETE(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { id } = data;
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing task id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return new Response(
        JSON.stringify({ success: false, error: "Task not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: deletedTask }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
