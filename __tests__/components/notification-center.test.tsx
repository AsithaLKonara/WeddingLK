import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationCenter } from '@/components/ui/notification-center'
import { useSocket } from '@/hooks/use-socket'

// Mock the useSocket hook
jest.mock('@/hooks/use-socket')

const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>

describe('NotificationCenter', () => {
  const mockNotifications = [
    {
      id: '1',
      type: 'booking_request' as const,
      title: 'New Booking Request',
      message: 'New booking from Sarah & Michael',
      timestamp: new Date().toISOString(),
      read: false,
      data: { bookingId: '123', clientName: 'Sarah & Michael' }
    },
    {
      id: '2',
      type: 'payment_received' as const,
      title: 'Payment Received',
      message: 'Payment of LKR 50,000 received',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: true,
      data: { amount: 50000, bookingId: '123' }
    }
  ]

  beforeEach(() => {
    mockUseSocket.mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 1,
      markNotificationAsRead: jest.fn(),
      clearNotifications: jest.fn(),
      isConnected: true,
      messages: [],
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendBookingRequest: jest.fn(),
      updateBookingStatus: jest.fn(),
      sendReview: jest.fn(),
      sendPaymentNotification: jest.fn(),
      sendMessage: jest.fn(),
      updateService: jest.fn(),
      updateUserStatus: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders notification bell with badge when there are unread notifications', () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    expect(bellButton).toBeInTheDocument()
    
    const badge = screen.getByText('1')
    expect(badge).toBeInTheDocument()
  })

  it('opens notification dialog when bell is clicked', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })
  })

  it('displays notifications in the dialog', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('New Booking Request')).toBeInTheDocument()
      expect(screen.getByText('Payment Received')).toBeInTheDocument()
      expect(screen.getByText('New booking from Sarah & Michael')).toBeInTheDocument()
      expect(screen.getByText('Payment of LKR 50,000 received')).toBeInTheDocument()
    })
  })

  it('shows correct notification icons based on type', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      // Check for calendar icon (booking request)
      const calendarIcon = document.querySelector('[data-lucide="calendar"]')
      expect(calendarIcon).toBeInTheDocument()
      
      // Check for dollar sign icon (payment received)
      const dollarIcon = document.querySelector('[data-lucide="dollar-sign"]')
      expect(dollarIcon).toBeInTheDocument()
    })
  })

  it('filters notifications correctly', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      // Check all notifications are shown by default
      expect(screen.getByText('All (2)')).toBeInTheDocument()
      expect(screen.getByText('Unread (1)')).toBeInTheDocument()
      expect(screen.getByText('Read (1)')).toBeInTheDocument()
    })
    
    // Click on unread filter
    const unreadButton = screen.getByText('Unread (1)')
    fireEvent.click(unreadButton)
    
    await waitFor(() => {
      expect(screen.getByText('New Booking Request')).toBeInTheDocument()
      expect(screen.queryByText('Payment Received')).not.toBeInTheDocument()
    })
  })

  it('marks notification as read when clicked', async () => {
    const mockMarkAsRead = jest.fn()
    mockUseSocket.mockReturnValue({
      ...mockUseSocket(),
      markNotificationAsRead: mockMarkAsRead
    })

    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      const notification = screen.getByText('New Booking Request')
      fireEvent.click(notification)
    })
    
    expect(mockMarkAsRead).toHaveBeenCalledWith('1')
  })

  it('shows empty state when no notifications', async () => {
    mockUseSocket.mockReturnValue({
      ...mockUseSocket(),
      notifications: [],
      unreadCount: 0
    })

    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument()
    })
  })

  it('clears all notifications when clear button is clicked', async () => {
    const mockClearNotifications = jest.fn()
    mockUseSocket.mockReturnValue({
      ...mockUseSocket(),
      clearNotifications: mockClearNotifications
    })

    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      const clearButton = screen.getByRole('button', { name: /trash/i })
      fireEvent.click(clearButton)
    })
    
    expect(mockClearNotifications).toHaveBeenCalled()
  })

  it('shows connection status indicator', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      const connectionIndicator = document.querySelector('[title="Connected"]')
      expect(connectionIndicator).toBeInTheDocument()
    })
  })

  it('formats time ago correctly', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('Just now')).toBeInTheDocument()
      expect(screen.getByText('1h ago')).toBeInTheDocument()
    })
  })

  it('applies correct styling for unread notifications', async () => {
    render(<NotificationCenter />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      const unreadNotification = screen.getByText('New Booking Request').closest('.border-l-4')
      expect(unreadNotification).toHaveClass('border-l-blue-500')
    })
  })
}) 