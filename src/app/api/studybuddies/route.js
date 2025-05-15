import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const id     = searchParams.get('id');

  try {
    if (id) {
      const buddy = await User.findById(id);
      if (!buddy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(buddy);
    }
    const query = {
      subjects:     { $exists: true, $ne: [] },
      availability: { $exists: true, $ne: [] }
    };
    if (search) query.name = { $regex: search, $options: 'i' };
    const buddies = await User.find(query);
    return NextResponse.json(buddies);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const payload = await req.json();
    const newUser = await User.create(payload);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
