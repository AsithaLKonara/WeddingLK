import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface Message {
  _id: string;
  _senderId: string;
  _receiverId: string;
  _content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface Notification {
  _id: string;
  _userId: string;
  _title: string;
  _message: string;
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'booking_request'
    | 'booking_status_update'
    | 'new_review'
    | 'payment_received'
    | 'new_message'
    | 'service_updated'
    | 'user_status_changed'
    | 'vendor_approved'
    | 'vendor_rejected';
  timestamp: Date;
  _read: boolean;
  data?: any;
}

interface TypingIndicator {
  _senderId: string;
  _isTyping: boolean;
}

interface SocketState {
  _isConnected: boolean;
  _isAuthenticated: boolean;
  _error: string | null;
}

export const useSocket = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [socketState, setSocketState] = useState<SocketState>({
    isConnected: false,
    isAuthenticated: false,
    error: null,
  });

  // Message state
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (!session?.user?.email) return;

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
      {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      }
    );

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('🔌 Socket connected');
      setSocketState(prev => ({ ...prev, isConnected: true, error: null }));

      // Authenticate with user data
      if (session.user) {
        socket.emit('authenticate', {
          userId: session.user.id || session.user.email,
          email: session.user.email,
          role: session.user.role || 'user',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setSocketState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('connect_error', error => {
      console.error('🔌 Socket connection error:', error);
      setSocketState(prev => ({ ...prev, error: error.message }));
    });

    // Authentication events
    socket.on('authenticated', data => {
      if (data.success) {
        console.log('✅ Socket authenticated');
        setSocketState(prev => ({ ...prev, isAuthenticated: true }));

        // Join user's personal room
        if (session.user?.id || session.user?.email) {
          socket.emit('join-user-room', session.user.id || session.user.email);
        }
      }
    });

    // Message events
    socket.on('new-message', (message: Message) => {
      console.log('💬 New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('message-sent', (message: Message) => {
      console.log('✅ Message sent successfully:', message);
      // Update local message state if needed
    });

    // Typing indicators
    socket.on('typing-indicator', (data: TypingIndicator) => {
      if (data.isTyping) {
        setTypingUsers(prev => new Set(prev).add(data.senderId));
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.senderId);
          return newSet;
        });
      }
    });

    // Notification events
    socket.on('new-notification', (notification: Notification) => {
      console.log('🔔 New notification:', notification);
      setNotifications(prev => [notification, ...prev]);
    });

    // Read receipts
    socket.on('read-receipt', (data: { _messageId: string; readBy: string }) => {
      console.log('📖 Read receipt:', data);
      // Update message read status if needed
    });

    // Error handling
    socket.on('error', error => {
      console.error('🔌 Socket error:', error);
      setSocketState(prev => ({ ...prev, error: error.message }));
    });

    return socket;
  }, [session]);

  // Cleanup socket connection
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocketState({
        isConnected: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  // Join vendor room
  const joinVendorRoom = useCallback(
    (_vendorId: string) => {
      if (socketRef.current && socketState.isAuthenticated) {
        socketRef.current.emit('join-vendor-room', vendorId);
        console.log(`🏢 Joined vendor room: ${vendorId}`);
      }
    },
    [socketState.isAuthenticated]
  );

  // Join venue room
  const joinVenueRoom = useCallback(
    (_venueId: string) => {
      if (socketRef.current && socketState.isAuthenticated) {
        socketRef.current.emit('join-venue-room', venueId);
        console.log(`🏛️ Joined venue room: ${venueId}`);
      }
    },
    [socketState.isAuthenticated]
  );

  // Send message
  const sendMessage = useCallback(
    (message: Omit<Message, 'id' | 'timestamp'>) => {
      if (socketRef.current && socketState.isAuthenticated) {
        const fullMessage: Message = {
          ...message,
          id: Date.now().toString(), // Temporary ID
          timestamp: new Date(),
        };
        socketRef.current.emit('send-message', fullMessage);
        return fullMessage;
      }
      return null;
    },
    [socketState.isAuthenticated]
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (_receiverId: string, _isTyping: boolean) => {
      if (socketRef.current && socketState.isAuthenticated) {
        socketRef.current.emit(isTyping ? 'typing-start' : 'typing-stop', {
          receiverId,
          senderId: session?.user?.id || session?.user?.email,
        });
      }
    },
    [socketState.isAuthenticated, session]
  );

  // Mark message as read
  const markMessageAsRead = useCallback(
    (_messageId: string) => {
      if (socketRef.current && socketState.isAuthenticated) {
        socketRef.current.emit('mark-read', messageId);
      }
    },
    [socketState.isAuthenticated]
  );

  // Mark notification as read
  const markNotificationAsRead = useCallback(
    (_notificationId: string) => {
      if (socketRef.current && socketState.isAuthenticated) {
        socketRef.current.emit('notification-read', notificationId);
      }
    },
    [socketState.isAuthenticated]
  );

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Initialize socket when session changes
  useEffect(() => {
    if (session?.user?.email) {
      initializeSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [session, initializeSocket, disconnectSocket]);

  return {
    // Socket state
    isConnected: socketState.isConnected,
    isAuthenticated: socketState.isAuthenticated,
    error: socketState.error,

    // Data
    messages,
    notifications,
    typingUsers,

    // Actions
    sendMessage,
    sendTypingIndicator,
    markMessageAsRead,
    markNotificationAsRead,
    joinVendorRoom,
    joinVenueRoom,
    clearNotifications,

    // Connection management
    disconnectSocket,
  };
};
