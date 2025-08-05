import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import AnalyticsDashboard from '@/lib/analytics-dashboard'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// GET /api/analytics - Get comprehensive analytics
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('analytics', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      await connectToDatabase()
      
      const { searchParams } = new URL(request.url)
      const type = searchParams.get('type') || 'overview'
      const timeRange = searchParams.get('timeRange') || '24h'

      // Get analytics based on type
      let analyticsData: any = {}

      switch (type) {
        case 'overview':
          analyticsData = await AnalyticsDashboard.getAnalyticsMetrics()
          break
        case 'charts':
          analyticsData = await AnalyticsDashboard.getChartData(
            timeRange === '7d' ? 7 : timeRange === '1h' ? 1 : 30
          )
          break
        case 'realtime':
          analyticsData = await AnalyticsDashboard.getRealTimeData()
          break
        case 'performance':
          analyticsData = await PerformanceMonitor.getPerformanceAnalytics(timeRange as any)
          break
        case 'security':
          analyticsData = SecurityService.getSecurityStats()
          break
        default:
          analyticsData = await AnalyticsDashboard.getAnalyticsMetrics()
      }

      return NextResponse.json({
        success: true,
        data: analyticsData,
        type,
        timeRange,
        timestamp: new Date()
      })

    } catch (error) {
      console.error('Analytics error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Analytics failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// POST /api/analytics - Track custom events
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('analytics-track', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      await connectToDatabase()
      
      const body = await request.json()
      const { event, userId, properties } = body

      if (!event) {
        return NextResponse.json({ 
          error: 'Event name is required' 
        }, { status: 400 })
      }

      // Input validation
      const validation = SecurityService.validateInput(body, {
        preventXSS: true
      })

      if (!validation.isValid) {
        return NextResponse.json({ 
          error: 'Invalid input', 
          details: validation.errors 
        }, { status: 400 })
      }

      // Track the event (in a real implementation, this would save to database)
      console.log('📊 Analytics Event:', {
        event,
        userId,
        properties,
        timestamp: new Date(),
        ip: SecurityService.getClientIP(request)
      })

      return NextResponse.json({
        success: true,
        message: 'Event tracked successfully'
      })

    } catch (error) {
      console.error('Analytics tracking error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Event tracking failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
} 