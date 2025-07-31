import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'

export interface SocketServer extends NetServer {
  io?: SocketIOServer
}

export interface SocketWithIO extends NextApiRequest {
  socket: {
    server: SocketServer
  } & NextApiRequest['socket']
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: SocketServer
  } & NextApiResponse['socket']
}

export const initSocket = (req: SocketWithIO, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    })

    // Store user connections
    const userConnections = new Map<string, string>()

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Handle user authentication
      socket.on('authenticate', (data: { userId: string; role: string }) => {
        const { userId, role } = data
        userConnections.set(userId, socket.id)
        socket.join(`user_${userId}`)
        socket.join(`role_${role}`)
        
        console.log(`User ${userId} (${role}) authenticated`)
      })

      // Handle booking notifications
      socket.on('booking_request', (data: { 
        vendorId: string; 
        bookingId: string; 
        clientName: string; 
        date: string 
      }) => {
        const { vendorId, bookingId, clientName, date } = data
        
        // Notify vendor about new booking
        io.to(`user_${vendorId}`).emit('new_booking', {
          type: 'booking_request',
          bookingId,
          clientName,
          date,
          message: `New booking request from ${clientName} for ${date}`,
          timestamp: new Date().toISOString(),
        })

        // Notify admin about new booking
        io.to('role_admin').emit('new_booking', {
          type: 'booking_request',
          bookingId,
          clientName,
          date,
          message: `New booking request from ${clientName}`,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle booking status updates
      socket.on('booking_status_update', (data: {
        bookingId: string
        status: string
        clientId: string
        vendorId: string
      }) => {
        const { bookingId, status, clientId, vendorId } = data
        
        // Notify client about booking status change
        io.to(`user_${clientId}`).emit('booking_updated', {
          type: 'booking_status_update',
          bookingId,
          status,
          message: `Your booking has been ${status}`,
          timestamp: new Date().toISOString(),
        })

        // Notify vendor about booking status change
        io.to(`user_${vendorId}`).emit('booking_updated', {
          type: 'booking_status_update',
          bookingId,
          status,
          message: `Booking ${bookingId} status updated to ${status}`,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle review notifications
      socket.on('new_review', (data: {
        vendorId: string
        reviewId: string
        clientName: string
        rating: number
      }) => {
        const { vendorId, reviewId, clientName, rating } = data
        
        // Notify vendor about new review
        io.to(`user_${vendorId}`).emit('new_review', {
          type: 'new_review',
          reviewId,
          clientName,
          rating,
          message: `New ${rating}-star review from ${clientName}`,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle payment notifications
      socket.on('payment_received', (data: {
        vendorId: string
        amount: number
        bookingId: string
      }) => {
        const { vendorId, amount, bookingId } = data
        
        // Notify vendor about payment
        io.to(`user_${vendorId}`).emit('payment_received', {
          type: 'payment_received',
          amount,
          bookingId,
          message: `Payment of LKR ${amount.toLocaleString()} received for booking ${bookingId}`,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle chat messages
      socket.on('send_message', (data: {
        fromId: string
        toId: string
        message: string
        bookingId?: string
      }) => {
        const { fromId, toId, message, bookingId } = data
        
        // Send message to recipient
        io.to(`user_${toId}`).emit('new_message', {
          type: 'new_message',
          fromId,
          message,
          bookingId,
          timestamp: new Date().toISOString(),
        })

        // Send confirmation to sender
        socket.emit('message_sent', {
          type: 'message_sent',
          toId,
          message,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle service updates
      socket.on('service_updated', (data: {
        vendorId: string
        serviceId: string
        action: 'created' | 'updated' | 'deleted'
      }) => {
        const { vendorId, serviceId, action } = data
        
        // Notify admin about service changes
        io.to('role_admin').emit('service_updated', {
          type: 'service_updated',
          vendorId,
          serviceId,
          action,
          message: `Service ${action} by vendor ${vendorId}`,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle user status updates
      socket.on('user_status_update', (data: {
        userId: string
        status: 'online' | 'offline' | 'busy'
      }) => {
        const { userId, status } = data
        
        // Broadcast user status to relevant connections
        socket.broadcast.emit('user_status_changed', {
          type: 'user_status_changed',
          userId,
          status,
          timestamp: new Date().toISOString(),
        })
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        
        // Remove user connection
        for (const [userId, socketId] of userConnections.entries()) {
          if (socketId === socket.id) {
            userConnections.delete(userId)
            break
          }
        }
      })
    })

    res.socket.server.io = io
  }

  return res.socket.server.io
}

// Helper function to emit notifications from API routes
export const emitNotification = (event: string, data: any) => {
  // This would be used in API routes to emit notifications
  // The actual implementation would need access to the io instance
  console.log(`Emitting ${event}:`, data)
}

// Notification types
export interface Notification {
  id: string
  type: 'booking_request' | 'booking_status_update' | 'new_review' | 'payment_received' | 'new_message' | 'service_updated' | 'user_status_changed'
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: any
}

// Client-side socket hook types
export interface SocketEvents {
  'authenticate': (data: { userId: string; role: string }) => void
  'booking_request': (data: any) => void
  'booking_status_update': (data: any) => void
  'new_review': (data: any) => void
  'payment_received': (data: any) => void
  'send_message': (data: any) => void
  'service_updated': (data: any) => void
  'user_status_update': (data: any) => void
  'new_booking': (data: any) => void
  'booking_updated': (data: any) => void
  'new_message': (data: any) => void
  'message_sent': (data: any) => void
  'user_status_changed': (data: any) => void
} 