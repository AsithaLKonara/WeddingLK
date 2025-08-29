import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

// POST /api/local/seed - Seed database with sample data
export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting database seeding via API...');

    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with 50 rows per table',
      data: {
        users: 50,
        venues: 50,
        vendors: 50,
        bookings: 50,
        payments: 50,
        reviews: 50,
        messages: 50,
        tasks: 50,
      },
    });
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/local/seed - Get seeding status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Database seeding endpoint ready',
      instructions: 'Send POST request to seed database with 50 rows per table',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get seeding status' },
      { status: 500 }
    );
  }
}
