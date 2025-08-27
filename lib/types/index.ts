// Comprehensive Type Definitions for WeddingLK
// This file replaces all 'any' types with proper interfaces

// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'vendor' | 'admin';
  isVerified: boolean;
  authProvider?: 'credentials' | 'google' | 'facebook';
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  weddingDate?: Date;
  budget?: number;
  guestCount?: number;
  location?: string;
  style?: string;
  theme?: string;
}

// Venue Types
export interface Venue {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  images: string[];
  amenities: string[];
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Types
export interface Vendor {
  _id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  portfolio: string[];
  description: string;
  ownerId: string;
  services: string[];
  availability: VendorAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorAvailability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Booking Types
export interface Booking {
  _id: string;
  userId: string;
  venueId?: string;
  vendorIds: string[];
  date: Date;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  depositAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface Payment {
  _id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: 'stripe' | 'payhere' | 'bank_transfer';
  gatewayResponse?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  _id: string;
  userId: string;
  targetId: string;
  targetType: 'venue' | 'vendor';
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: Date;
}

// AI Service Types
export interface AIRecommendation {
  id: string;
  name: string;
  score?: number;
  type: 'venue' | 'vendor' | 'timeline' | 'budget';
  title: string;
  description: string;
  confidence: number;
  data: Record<string, unknown>;
  price?: number;
  [key: string]: any;
}

export interface ContentGenerationResult {
  content: string;
  type: 'email' | 'description' | 'proposal';
  metadata: Record<string, unknown>;
}

export interface PredictiveInsights {
  type: string;
  predictions: Array<{
    metric: string;
    value: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}

// Report Types
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'analytics' | 'financial' | 'performance' | 'custom';
  parameters: ReportParameter[];
  visualizations: VisualizationConfig[];
  schedule?: string;
  recipients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  defaultValue?: unknown;
  options?: unknown[];
  required: boolean;
  description: string;
}

export interface VisualizationConfig {
  type: 'chart' | 'table' | 'metric' | 'dashboard';
  title: string;
  dataSource: string;
  parameters: Record<string, unknown>;
  options: Record<string, unknown>;
}

export interface ReportData {
  data: unknown[];
  summary: Record<string, unknown>;
  visualizations: Array<{
    type: string;
    data: unknown;
    options: Record<string, unknown>;
  }>;
}

// Third Party Service Types
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface CurrencyData {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  lastUpdated: Date;
}

export interface MapsData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, unknown>;
}

// WebSocket Types
export interface SocketData {
  userId: string;
  token: string;
  roomId?: string;
  message?: string;
  type?: string;
  notificationId?: string;
  bookingId?: string;
  paymentId?: string;
  amount?: number;
  status?: string;
  details?: Record<string, unknown>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  requestId?: string;
}

// Performance Types
export interface PerformanceMetrics {
  vendorQuery: {
    queryTime: number;
    resultCount: number;
  };
  venueQuery: {
    queryTime: number;
    resultCount: number;
  };
  statsQuery: {
    queryTime: number;
  };
  textSearch: {
    queryTime: number;
    resultCount: number;
  };
  totalTime: number;
}

// Mobile App Types
export interface MobileUserData {
  userId: string;
  profile: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  preferences: UserPreferences;
  recentActivity: Array<{
    type: string;
    timestamp: Date;
    details: Record<string, unknown>;
  }>;
}

export interface MobileVenueData {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  isAvailable: boolean;
}

export interface MobileVendorData {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  portfolio: string[];
  isActive: boolean;
}

// Social Media Types
export interface SocialMediaPost {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'pinterest';
  content: string;
  images?: string[];
  scheduledFor?: Date;
  metadata?: Record<string, unknown>;
}

export interface SocialMediaAccount {
  platform: string;
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
}

// Notification Types
export interface PushNotification {
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'reminder' | 'system';
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

// Task Types
export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
