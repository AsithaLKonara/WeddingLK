import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await connectDB()
    
    // Check if we can perform basic database operations
    const { default: User } = await import('@/lib/models/user')
    const userCount = await User.countDocuments()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        status: 'connected',
        userCount
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }, { status: 503 })
  }
} 