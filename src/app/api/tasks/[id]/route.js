// /src/app/api/tasks/[id]/route.js
import dbConnect from '../../../../lib/dbConnect';
import Task from '../../../../models/Task';

function cleanId(id) {
  // Remove any angle brackets from the id string
  return id.replace(/[<>]/g, '');
}

// GET a single task by id
export async function GET(request, { params }) {
  const { id } = await params;
  const cleanTaskId = cleanId(id);
  await dbConnect();
  try {
    const task = await Task.findById(cleanTaskId);
    if (!task) {
      return new Response(
        JSON.stringify({ success: false, error: 'Task not found' }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: task }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// PUT: Update a task by id
export async function PUT(request, { params }) {
  const { id } = await params;
  const cleanTaskId = cleanId(id);
  await dbConnect();
  try {
    const updatedData = await request.json();
    const updatedTask = await Task.findByIdAndUpdate(cleanTaskId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return new Response(
        JSON.stringify({ success: false, error: 'Task not found' }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: updatedTask }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// DELETE: Remove a task by id
export async function DELETE(request, { params }) {
  const { id } = await params;
  const cleanTaskId = cleanId(id);
  await dbConnect();
  try {
    const deletedTask = await Task.findByIdAndDelete(cleanTaskId);
    if (!deletedTask) {
      return new Response(
        JSON.stringify({ success: false, error: 'Task not found' }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: {} }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
