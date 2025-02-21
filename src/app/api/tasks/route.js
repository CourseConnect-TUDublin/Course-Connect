// /src/app/api/tasks/route.js
import dbConnect from '../../../lib/dbConnect.js';
import Task from '../../../models/Task.js';

export async function GET(req) {
  try {
    await dbConnect();
    // Parse the query parameters from the URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // If no userId is provided, return a 400 error
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing userId query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter tasks to include only those that belong to the given userId
    const tasks = await Task.find({ userId });
    console.log("Fetched tasks for user:", userId, tasks);
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

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    console.log("Received task data:", data);

    // Ensure that the request body includes a userId field
    if (!data.userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing userId in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Optionally, add additional validation for required fields (e.g., title, dueDate) here.
    if (!data.title || !data.dueDate) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: title and/or dueDate" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const task = await Task.create(data);
    console.log("Task created successfully:", task);
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
