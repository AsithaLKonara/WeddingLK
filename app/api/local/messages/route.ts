import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/messages - Get all messages
export async function GET(request: NextRequest) {
  try {
    const messages = await localDb.find('messages');
    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/local/messages - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = await localDb.create('messages', body);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
