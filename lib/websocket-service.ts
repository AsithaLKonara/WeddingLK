import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

interface WebSocketUser {
  id: string;
  socketId: string;
  room: string;
  isOnline: boolean;
  lastSeen: Date;
}

interface WebSocketRoom {
  id: string;
  name: string;
  users: string[];
  messages: WebSocketMessage[];
  createdAt: Date;
}

interface WebSocketNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

class WebSocketService {
  private io: SocketIOServer;
  private users: Map<string, WebSocketUser> = new Map();
  private rooms: Map<string, WebSocketRoom> = new Map();
  private notifications: Map<string, WebSocketNotification> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (data: { userId: string; token: string }) => {
        this.authenticateUser(socket, data);
      });

      // Handle room joining
      socket.on('join-room', (data: { roomId: string }) => {
        this.joinRoom(socket, data);
      });

      // Handle room leaving
      socket.on('leave-room', (data: { roomId: string }) => {
        this.leaveRoom(socket, data);
      });

      // Handle message sending
      socket.on('send-message', (data: { roomId: string; message: string; type?: string }) => {
        this.sendMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { roomId: string }) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing-stop', (data: { roomId: string }) => {
        this.handleTypingStop(socket, data);
      });

      // Handle notifications
      socket.on('send-notification', (data: { userId: string; type: string; title: string; message: string }) => {
        this.sendNotification(socket, data);
      });

      // Handle notification read status
      socket.on('mark-notification-read', (data: { notificationId: string }) => {
        this.markNotificationRead(socket, data);
      });

      // Handle booking updates
      socket.on('booking-update', (data: { bookingId: string; status: string; details?: Record<string, unknown> }) => {
        this.handleBookingUpdate(socket, data);
      });

      // Handle payment updates
      socket.on('payment-update', (data: { paymentId: string; status: string; amount?: number }) => {
        this.handlePaymentUpdate(socket, data);
      });

      // Handle system messages
      socket.on('system-message', (data: { message: string; level: 'info' | 'warning' | 'error' }) => {
        this.handleSystemMessage(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // Handle errors
      socket.on('error', (error: Error) => {
        this.handleError(socket, error);
      });
    });
  }

  private authenticateUser(socket: any, data: { userId: string; token: string }): void {
    try {
      // In a real application, you would validate the token here
      const user: WebSocketUser = {
        id: data.userId,
      socketId: socket.id,
        room: '',
        isOnline: true,
        lastSeen: new Date()
      };

      this.users.set(data.userId, user);
      socket.userId = data.userId;

      // Join user's personal room
      socket.join(`user_${data.userId}`);

      // Emit authentication success
      socket.emit('authenticated', {
        success: true,
        userId: data.userId,
        message: 'Authentication successful'
      });

      // Update user's online status
      this.broadcastUserStatus(data.userId, true);

    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('authentication-error', {
        success: false,
        error: 'Authentication failed'
      });
    }
  }

  private joinRoom(socket: any, data: { roomId: string }): void {
    try {
      const userId = socket.userId;
      if (!userId) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Leave current room if any
      if (this.users.has(userId)) {
        const user = this.users.get(userId)!;
        if (user.room) {
          socket.leave(user.room);
        }
      }

      // Join new room
      socket.join(data.roomId);

      // Update user's room
      if (this.users.has(userId)) {
        const user = this.users.get(userId)!;
        user.room = data.roomId;
        user.lastSeen = new Date();
        this.users.set(userId, user);
      }

      // Create room if it doesn't exist
      if (!this.rooms.has(data.roomId)) {
        const room: WebSocketRoom = {
          id: data.roomId,
          name: `Room ${data.roomId}`,
          users: [userId],
          messages: [],
          createdAt: new Date()
        };
        this.rooms.set(data.roomId, room);
      } else {
        const room = this.rooms.get(data.roomId)!;
        if (!room.users.includes(userId)) {
          room.users.push(userId);
          this.rooms.set(data.roomId, room);
        }
      }

      // Notify room about new user
      socket.to(data.roomId).emit('user-joined', {
        userId,
        roomId: data.roomId,
        timestamp: new Date()
      });

      // Send room info to user
      const room = this.rooms.get(data.roomId);
      socket.emit('room-joined', {
        roomId: data.roomId,
        roomInfo: room,
        message: 'Successfully joined room'
      });

    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  private leaveRoom(socket: any, data: { roomId: string }): void {
    try {
      const userId = socket.userId;
      if (!userId) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
  }

  // Leave room
      socket.leave(data.roomId);

      // Update user's room
      if (this.users.has(userId)) {
        const user = this.users.get(userId)!;
        user.room = '';
        user.lastSeen = new Date();
        this.users.set(userId, user);
      }

      // Remove user from room
      if (this.rooms.has(data.roomId)) {
        const room = this.rooms.get(data.roomId)!;
        room.users = room.users.filter(id => id !== userId);
        
        if (room.users.length === 0) {
          // Delete empty room
          this.rooms.delete(data.roomId);
        } else {
          this.rooms.set(data.roomId, room);
        }
      }

      // Notify room about user leaving
      socket.to(data.roomId).emit('user-left', {
        userId,
        roomId: data.roomId,
        timestamp: new Date()
      });

      socket.emit('room-left', {
        roomId: data.roomId,
        message: 'Successfully left room'
      });

    } catch (error) {
      console.error('Leave room error:', error);
      socket.emit('error', { message: 'Failed to leave room' });
    }
  }

  private sendMessage(socket: any, data: { roomId: string; message: string; type?: string }): void {
    try {
      const userId = socket.userId;
      if (!userId) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const message: WebSocketMessage = {
        type: data.type || 'text',
        data: {
          content: data.message,
          sender: userId,
          roomId: data.roomId
        },
        timestamp: new Date()
      };

      // Store message in room
      if (this.rooms.has(data.roomId)) {
        const room = this.rooms.get(data.roomId)!;
        room.messages.push(message);
        
        // Keep only last 100 messages
        if (room.messages.length > 100) {
          room.messages = room.messages.slice(-100);
        }
        
        this.rooms.set(data.roomId, room);
    }

    // Broadcast message to room
      this.io.to(data.roomId).emit('new-message', {
        message,
        roomId: data.roomId,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private handleTypingStart(socket: any, data: { roomId: string }): void {
    try {
      const userId = socket.userId;
      if (!userId) return;

      socket.to(data.roomId).emit('typing-start', {
        userId,
      roomId: data.roomId,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Typing start error:', error);
    }
  }

  private handleTypingStop(socket: any, data: { roomId: string }): void {
    try {
      const userId = socket.userId;
      if (!userId) return;

      socket.to(data.roomId).emit('typing-stop', {
        userId,
      roomId: data.roomId,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Typing stop error:', error);
    }
  }

  private sendNotification(socket: any, data: { userId: string; type: string; title: string; message: string }): void {
    try {
      const notification: WebSocketNotification = {
        id: `notif_${Date.now()}`,
      userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: false,
        createdAt: new Date()
      };

      // Store notification
      this.notifications.set(notification.id, notification);

      // Send to specific user
      this.io.to(`user_${data.userId}`).emit('new-notification', {
        notification,
        timestamp: new Date()
      });

      // Send confirmation to sender
      socket.emit('notification-sent', {
        success: true,
        notificationId: notification.id,
        message: 'Notification sent successfully'
      });

    } catch (error) {
      console.error('Send notification error:', error);
      socket.emit('error', { message: 'Failed to send notification' });
    }
  }

  private markNotificationRead(socket: any, data: { notificationId: string }): void {
    try {
      const userId = socket.userId;
      if (!userId) return;

      if (this.notifications.has(data.notificationId)) {
        const notification = this.notifications.get(data.notificationId)!;
        notification.read = true;
        this.notifications.set(data.notificationId, notification);

        socket.emit('notification-read', {
          success: true,
          notificationId: data.notificationId,
          message: 'Notification marked as read'
        });
      }

    } catch (error) {
      console.error('Mark notification read error:', error);
      socket.emit('error', { message: 'Failed to mark notification as read' });
    }
  }

  private handleBookingUpdate(socket: any, data: { bookingId: string; status: string; details?: Record<string, unknown> }): void {
    try {
      const userId = socket.userId;
      if (!userId) return;

      // Broadcast booking update to relevant users
      this.io.emit('booking-update', {
        bookingId: data.bookingId,
        status: data.status,
        details: data.details,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Booking update error:', error);
    }
  }

  private handlePaymentUpdate(socket: any, data: { paymentId: string; status: string; amount?: number }): void {
    try {
      const userId = socket.userId;
      if (!userId) return;

      // Broadcast payment update to relevant users
      this.io.emit('payment-update', {
        paymentId: data.paymentId,
        status: data.status,
        amount: data.amount,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Payment update error:', error);
    }
  }

  private handleSystemMessage(socket: any, data: { message: string; level: 'info' | 'warning' | 'error' }): void {
    try {
      // Broadcast system message to all users
      this.io.emit('system-message', {
        message: data.message,
        level: data.level,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('System message error:', error);
    }
  }

  private handleDisconnect(socket: any): void {
    try {
      const userId = socket.userId;
      if (userId) {
        // Update user's online status
        if (this.users.has(userId)) {
          const user = this.users.get(userId)!;
          user.isOnline = false;
          user.lastSeen = new Date();
          this.users.set(userId, user);
        }

        // Notify others about user going offline
        this.broadcastUserStatus(userId, false);

        // Remove user from all rooms
        if (this.users.has(userId)) {
          const user = this.users.get(userId)!;
          if (user.room) {
            socket.to(user.room).emit('user-left', {
              userId,
              roomId: user.room,
              timestamp: new Date()
            });
          }
        }

        console.log(`User disconnected: ${userId}`);
      }
    } catch (error) {
      console.error('Disconnect handling error:', error);
    }
  }

  private handleError(socket: any, error: Error): void {
    console.error('WebSocket error:', error);
    socket.emit('error', {
      message: 'An error occurred',
      error: error.message
    });
  }

  private broadcastUserStatus(userId: string, isOnline: boolean): void {
    this.io.emit('user-status-change', {
      userId,
      isOnline,
      timestamp: new Date()
    });
  }

  // Public methods for external use
  public getConnectedUsers(): WebSocketUser[] {
    return Array.from(this.users.values()).filter(user => user.isOnline);
  }

  public getRooms(): WebSocketRoom[] {
    return Array.from(this.rooms.values());
  }

  public getNotifications(userId: string): WebSocketNotification[] {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  public broadcastToRoom(roomId: string, event: string, data: Record<string, unknown>): void {
    this.io.to(roomId).emit(event, data);
  }

  public broadcastToUser(userId: string, event: string, data: Record<string, unknown>): void {
    this.io.to(`user_${userId}`).emit(event, data);
  }

  public broadcastToAll(event: string, data: Record<string, unknown>): void {
    this.io.emit(event, data);
  }
}

export default WebSocketService; 