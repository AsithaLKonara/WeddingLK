import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// POST /api/local/reset - Reset database
export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Resetting local database...');
    
    localDb.reset();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database reset successfully',
      data: {
        timestamp: new Date().toISOString(),
        counts: {
          users: 0,
          venues: 0,
          vendors: 0,
          bookings: 0,
          payments: 0,
          reviews: 0,
          messages: 0,
          tasks: 0
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/local/reset - Get reset endpoint info
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Database reset endpoint ready',
      instructions: 'Send POST request to reset database (this will clear all data)',
      warning: 'This action cannot be undone!'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get reset endpoint info' },
      { status: 500 }
    );
  }
}

