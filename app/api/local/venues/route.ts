import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/venues - Get all venues
export async function GET(request: NextRequest) {
  try {
    const venues = await localDb.find('venues');
    return NextResponse.json({ success: true, data: venues, count: venues.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

// POST /api/local/venues - Create new venue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const venue = await localDb.create('venues', body);
    return NextResponse.json({ success: true, data: venue }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}

