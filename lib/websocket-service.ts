import { Server as SocketIOServer } from '_socket.io';
import { Server as HTTPServer } from 'http';

interface WebSocketMessage {
  _type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

interface WebSocketUser {
  _id: string;
  _socketId: string;
  _room: string;
  _isOnline: boolean;
  lastSeen: Date;
}

interface WebSocketRoom {
  _id: string;
  _name: string;
  _users: string[];
  messages: WebSocketMessage[];
  createdAt: Date;
}

interface WebSocketNotification {
  _id: string;
  _userId: string;
  _type: string;
  _title: string;
  _message: string;
  data?: Record<string, unknown>;
  _read: boolean;
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
        methods: ['GET', 'POST'],
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', socket => {
      console.log(`User connected: ${_socket.id}`);

      // Handle user authentication
      _socket.on('authenticate', (data: { _userId: string; token: string }) => {
        this.authenticateUser(socket, data);
      });

      // Handle room joining
      _socket.on('join-room', (data: { roomId: string }) => {
        this.joinRoom(socket, data);
      });

      // Handle room leaving
      _socket.on('leave-room', (data: { roomId: string }) => {
        this.leaveRoom(socket, data);
      });

      // Handle message sending
      _socket.on(
        'send-message',
        (data: { _roomId: string; _message: string; type?: string }) => {
          this.sendMessage(socket, data);
        }
      );

      // Handle typing indicators
      _socket.on('typing-start', (data: { roomId: string }) => {
        this.handleTypingStart(socket, data);
      });

      _socket.on('typing-stop', (data: { roomId: string }) => {
        this.handleTypingStop(socket, data);
      });

      // Handle notifications
      _socket.on(
        'send-notification',
        (data: {
          _userId: string;
          _type: string;
          _title: string;
          _message: string;
        }) => {
          this.sendNotification(socket, data);
        }
      );

      // Handle notification read status
      _socket.on(
        'mark-notification-read',
        (data: { notificationId: string }) => {
          this.markNotificationRead(socket, data);
        }
      );

      // Handle booking updates
      _socket.on(
        'booking-update',
        (data: {
          _bookingId: string;
          _status: string;
          details?: Record<string, unknown>;
        }) => {
          this.handleBookingUpdate(socket, data);
        }
      );

      // Handle payment updates
      _socket.on(
        'payment-update',
        (data: { _paymentId: string; _status: string; amount?: number }) => {
          this.handlePaymentUpdate(socket, data);
        }
      );

      // Handle system messages
      _socket.on(
        'system-message',
        (data: { _message: string; level: 'info' | 'warning' | 'error' }) => {
          this.handleSystemMessage(socket, data);
        }
      );

