import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check for university presentation
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      features: [
        'AI Wedding Planning',
        'Vendor Management',
        'Venue Booking',
        'Real-time Chat',
        'Payment Integration',
        'Responsive Design'
      ],
      message: 'WeddingLK is running successfully! 🎉',
      university: 'University Project - Ready for Presentation'
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
