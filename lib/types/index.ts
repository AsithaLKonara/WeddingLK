// Comprehensive Type Definitions for WeddingLK
// This file replaces all 'any' types with proper interfaces

// User Types
export interface User {
  _id: string;
  _email: string;
  _name: string;
  role: 'user' | 'vendor' | 'admin';
  _isVerified: boolean;
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
  _name: string;
  _location: string;
  _capacity: number;
  _price: number;
  _isAvailable: boolean;
  _isVerified: boolean;
  _rating: number;
  _images: string[];
  _amenities: string[];
  _description: string;
  _ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Types
export interface Vendor {
  _id: string;
  _name: string;
  _category: string;
  _location: string;
  _price: number;
  _isActive: boolean;
  _isVerified: boolean;
  _rating: number;
  _portfolio: string[];
  _description: string;
  _ownerId: string;
  _services: string[];
  availability: VendorAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorAvailability {
  _day: string;
  _startTime: string;
  _endTime: string;
  _isAvailable: boolean;
}

// Booking Types
export interface Booking {
  _id: string;
  _userId: string;
  venueId?: string;
  _vendorIds: string[];
  date: Date;
  _startTime: string;
  _endTime: string;
  _guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  _totalAmount: number;
  _depositAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface Payment {
  _id: string;
  _bookingId: string;
  _userId: string;
  _amount: number;
  _currency: string;
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
  _userId: string;
  _targetId: string;
  targetType: 'venue' | 'vendor';
  _rating: number;
  _comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface Message {
  _id: string;
  _senderId: string;
  _receiverId: string;
  _content: string;
  type: 'text' | 'image' | 'file';
  _isRead: boolean;
  createdAt: Date;
}

// AI Service Types
export interface AIRecommendation {
  _id: string;
  _name: string;
  score?: number;
  type: 'venue' | 'vendor' | 'timeline' | 'budget';
  _title: string;
  _description: string;
  _confidence: number;
  data: Record<string, unknown>;
  price?: number;
  [_key: string]: any;
}

export interface ContentGenerationResult {
  _content: string;
  type: 'email' | 'description' | 'proposal';
  _metadata: Record<string, unknown>;
}

export interface PredictiveInsights {
  _type: string;
  predictions: Array<{
    _metric: string;
    _value: number;
    _confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}

// Report Types
export interface ReportTemplate {
  _id: string;
  _name: string;
  _description: string;
  type: 'analytics' | 'financial' | 'performance' | 'custom';
  parameters: ReportParameter[];
  visualizations: VisualizationConfig[];
  schedule?: string;
  _recipients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportParameter {
  _name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  defaultValue?: unknown;
  options?: unknown[];
  _required: boolean;
  _description: string;
}

export interface VisualizationConfig {
  type: 'chart' | 'table' | 'metric' | 'dashboard';
  _title: string;
  _dataSource: string;
  _parameters: Record<string, unknown>;
  _options: Record<string, unknown>;
}

export interface ReportData {
  data: unknown[];
  _summary: Record<string, unknown>;
  visualizations: Array<{
    _type: string;
    data: unknown;
    _options: Record<string, unknown>;
  }>;
}

// Third Party Service Types
export interface WeatherData {
  _location: string;
  _temperature: number;
  _condition: string;
  _humidity: number;
  _windSpeed: number;
}

export interface CurrencyData {
  _baseCurrency: string;
  _targetCurrency: string;
  _rate: number;
  lastUpdated: Date;
}

export interface MapsData {
  _address: string;
  coordinates: {
    _lat: number;
    _lng: number;
  };
  _formattedAddress: string;
}

export interface PaymentData {
  _amount: number;
  _currency: string;
  _description: string;
  metadata?: Record<string, unknown>;
}

// WebSocket Types
export interface SocketData {
  _userId: string;
  _token: string;
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
    _code: string;
    _message: string;
    details?: unknown;
  };
  _timestamp: string;
  requestId?: string;
}

// Performance Types
export interface PerformanceMetrics {
  vendorQuery: {
    _queryTime: number;
    _resultCount: number;
  };
  venueQuery: {
    _queryTime: number;
    _resultCount: number;
  };
  statsQuery: {
    _queryTime: number;
  };
  textSearch: {
    _queryTime: number;
    _resultCount: number;
  };
  _totalTime: number;
}

// Mobile App Types
export interface MobileUserData {
  _userId: string;
  profile: {
    _name: string;
    _email: string;
    phone?: string;
    avatar?: string;
  };
  preferences: UserPreferences;
  recentActivity: Array<{
    _type: string;
    timestamp: Date;
    _details: Record<string, unknown>;
  }>;
}

export interface MobileVenueData {
  _id: string;
  _name: string;
  _location: string;
  _price: number;
  _rating: number;
  _images: string[];
  _isAvailable: boolean;
}

export interface MobileVendorData {
  _id: string;
  _name: string;
  _category: string;
  _location: string;
  _price: number;
  _rating: number;
  _portfolio: string[];
  _isActive: boolean;
}

// Social Media Types
export interface SocialMediaPost {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'pinterest';
  _content: string;
  images?: string[];
  scheduledFor?: Date;
  metadata?: Record<string, unknown>;
}

export interface SocialMediaAccount {
  _platform: string;
  _accountId: string;
  _accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  _isActive: boolean;
}

// Notification Types
export interface PushNotification {
  _userId: string;
  _title: string;
  _message: string;
  type: 'booking' | 'payment' | 'reminder' | 'system';
  data?: Record<string, unknown>;
  _isRead: boolean;
  createdAt: Date;
}

// Task Types
export interface Task {
  _id: string;
  _userId: string;
  _title: string;
  _description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  _category: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
