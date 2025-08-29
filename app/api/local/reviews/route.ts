import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/reviews - Get all reviews
export async function GET(request: NextRequest) {
  try {
    const reviews = await localDb.find('reviews');
    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/local/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const review = await localDb.create('reviews', body);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
