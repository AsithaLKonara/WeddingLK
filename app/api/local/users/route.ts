import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const users = await localDb.find('users');
    return NextResponse.json({ success: true, data: users, count: users.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/local/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await localDb.create('users', body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

