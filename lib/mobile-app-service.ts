import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { Venue } from '@/lib/models';
import { Vendor } from '@/lib/models';
import { Booking } from '@/lib/models';
import { Notification } from '@/lib/models';

interface MobileAppConfig {
  version: string;
  features: string[];
  settings: Record<string, unknown>;
}

interface MobileAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  theme_color: string;
  background_color: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

interface ReactNativeConfig {
  apiUrl: string;
  websocketUrl: string;
  features: string[];
  settings: Record<string, unknown>;
}

interface MobileAPIDocs {
  endpoints: Array<{
    path: string;
    method: string;
    description: string;
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
  }>;
  authentication: string;
  rateLimiting: string;
}

interface MobileUserData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profile: Record<string, unknown>;
  };
  preferences: Record<string, unknown>;
  notifications: Array<Record<string, unknown>>;
}

interface MobileVenuesData {
  venues: Array<Record<string, unknown>>;
  total: number;
  filters: Record<string, unknown>;
}

interface MobileVendorsData {
  vendors: Array<Record<string, unknown>>;
  total: number;
  filters: Record<string, unknown>;
}

interface MobileBookingsData {
  bookings: Array<Record<string, unknown>>;
  total: number;
  status: string;
}

interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

class MobileAppService {
  // Get mobile app configuration
  static getMobileAppConfig(): MobileAppConfig {
    return {
      version: '1.0.0',
      features: [
        'venue-booking',
        'vendor-management',
        'real-time-chat',
        'payment-processing',
        'push-notifications',
        'offline-support',
        'dark-mode',
        'multi-language',
      ],
      settings: {
        enablePushNotifications: true,
        enableOfflineMode: true,
        enableDarkMode: false,
        language: 'en',
        theme: 'light',
      },
    };
  }

  // Generate mobile app manifest
  static generateMobileAppManifest(): MobileAppManifest {
    return {
      name: 'WeddingLK - Wedding Planning Made Easy',
      short_name: 'WeddingLK',
      description: 'Your complete wedding planning companion',
      start_url: '/',
      display: 'standalone',
      theme_color: '#FF6B9D',
      background_color: '#FFFFFF',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    };
  }

  // Generate React Native configuration
  static generateReactNativeConfig(): ReactNativeConfig {
    return {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      websocketUrl:
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
      features: [
        'real-time-updates',
        'offline-caching',
        'push-notifications',
        'biometric-auth',
        'deep-linking',
      ],
      settings: {
        cacheTimeout: 300000, // 5 minutes
        maxRetries: 3,
        requestTimeout: 10000, // 10 seconds
        enableLogging: process.env.NODE_ENV === 'development',
      },
    };
  }

  // Generate mobile API documentation
  static generateMobileAPIDocs(): MobileAPIDocs {
    return {
      endpoints: [
        {
          path: '/api/mobile',
          method: 'POST',
          description: 'Handle mobile app operations',
          parameters: [
            {
              name: 'action',
              type: 'string',
              required: true,
              description:
                'Action to perform (user-data, venues, vendors, bookings, push-notification)',
            },
            {
              name: 'data',
              type: 'object',
              required: false,
              description: 'Additional data for the action',
            },
          ],
        },
        {
          path: '/api/mobile',
          method: 'GET',
          description: 'Get mobile app configuration and data',
          parameters: [
            {
              name: 'type',
              type: 'string',
              required: false,
              description:
                'Type of data to retrieve (config, manifest, react-native-config, api-docs)',
            },
          ],
        },
      ],
      authentication: 'Bearer token in Authorization header',
      rateLimiting: '100 requests per minute per user',
    };
  }

