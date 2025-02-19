// /src/app/api/tasks/route.js
import dbConnect from '../../../lib/dbConnect';
import Task from '../../../models/Task';

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({});
    return new Response(
      JSON.stringify({ success: true, data: tasks }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const task = await Task.create(data);
    return new Response(
      JSON.stringify({ success: true, data: task }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
