// /src/app/api/studybuddies/route.js
import dbConnect from '../../../utils/dbConnect';
import User      from '../../../models/User';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id     = searchParams.get('id');
  const search = searchParams.get('search');

  try {
    // 1) Single lookup by ID
    if (id) {
      const buddy = await User.findById(id);
      if (!buddy) {
        return new Response(JSON.stringify({ error: 'Buddy not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(buddy), { status: 200 });
    }

    // 2) Build base query: show everyone
    let query = {};

    // 3) If searching, filter by name OR email
    if (search) {
      query = {
        $or: [
          { name:  { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const buddies = await User.find(query)
      .select('name email avatar status subjects availability');

    return new Response(JSON.stringify(buddies), { status: 200 });
  } catch (error) {
    console.error("Error fetching study buddies:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch study buddies' }),
      { status: 500 }
    );
  }
}
