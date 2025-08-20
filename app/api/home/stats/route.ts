import { NextRequest, NextResponse } from 'next/server';
import { optimizedStatsService } from '../../../../lib/optimized-stats-service';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching home stats with optimized service...');
    const startTime = Date.now();
    
    const stats = await optimizedStatsService.getHomeStats();
    
    const fetchTime = Date.now() - startTime;
    console.log(`⚡ Home stats fetched in ${fetchTime}ms`);
    
    return NextResponse.json({
      ...stats,
      performance: {
        fetchTime,
        cached: stats.cached,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching home stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home stats' },
      { status: 500 }
    );
  }
} 