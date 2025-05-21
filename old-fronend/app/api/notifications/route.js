import { NextResponse } from 'next/server';
import dbConnect from 'frontend/app/lib/dbConnect';
import Notification from '@/models/Notification';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  await dbConnect();
  const notifs = await Notification.find({ userId }).sort('-createdAt');
  return NextResponse.json(notifs);
}

export async function POST(request) {
  const { userId, sessionId, type } = await request.json();
  await dbConnect();
  const notif = await Notification.create({ userId, sessionId, type });
  return NextResponse.json(notif, { status: 201 });
}

export async function PATCH(request) {
  const { id, read } = await request.json();
  await dbConnect();
  await Notification.findByIdAndUpdate(id, { read });
  return NextResponse.json({ success: true });
}
