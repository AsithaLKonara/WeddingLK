import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Notification, SocketEvents } from '@/lib/socket'

interface UseSocketOptions {
  autoConnect?: boolean
  onNotification?: (notification: Notification) => void
  onMessage?: (message: any) => void
  onBookingUpdate?: (booking: any) => void
  onReviewUpdate?: (review: any) => void
}

export function useSocket(options: UseSocketOptions = {}) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<any[]>([])

  const {
    autoConnect = true,
    onNotification,
    onMessage,
    onBookingUpdate,
    onReviewUpdate
  } = options

  // Initialize socket connection
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socketio',
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setIsConnected(true)
      
      // Authenticate user if session exists
      if (session?.user?.email) {
        socket.emit('authenticate', {
          userId: session.user.email,
          role: session.user.role || 'user'
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    // Notification events
    socket.on('new_booking', (data) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'booking_request',
        title: 'New Booking Request',
        message: data.message,
        timestamp: data.timestamp,
        read: false,
        data
      }
      
      setNotifications(prev => [notification, ...prev])
      onNotification?.(notification)
      
      toast({
        title: 'New Booking Request',
        description: data.message,
        duration: 5000,
      })
    })

    socket.on('booking_updated', (data) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'booking_status_update',
        title: 'Booking Updated',
        message: data.message,
        timestamp: data.timestamp,
        read: false,
        data
      }
      
      setNotifications(prev => [notification, ...prev])
      onNotification?.(notification)
      onBookingUpdate?.(data)
      
      toast({
        title: 'Booking Updated',
        description: data.message,
        duration: 3000,
      })
    })

    socket.on('new_review', (data) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'new_review',
        title: 'New Review',
        message: data.message,
        timestamp: data.timestamp,
        read: false,
        data
      }
      
      setNotifications(prev => [notification, ...prev])
      onNotification?.(notification)
      onReviewUpdate?.(data)
      
      toast({
        title: 'New Review',
        description: data.message,
        duration: 4000,
      })
    })

    socket.on('payment_received', (data) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'payment_received',
        title: 'Payment Received',
        message: data.message,
        timestamp: data.timestamp,
        read: false,
        data
      }
      
      setNotifications(prev => [notification, ...prev])
      onNotification?.(notification)
      
      toast({
        title: 'Payment Received',
        description: data.message,
        duration: 4000,
      })
    })

    socket.on('new_message', (data) => {
      const message = {
        id: Date.now().toString(),
        from: data.fromId,
        message: data.message,
        timestamp: data.timestamp,
        bookingId: data.bookingId
      }
      
      setMessages(prev => [message, ...prev])
      onMessage?.(message)
      
      toast({
        title: 'New Message',
        description: data.message,
        duration: 3000,
      })
    })

    socket.on('message_sent', (data) => {
      console.log('Message sent successfully:', data)
    })

    socket.on('service_updated', (data) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'service_updated',
        title: 'Service Updated',
        message: data.message,
        timestamp: data.timestamp,
        read: false,
        data
      }
      
      setNotifications(prev => [notification, ...prev])
      onNotification?.(notification)
    })

    socket.on('user_status_changed', (data) => {
      console.log('User status changed:', data)
    })

    // Connect if autoConnect is enabled
    if (autoConnect) {
      socket.connect()
    }
  }, [session, toast, autoConnect, onNotification, onMessage, onBookingUpdate, onReviewUpdate])

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  // Send booking request
  const sendBookingRequest = useCallback((data: {
    vendorId: string
    bookingId: string
    clientName: string
    date: string
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('booking_request', data)
    }
  }, [])

  // Update booking status
  const updateBookingStatus = useCallback((data: {
    bookingId: string
    status: string
    clientId: string
    vendorId: string
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('booking_status_update', data)
    }
  }, [])

  // Send review
  const sendReview = useCallback((data: {
    vendorId: string
    reviewId: string
    clientName: string
    rating: number
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('new_review', data)
    }
  }, [])

  // Send payment notification
  const sendPaymentNotification = useCallback((data: {
    vendorId: string
    amount: number
    bookingId: string
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('payment_received', data)
    }
  }, [])

  // Send message
  const sendMessage = useCallback((data: {
    fromId: string
    toId: string
    message: string
    bookingId?: string
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data)
    }
  }, [])

  // Update service
  const updateService = useCallback((data: {
    vendorId: string
    serviceId: string
    action: 'created' | 'updated' | 'deleted'
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('service_updated', data)
    }
  }, [])

  // Update user status
  const updateUserStatus = useCallback((status: 'online' | 'offline' | 'busy') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user_status_update', { status })
    }
  }, [])

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length

  // Connect on mount and when session changes
  useEffect(() => {
    if (session?.user?.email) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [session, connect, disconnect])

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    messages,
    unreadCount,
    connect,
    disconnect,
    sendBookingRequest,
    updateBookingStatus,
    sendReview,
    sendPaymentNotification,
    sendMessage,
    updateService,
    updateUserStatus,
    markNotificationAsRead,
    clearNotifications,
  }
} 