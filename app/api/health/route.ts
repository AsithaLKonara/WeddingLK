import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET() {
  try {
    await connectDB()
    const dbStatus = 'healthy'
    
    const appStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development'
    }
    
    return NextResponse.json(appStatus, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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
  })
} 