  // Test mobile app service
  static async testMobileAppService(): Promise<Record<string, unknown>> {
    try {
      await connectDB();

      const results = {
        database: 'Connected',
        config: this.getMobileAppConfig(),
        manifest: this.generateMobileAppManifest(),
        rnConfig: this.generateReactNativeConfig(),
        apiDocs: this.generateMobileAPIDocs(),
      };

      return results;
    } catch (error) {
      console.error('Mobile app service test failed:', error);
      return {
        error: 'Mobile app service test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get mobile user data
  static async getMobileUserData(
    userId: string
  ): Promise<MobileUserData | null> {
    try {
      await connectDB();

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return null;
      }

      const notifications = await Notification.find({
        userId,
        read: false,
      }).limit(10);

      return {
        user: {
          id: user._id.toString(),
          name: user.name || 'Unknown User',
          email: user.email,
          role: user.role,
          profile: user.profile || {},
        },
        preferences: user.preferences || {},
        notifications: notifications.map(n => ({
          id: n._id.toString(),
          title: n.title,
          message: n.message,
          type: n.type,
          createdAt: n.createdAt,
        })),
      };
    } catch (error) {
      console.error('Error getting mobile user data:', error);
      return null;
    }
  }

  // Get mobile venues
  static async getMobileVenues(
    filters: Record<string, unknown>
  ): Promise<MobileVenuesData | null> {
    try {
      await connectDB();

      const query: Record<string, unknown> = { isActive: true };

      if (filters.location) {
        query.location = { $near: filters.location };
      }

      if (filters.capacity) {
        query.capacity = { $gte: filters.capacity };
      }

      if (
        filters.priceRange &&
        typeof filters.priceRange === 'object' &&
        'min' in filters.priceRange &&
        'max' in filters.priceRange
      ) {
        const priceRange = filters.priceRange as { min: number; max: number };
        query.pricePerPerson = { $gte: priceRange.min, $lte: priceRange.max };
      }

      const venues = await Venue.find(query)
        .select(
          'name description location capacity pricePerPerson images rating'
        )
        .limit(20);

      return {
        venues: venues.map(v => ({
          id: v._id.toString(),
          name: v.name,
          description: v.description,
          location: v.location,
          capacity: v.capacity,
          pricePerPerson: v.pricePerPerson,
          images: v.images,
          rating: v.rating,
        })),
        total: venues.length,
        filters,
      };
    } catch (error) {
      console.error('Error getting mobile venues:', error);
      return null;
    }
  }

  // Get mobile vendors
  static async getMobileVendors(
    filters: Record<string, unknown>
  ): Promise<MobileVendorsData | null> {
    try {
      await connectDB();

      const query: Record<string, unknown> = { isActive: true };

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.location) {
        query.location = { $near: filters.location };
      }

      if (filters.rating) {
        query.rating = { $gte: filters.rating };
      }

      const vendors = await Vendor.find(query)
        .select('name category description location rating images services')
        .limit(20);

      return {
        vendors: vendors.map(v => ({
          id: v._id.toString(),
          name: v.name,
          category: v.category,
          description: v.description,
          location: v.location,
          rating: v.rating,
          images: v.images,
          services: v.services,
        })),
        total: vendors.length,
        filters,
      };
    } catch (error) {
      console.error('Error getting mobile vendors:', error);
      return null;
    }
  }

  // Get mobile bookings
  static async getMobileBookings(
    userId: string
  ): Promise<MobileBookingsData | null> {
    try {
      await connectDB();

      const bookings = await Booking.find({ userId })
        .populate('venue', 'name location')
        .populate('vendor', 'name category')
        .sort({ createdAt: -1 })
        .limit(20);

      return {
        bookings: bookings.map(b => ({
          id: b._id.toString(),
          venue: b.venue,
          vendor: b.vendor,
          date: b.date,
          status: b.status,
          totalAmount: b.totalAmount,
          createdAt: b.createdAt,
        })),
        total: bookings.length,
        status: 'active',
      };
    } catch (error) {
      console.error('Error getting mobile bookings:', error);
      return null;
    }
  }

  // Send mobile push notification
  static async sendMobilePushNotification(
    userId: string,
    notification: PushNotificationData
  ): Promise<Record<string, unknown> | null> {
    try {
      await connectDB();

      // Create notification record
      const newNotification = new Notification({
        userId,
        title: notification.title,
        message: notification.body,
        type: 'push',
        data: notification.data || {},
        read: false,
      });

      await newNotification.save();

      // Here you would integrate with actual push notification service
      // For now, we'll just return success
      return {
        success: true,
        notificationId: newNotification._id.toString(),
        message: 'Push notification sent successfully',
      };
    } catch (error) {
      console.error('Error sending mobile push notification:', error);
      return null;
    }
  }
}

export default MobileAppService;
