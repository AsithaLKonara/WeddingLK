import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AnalyticsDashboard } from '@/components/organisms/analytics-dashboard'

// Mock fetch
global.fetch = jest.fn()

const mockAnalyticsData = {
  overview: {
    totalBookings: 1250,
    totalRevenue: 25000000,
    totalUsers: 5000,
    totalVenues: 150,
    totalVendors: 300,
    averageRating: 4.5,
    conversionRate: 12.5,
    growthRate: 15.2
  },
  bookings: {
    total: 1250,
    pending: 45,
    confirmed: 980,
    completed: 200,
    cancelled: 25,
    monthlyData: [
      { month: 'Jan', count: 100, revenue: 2000000 },
      { month: 'Feb', count: 120, revenue: 2400000 },
      { month: 'Mar', count: 150, revenue: 3000000 }
    ]
  },
  revenue: {
    total: 25000000,
    monthly: 3000000,
    average: 20000,
    growth: 15.2,
    breakdown: {
      venueBookings: 15000000,
      vendorServices: 8000000,
      subscriptions: 1500000,
      commissions: 500000
    }
  },
  users: {
    total: 5000,
    active: 3500,
    new: 500,
    returning: 3000,
    demographics: {
      ageGroups: [
        { group: '18-25', count: 1000 },
        { group: '26-35', count: 2000 },
        { group: '36-45', count: 1500 }
      ],
      locations: [
        { location: 'Colombo', count: 2000 },
        { location: 'Kandy', count: 1000 },
        { location: 'Galle', count: 800 }
      ]
    }
  },
  performance: {
    pageViews: 50000,
    uniqueVisitors: 15000,
    bounceRate: 35.5,
    averageSessionDuration: 180,
    topPages: [
      { page: '/venues', views: 10000 },
      { page: '/vendors', views: 8000 },
      { page: '/packages', views: 6000 }
    ]
  },
  engagement: {
    totalReviews: 2500,
    averageRating: 4.5,
    responseRate: 85.5,
    socialShares: 1500,
    favorites: 3000
  }
}

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<AnalyticsDashboard />)
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Real-time insights and performance metrics')).toBeInTheDocument()
  })

  it('renders analytics data when loaded', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument() // Total Bookings
      expect(screen.getByText('LKR 25,000,000')).toBeInTheDocument() // Total Revenue
      expect(screen.getByText('3,500')).toBeInTheDocument() // Active Users
      expect(screen.getByText('4.5')).toBeInTheDocument() // Average Rating
    })
  })

  it('handles fetch error gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  it('allows time range selection', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Last 30 days')).toBeInTheDocument()
    })

    const timeRangeSelect = screen.getByDisplayValue('Last 30 days')
    fireEvent.click(timeRangeSelect)

    // Check if options are available
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Last 90 days')).toBeInTheDocument()
    expect(screen.getByText('Last year')).toBeInTheDocument()
  })

  it('switches between different metric tabs', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument()
    })

    // Click on Bookings tab
    fireEvent.click(screen.getByText('Bookings'))
    expect(screen.getByText('Booking Status')).toBeInTheDocument()
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
    expect(screen.getByText('980')).toBeInTheDocument()

    // Click on Revenue tab
    fireEvent.click(screen.getByText('Revenue'))
    expect(screen.getByText('Revenue Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Venue Bookings')).toBeInTheDocument()
    expect(screen.getByText('LKR 15,000,000')).toBeInTheDocument()

    // Click on Users tab
    fireEvent.click(screen.getByText('Users'))
    expect(screen.getByText('User Demographics')).toBeInTheDocument()
    expect(screen.getByText('18-25')).toBeInTheDocument()
    expect(screen.getByText('1,000')).toBeInTheDocument()
  })

  it('displays correct trend indicators', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      // Check for positive trend indicators
      const trendElements = screen.getAllByText('+15.2% from last period')
      expect(trendElements.length).toBeGreaterThan(0)
    })
  })

  it('formats currency correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('LKR 25,000,000')).toBeInTheDocument()
      expect(screen.getByText('LKR 3,000,000')).toBeInTheDocument()
    })
  })

  it('formats numbers correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument()
      expect(screen.getByText('3,500')).toBeInTheDocument()
      expect(screen.getByText('50,000')).toBeInTheDocument()
    })
  })

  it('displays performance metrics correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Performance'))
      
      expect(screen.getByText('Website Performance')).toBeInTheDocument()
      expect(screen.getByText('50,000')).toBeInTheDocument() // Page Views
      expect(screen.getByText('15,000')).toBeInTheDocument() // Unique Visitors
      expect(screen.getByText('35.5%')).toBeInTheDocument() // Bounce Rate
      expect(screen.getByText('3m')).toBeInTheDocument() // Session Duration
    })
  })

  it('displays engagement metrics correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Engagement'))
      
      expect(screen.getByText('Engagement Metrics')).toBeInTheDocument()
      expect(screen.getByText('2,500')).toBeInTheDocument() // Total Reviews
      expect(screen.getByText('4.5')).toBeInTheDocument() // Average Rating
      expect(screen.getByText('85.5%')).toBeInTheDocument() // Response Rate
      expect(screen.getByText('1,500')).toBeInTheDocument() // Social Shares
      expect(screen.getByText('3,000')).toBeInTheDocument() // Favorites
    })
  })

  it('handles refresh button click', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    const refreshButton = screen.getByText('Refresh')
    fireEvent.click(refreshButton)

    // Should make another API call
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('displays user role specific data', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard userRole="vendor" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('role=vendor')
      )
    })
  })

  it('displays different time ranges', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard timeRange="7d" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('timeRange=7d')
      )
    })
  })

  it('shows quick action buttons', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('View Detailed Reports')).toBeInTheDocument()
      expect(screen.getByText('Set Goals')).toBeInTheDocument()
      expect(screen.getByText('Performance Awards')).toBeInTheDocument()
      expect(screen.getByText('Schedule Reports')).toBeInTheDocument()
    })
  })

  it('shows engagement action buttons', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Engagement'))
      
      expect(screen.getByText('Respond to Reviews')).toBeInTheDocument()
      expect(screen.getByText('Manage Favorites')).toBeInTheDocument()
      expect(screen.getByText('View Analytics')).toBeInTheDocument()
      expect(screen.getByText('Track Conversions')).toBeInTheDocument()
    })
  })

  it('displays monthly booking data', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Bookings'))
      
      expect(screen.getByText('Monthly Bookings')).toBeInTheDocument()
      expect(screen.getByText('Jan')).toBeInTheDocument()
      expect(screen.getByText('100 bookings')).toBeInTheDocument()
      expect(screen.getByText('LKR 2,000,000')).toBeInTheDocument()
    })
  })

  it('displays revenue breakdown', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Revenue'))
      
      expect(screen.getByText('Revenue Breakdown')).toBeInTheDocument()
      expect(screen.getByText('Venue Bookings')).toBeInTheDocument()
      expect(screen.getByText('Vendor Services')).toBeInTheDocument()
      expect(screen.getByText('Subscriptions')).toBeInTheDocument()
      expect(screen.getByText('Commissions')).toBeInTheDocument()
    })
  })

  it('displays user demographics', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Users'))
      
      expect(screen.getByText('User Demographics')).toBeInTheDocument()
      expect(screen.getByText('18-25')).toBeInTheDocument()
      expect(screen.getByText('26-35')).toBeInTheDocument()
      expect(screen.getByText('36-45')).toBeInTheDocument()
    })
  })

  it('displays top locations', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Users'))
      
      expect(screen.getByText('Top Locations')).toBeInTheDocument()
      expect(screen.getByText('Colombo')).toBeInTheDocument()
      expect(screen.getByText('Kandy')).toBeInTheDocument()
      expect(screen.getByText('Galle')).toBeInTheDocument()
    })
  })

  it('displays top pages', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockAnalyticsData
    })

    render(<AnalyticsDashboard />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Performance'))
      
      expect(screen.getByText('Top Pages')).toBeInTheDocument()
      expect(screen.getByText('/venues')).toBeInTheDocument()
      expect(screen.getByText('/vendors')).toBeInTheDocument()
      expect(screen.getByText('/packages')).toBeInTheDocument()
    })
  })
}) 