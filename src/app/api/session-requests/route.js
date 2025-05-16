// src/app/api/session-requests/route.js
import dbConnect from '../../../../frontend/app/utils/dbConnect';
import SessionRequest from '../../../models/SessionRequest';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const toUser = searchParams.get('to');
  if (!toUser) return NextResponse.json([], { status: 200 });
  
  const requests = await SessionRequest
    .find({ to: toUser, status: 'pending' })
    .populate('from', 'name avatar')
    .populate('sessionId', 'datetime');
  return NextResponse.json(requests);
}

export async function POST(request) {
  await dbConnect();
  const { sessionId, from, to } = await request.json();
  const newReq = await SessionRequest.create({ sessionId, from, to });
  return NextResponse.json(newReq, { status: 201 });
}