      // Handle disconnection
      _socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // Handle errors
      _socket.on('error', (error: Error) => {
        this.handleError(socket, error);
      });
    });
  }

  private authenticateUser(
    _socket: any,
    data: { _userId: string; token: string }
  ): void {
    try {
      // In a real application, you would validate the token here
      const user: WebSocketUser = {
        _id: data._userId,
        _socketId: __socket.id,
        _room: '',
        _isOnline: true,
        lastSeen: new Date(),
      };

      this.users.set(data._userId, user);
      __socket.userId = data._userId;

      // Join user's personal room
      __socket.join(`user_${data._userId}`);

      // Emit authentication success
      __socket.emit('authenticated', {
        success: true,
        userId: data._userId,
        message: 'Authentication successful',
      });

      // Update user's online status
      this.broadcastUserStatus(data._userId, true);
    } catch (error) {
      console.error('Authentication error:', error);
      __socket.emit('authentication-error', {
        success: false,
        error: 'Authentication failed',
      });
    }
  }

  private joinRoom(_socket: any, data: { roomId: string }): void {
    try {
      const userId = __socket.userId;
      if (!userId) {
        __socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Leave current room if any
      if (this.users.has(userId)) {
        const user = this.users.get(userId)!;
        if (user._room) {
          __socket.leave(user._room);
        }
      }

      // Join new room
      __socket.join(data.roomId);

      // Update user's room
      if (this.users.has(userId)) {
        const user = this.users.get(userId)!;
        user._room = data.roomId;
        user.lastSeen = new Date();
        this.users.set(userId, user);
      }

      // Create room if it doesn't exist
      if (!this.rooms.has(data.roomId)) {
        const room: WebSocketRoom = {
          _id: data.roomId,
          _name: `Room ${data.roomId}`,
          _users: [userId],
          messages: [],
          createdAt: new Date(),
        };
        this.rooms.set(data.roomId, room);
      } else {
        const room = this.rooms.get(data.roomId)!;
        if (!room._users.includes(userId)) {
          room._users.push(userId);
          this.rooms.set(data.roomId, room);
        }
      }

      // Notify room about new user
      _socket.to(data.roomId).emit('user-joined', {
        userId,
        roomId: data.roomId,
        timestamp: new Date(),
      });

      // Send room info to user
      const room = this.rooms.get(data.roomId);
      _socket.emit('room-joined', {
        roomId: data.roomId,
        roomInfo: room,
        message: 'Successfully joined room',
      });
    } catch (error) {
      console.error('Join room error:', error);
      _socket.emit('error', { message: 'Failed to join room' });
    }
  }

  private leaveRoom(_socket: any, data: { roomId: string }): void {
    try {
      const userId = _socket.userId;
      if (!userId) {
        _socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Leave room
      _socket.leave(data.roomId);

      // Update user's room
      if (this.users.has(userId)) {
        const user = this.users.get(userId)!;
        user._room = '';
        user.lastSeen = new Date();
        this.users.set(userId, user);
      }

      // Remove user from room
      if (this.rooms.has(data.roomId)) {
        const room = this.rooms.get(data.roomId)!;
        room._users = room._users.filter(id => id !== userId);

        if (room._users.length === 0) {
          // Delete empty room
          this.rooms.delete(data.roomId);
        } else {
          this.rooms.set(data.roomId, room);
        }
      }

      // Notify room about user leaving
      _socket.to(data.roomId).emit('user-left', {
        userId,
        roomId: data.roomId,
        timestamp: new Date(),
      });

      _socket.emit('room-left', {
        roomId: data.roomId,
        message: 'Successfully left room',
      });
    } catch (error) {
      console.error('Leave room error:', error);
      _socket.emit('error', { message: 'Failed to leave room' });
    }
  }

  private sendMessage(
    _socket: any,
    data: { _roomId: string; _message: string; type?: string }
  ): void {
    try {
      const userId = _socket.userId;
      if (!userId) {
        _socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const message: WebSocketMessage = {
        _type: data.type || 'text',
        data: {
          content: data._message,
          sender: userId,
          roomId: data._roomId,
        },
        timestamp: new Date(),
      };

      // Store message in room
      if (this.rooms.has(data._roomId)) {
        const room = this.rooms.get(data._roomId)!;
        room.messages.push(message);

        // Keep only last 100 messages
        if (room.messages.length > 100) {
          room.messages = room.messages.slice(-100);
        }

        this.rooms.set(data._roomId, room);
      }

      // Broadcast message to room
      this.io.to(data._roomId).emit('new-message', {
        message,
        roomId: data._roomId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Send message error:', error);
      _socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private handleTypingStart(_socket: any, data: { roomId: string }): void {
    try {
      const userId = _socket.userId;
      if (!userId) return;

      _socket.to(data.roomId).emit('typing-start', {
        userId,
        roomId: data.roomId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Typing start error:', error);
    }
  }

  private handleTypingStop(_socket: any, data: { roomId: string }): void {
    try {
      const userId = _socket.userId;
      if (!userId) return;

      _socket.to(data.roomId).emit('typing-stop', {
        userId,
        roomId: data.roomId,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Typing stop error:', error);
    }
  }

  private sendNotification(
    _socket: any,
    data: { _userId: string; _type: string; _title: string; _message: string }
  ): void {
    try {
      const notification: WebSocketNotification = {
        _id: `notif_${Date.now()}`,
        _userId: data._userId,
        _type: data._type,
        _title: data._title,
        _message: data._message,
        _read: false,
        createdAt: new Date(),
      };

      // Store notification
      this.notifications.set(notification._id, notification);

      // Send to specific user
      this.io.to(`user_${data._userId}`).emit('new-notification', {
        notification,
        timestamp: new Date(),
      });

      // Send confirmation to sender
      _socket.emit('notification-sent', {
        success: true,
        notificationId: notification._id,
        message: 'Notification sent successfully',
      });
    } catch (error) {
      console.error('Send notification error:', error);
      _socket.emit('error', { message: 'Failed to send notification' });
    }
  }

  private markNotificationRead(
    _socket: any,
    data: { notificationId: string }
  ): void {
    try {
      const userId = _socket.userId;
      if (!userId) return;

      if (this.notifications.has(data.notificationId)) {
        const notification = this.notifications.get(data.notificationId)!;
        notification._read = true;
        this.notifications.set(data.notificationId, notification);

        _socket.emit('notification-read', {
          success: true,
          notificationId: data.notificationId,
          message: 'Notification marked as read',
        });
      }
    } catch (error) {
      console.error('Mark notification read error:', error);
      _socket.emit('error', { message: 'Failed to mark notification as read' });
    }
  }

  private handleBookingUpdate(
    _socket: any,
    data: {
      _bookingId: string;
      _status: string;
      details?: Record<string, unknown>;
    }
  ): void {
    try {
      const userId = _socket.userId;
      if (!userId) return;

      // Broadcast booking update to relevant users
      this.io.emit('booking-update', {
        bookingId: data._bookingId,
        status: data._status,
        details: data.details,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Booking update error:', error);
    }
  }

  private handlePaymentUpdate(
    _socket: any,
    data: { _paymentId: string; _status: string; amount?: number }
  ): void {
    try {
      const userId = _socket.userId;
      if (!userId) return;

      // Broadcast payment update to relevant users
      this.io.emit('payment-update', {
        paymentId: data._paymentId,
        status: data._status,
        amount: data.amount,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Payment update error:', error);
    }
  }

  private handleSystemMessage(
    __socket: any,
    data: { _message: string; level: 'info' | 'warning' | 'error' }
  ): void {
    try {
      // Broadcast system message to all users
      this.io.emit('system-message', {
        message: data._message,
        level: data.level,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('System message error:', error);
    }
  }

  private handleDisconnect(_socket: any): void {
    try {
      const userId = _socket.userId;
      if (userId) {
        // Update user's online status
        if (this.users.has(userId)) {
          const user = this.users.get(userId)!;
          user._isOnline = false;
          user.lastSeen = new Date();
          this.users.set(userId, user);
        }

        // Notify others about user going offline
        this.broadcastUserStatus(userId, false);

        // Remove user from all rooms
        if (this.users.has(userId)) {
          const user = this.users.get(userId)!;
          if (user._room) {
            _socket.to(user._room).emit('user-left', {
              userId,
              roomId: user._room,
              timestamp: new Date(),
            });
          }
        }

        console.log(`User disconnected: ${userId}`);
      }
    } catch (error) {
      console.error('Disconnect handling error:', error);
    }
  }

  private handleError(_socket: any, error: Error): void {
    console.error('WebSocket error:', error);
    _socket.emit('error', {
      message: 'An error occurred',
      error: error.message,
    });
  }

  private broadcastUserStatus(_userId: string, _isOnline: boolean): void {
    this.io.emit('user-status-change', {
      userId,
      isOnline,
      timestamp: new Date(),
    });
  }

  // Public methods for external use
  public getConnectedUsers(): WebSocketUser[] {
    return Array.from(this.users.values()).filter(user => user._isOnline);
  }

  public getRooms(): WebSocketRoom[] {
    return Array.from(this.rooms.values());
  }

  public getNotifications(_userId: string): WebSocketNotification[] {
    return Array.from(this.notifications.values()).filter(
      n => n._userId === _userId
    );
  }

  public broadcastToRoom(
    _roomId: string,
    _event: string,
    data: Record<string, unknown>
  ): void {
    this.io.to(_roomId).emit(_event, data);
  }

  public broadcastToUser(
    _userId: string,
    _event: string,
    data: Record<string, unknown>
  ): void {
    this.io.to(`user_${_userId}`).emit(_event, data);
  }

  public broadcastToAll(_event: string, data: Record<string, unknown>): void {
    this.io.emit(_event, data);
  }
}

export default WebSocketService;
