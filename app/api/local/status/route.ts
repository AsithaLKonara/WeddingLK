import { NextRequest, NextResponse } from 'next/server';
import { localDb } from '@/lib/db-local';

// GET /api/local/status - Get database status and counts
export async function GET(request: NextRequest) {
  try {
    const counts = {
      users: await localDb.count('users'),
      venues: await localDb.count('venues'),
      vendors: await localDb.count('vendors'),
      bookings: await localDb.count('bookings'),
      payments: await localDb.count('payments'),
      reviews: await localDb.count('reviews'),
      messages: await localDb.count('messages'),
      tasks: await localDb.count('tasks'),
    };
    
    const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Local database status',
      data: {
        counts,
        totalRecords,
        isSeeded: totalRecords > 0,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get database status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

