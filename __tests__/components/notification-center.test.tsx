import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationCenter } from '@/components/ui/notification-center'
import { useSocket } from '@/hooks/use-socket'

// Mock the useSocket hook
jest.mock('@/hooks/use-socket')
const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}))

describe('NotificationCenter', () => {
  const mockNotifications = [
    {
      id: '1',
      type: 'booking_request' as const,
      title: 'New Booking Request',
      message: 'You have a new booking request from John Doe',
      timestamp: '2024-01-01T10:00:00Z',
      read: false,
      data: { bookingId: '123', clientName: 'John Doe' }
    },
    {
      id: '2',
      type: 'payment_received' as const,
      title: 'Payment Received',
      message: 'Payment of LKR 50,000 received for booking #123',
      timestamp: '2024-01-01T09:00:00Z',
      read: false,
      data: { amount: 50000, bookingId: '123' }
    }
  ]

  beforeEach(() => {
    mockUseSocket.mockReturnValue({
      socket: null,
      isConnected: true,
      notifications: mockNotifications,
      messages: [],
      unreadCount: 2,
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendBookingRequest: jest.fn(),
      updateBookingStatus: jest.fn(),
      sendReview: jest.fn(),
      sendPaymentNotification: jest.fn(),
      sendMessage: jest.fn(),
      updateService: jest.fn(),
      updateUserStatus: jest.fn(),
      markNotificationAsRead: jest.fn(),
      clearNotifications: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders notification center button with badge', () => {
    render(<NotificationCenter />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    
    // Check for badge with unread count
    const badge = screen.getByText('2')
    expect(badge).toBeInTheDocument()
  })

  it('opens dialog when button is clicked', async () => {
    render(<NotificationCenter />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })
  })

  it('displays notifications in dialog', async () => {
    render(<NotificationCenter />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('New Booking Request')).toBeInTheDocument()
      expect(screen.getByText('Payment Received')).toBeInTheDocument()
    })
  })

  it('shows empty state when no notifications', async () => {
    mockUseSocket.mockReturnValue({
      socket: null,
      isConnected: true,
      notifications: [],
      messages: [],
      unreadCount: 0,
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendBookingRequest: jest.fn(),
      updateBookingStatus: jest.fn(),
      sendReview: jest.fn(),
      sendPaymentNotification: jest.fn(),
      sendMessage: jest.fn(),
      updateService: jest.fn(),
      updateUserStatus: jest.fn(),
      markNotificationAsRead: jest.fn(),
      clearNotifications: jest.fn()
    })

    render(<NotificationCenter />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument()
    })
  })

  it('calls markNotificationAsRead when notification is clicked', async () => {
    const mockMarkAsRead = jest.fn()
    mockUseSocket.mockReturnValue({
      socket: null,
      isConnected: true,
      notifications: mockNotifications,
      messages: [],
      unreadCount: 2,
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendBookingRequest: jest.fn(),
      updateBookingStatus: jest.fn(),
      sendReview: jest.fn(),
      sendPaymentNotification: jest.fn(),
      sendMessage: jest.fn(),
      updateService: jest.fn(),
      updateUserStatus: jest.fn(),
      markNotificationAsRead: mockMarkAsRead,
      clearNotifications: jest.fn()
    })

    render(<NotificationCenter />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      const notification = screen.getByText('New Booking Request')
      fireEvent.click(notification)
      expect(mockMarkAsRead).toHaveBeenCalledWith('1')
    })
  })
}) 