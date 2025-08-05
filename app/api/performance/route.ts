import { NextRequest, NextResponse } from 'next/server'
import PerformanceMonitor from '@/lib/performance-monitor'
import SecurityService from '@/lib/security-service'

// GET /api/performance - Get performance metrics
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('performance-metrics', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      const { searchParams } = new URL(request.url)
      const type = searchParams.get('type') || 'system'
      const timeRange = searchParams.get('timeRange') || '24h'

      let performanceData: any = {}

      switch (type) {
        case 'system':
          performanceData = await PerformanceMonitor.getSystemMetrics()
          break
        case 'analytics':
          performanceData = await PerformanceMonitor.getPerformanceAnalytics(timeRange as any)
          break
        case 'alerts':
          performanceData = await PerformanceMonitor.getPerformanceAlerts()
          break
        default:
          performanceData = await PerformanceMonitor.getSystemMetrics()
      }

      return NextResponse.json({
        success: true,
        data: performanceData,
        type,
        timeRange,
        timestamp: new Date()
      })

    } catch (error) {
      console.error('Performance metrics error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Performance metrics failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// POST /api/performance - Track page performance
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('performance-track', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      const body = await request.json()
      const { pageName, loadTime, status = 'success' } = body

      if (!pageName || !loadTime) {
        return NextResponse.json({ 
          error: 'Page name and load time are required' 
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

      // Track page performance
      PerformanceMonitor.trackPagePerformance(pageName, loadTime, status)

      return NextResponse.json({
        success: true,
        message: 'Page performance tracked successfully'
      })

    } catch (error) {
      console.error('Performance tracking error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Performance tracking failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
} 