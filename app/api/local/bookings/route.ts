import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/bookings - Get all bookings
export async function GET(request: NextRequest) {
  try {
    const bookings = await localDb.find('bookings');
    return NextResponse.json({ success: true, data: bookings, count: bookings.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/local/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const booking = await localDb.create('bookings', body);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

