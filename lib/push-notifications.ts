import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models';
import { User } from '@/lib/models';

interface PushNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

interface PushNotificationPayload {
  title: string;
  message: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  timestamp?: number;
}

interface PushNotificationOptions {
  userId?: string;
  userGroup?: string;
  priority?: 'high' | 'normal' | 'low';
  ttl?: number;
  urgency?: 'very-low' | 'low' | 'normal' | 'high' | 'very-high';
  topic?: string;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private vapidKeys: { publicKey: string; privateKey: string } | null = null;

  private constructor() {}

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  // Initialize push notification service
  public async initialize(): Promise<void> {
    try {
      await connectDB();

      // Generate VAPID keys if not exists
      if (!this.vapidKeys) {
        this.vapidKeys = this.generateVAPIDKeys();
      }

      console.log('Push notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize push notification service:', error);
      throw error;
    }
  }

  // Generate VAPID keys for web push
  private generateVAPIDKeys(): { publicKey: string; privateKey: string } {
    // In production, you should use proper VAPID key generation
    // For now, we'll use placeholder keys
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY || 'placeholder_public_key',
      privateKey: process.env.VAPID_PRIVATE_KEY || 'placeholder_private_key',
    };
  }

  // Send push notification to specific user
  public async sendToUser(
    userId: string,
    notification: PushNotificationPayload,
    options?: PushNotificationOptions
  ): Promise<boolean> {
    try {
      await connectDB();

      // Get user's push subscription
      const user = await (User as any).findById(userId);
      if (!user || !user.pushSubscription) {
        console.log(`User ${userId} has no push subscription`);
        return false;
      }

      // Send notification
      const success = await this.sendPushNotification(
        user.pushSubscription,
        notification,
        options
      );

      if (success) {
        // Store notification in database
        await this.storeNotification(userId, notification, options);
      }

      return success;
    } catch (error) {
      console.error(
        `Failed to send push notification to user ${userId}:`,
        error
      );
      return false;
    }
  }

  // Send push notification to user group
  public async sendToGroup(
    userGroup: string,
    notification: PushNotificationPayload,
    options?: PushNotificationOptions
  ): Promise<number> {
    try {
      await connectDB();

      // Get all users in the group
      const users = await (User as any).find({
        userGroup,
        pushSubscription: { $exists: true },
      });

      if (users.length === 0) {
        console.log(
          `No users found in group ${userGroup} with push subscriptions`
        );
        return 0;
      }

      let successCount = 0;

      // Send to each user
      for (const user of users) {
        try {
          const success = await this.sendPushNotification(
            user.pushSubscription,
            notification,
            options
          );
          if (success) {
            successCount++;
            // Store notification
            await this.storeNotification(
              user._id.toString(),
              notification,
              options
            );
          }
        } catch (error) {
          console.error(`Failed to send to user ${user._id}:`, error);
        }
      }

      return successCount;
    } catch (error) {
      console.error(
        `Failed to send push notification to group ${userGroup}:`,
        error
      );
      return 0;
    }
  }

  // Send push notification to all users
  public async sendToAll(
    notification: PushNotificationPayload,
    options?: PushNotificationOptions
  ): Promise<number> {
    try {
      await connectDB();

      // Get all users with push subscriptions
      const users = await (User as any).find({ pushSubscription: { $exists: true } });

      if (users.length === 0) {
        console.log('No users found with push subscriptions');
        return 0;
      }

      let successCount = 0;

      // Send to each user
      for (const user of users) {
        try {
          const success = await this.sendPushNotification(
            user.pushSubscription,
            notification,
            options
          );
          if (success) {
            successCount++;
            // Store notification
            await this.storeNotification(
              user._id.toString(),
              notification,
              options
            );
          }
        } catch (error) {
          console.error(`Failed to send to user ${user._id}:`, error);
        }
      }

      return successCount;
    } catch (error) {
      console.error('Failed to send push notification to all users:', error);
      return 0;
    }
  }

  // Send actual push notification
  private async sendPushNotification(
    subscription: any,
    notification: PushNotificationPayload,
    options?: PushNotificationOptions
  ): Promise<boolean> {
    try {
      // In a real implementation, you would use web-push library
      // For now, we'll simulate success
      console.log('Sending push notification:', {
        subscription: subscription.endpoint,
        notification,
        options,
      });

      return true;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return false;
    }
  }

  // Store notification in database
  private async storeNotification(
    userId: string,
    notification: PushNotificationPayload,
    options?: PushNotificationOptions
  ): Promise<void> {
    try {
      const newNotification = new Notification({
        userId,
        title: notification.title,
        message: notification.message,
        type: 'push',
        data: notification.data || {},
        read: false,
        createdAt: new Date(),
        expiresAt: options?.ttl
          ? new Date(Date.now() + options.ttl * 1000)
          : undefined,
      });

      await newNotification.save();
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  // Get user's push notifications
  public async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PushNotification[]> {
    try {
      await connectDB();

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      return notifications.map(n => ({
        id: n._id.toString(),
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        data: n.data,
        read: n.read,
        createdAt: n.createdAt,
        expiresAt: n.expiresAt,
      }));
    } catch (error) {
      console.error(`Failed to get notifications for user ${userId}:`, error);
      return [];
    }
  }

  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await connectDB();

      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );

      return !!notification;
    } catch (error) {
      console.error(
        `Failed to mark notification ${notificationId} as read:`,
        error
      );
      return false;
    }
  }

  // Mark all user notifications as read
  public async markAllAsRead(userId: string): Promise<number> {
    try {
      await connectDB();

      const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );

      return result.modifiedCount;
    } catch (error) {
      console.error(
        `Failed to mark all notifications as read for user ${userId}:`,
        error
      );
      return 0;
    }
  }

  // Delete notification
  public async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await connectDB();

      const result = await Notification.findByIdAndDelete(notificationId);
      return !!result;
    } catch (error) {
      console.error(`Failed to delete notification ${notificationId}:`, error);
      return false;
    }
  }

  // Delete expired notifications
  public async deleteExpiredNotifications(): Promise<number> {
    try {
      await connectDB();

      const result = await Notification.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      return result.deletedCount;
    } catch (error) {
      console.error('Failed to delete expired notifications:', error);
      return 0;
    }
  }

  // Get notification statistics
  public async getNotificationStats(
    userId?: string
  ): Promise<Record<string, unknown>> {
    try {
      await connectDB();

      const query = userId ? { userId } : {};

      const [total, unread, read] = await Promise.all([
        Notification.countDocuments(query),
        Notification.countDocuments({ ...query, read: false }),
        Notification.countDocuments({ ...query, read: true }),
      ]);

      return {
        total,
        unread,
        read,
        readPercentage: total > 0 ? Math.round((read / total) * 100) : 0,
      };
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      return {
        total: 0,
        unread: 0,
        read: 0,
        readPercentage: 0,
      };
    }
  }

  // Test push notification service
  public async testService(): Promise<Record<string, unknown>> {
    try {
      await connectDB();

      const testNotification: PushNotificationPayload = {
        title: 'Test Notification',
        message: 'This is a test push notification',
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
        data: { test: true, timestamp: Date.now() },
      };

      const result = await this.sendToAll(testNotification, {
        priority: 'high',
      });

      return {
        success: true,
        message: 'Push notification service test completed',
        notificationsSent: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Push notification service test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default PushNotificationService;
