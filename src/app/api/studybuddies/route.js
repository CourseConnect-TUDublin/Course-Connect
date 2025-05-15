// src/app/api/studybuddies/route.js

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
      // Fetch a single user by ID
      const buddy = await User.findById(id);
      if (!buddy) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(buddy);
    }

    // Build query: empty by default, or filter by name if `search` provided
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Fetch all users matching the query
    const buddies = await User.find(query);
    return NextResponse.json(buddies);
  } catch (err) {
    console.error("Error fetching study buddies:", err);
    return NextResponse.json({ error: 'Failed to fetch study buddies' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const payload = await req.json();
    const newUser = await User.create(payload);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating buddy:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
