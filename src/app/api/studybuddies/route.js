// /src/app/api/studybuddies/route.js
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      // Fetch a single study buddy by id
      const buddy = await User.findById(id);
      if (!buddy) {
        return new Response(JSON.stringify({ error: 'Buddy not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(buddy), { status: 200 });
    } else {
      // Fetch all users who have subjects and availability defined
      const buddies = await User.find({
        subjects: { $exists: true, $ne: [] },
        availability: { $exists: true, $ne: [] }
      });
      return new Response(JSON.stringify(buddies), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching study buddies:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch study buddies' }), { status: 400 });
  }
}
