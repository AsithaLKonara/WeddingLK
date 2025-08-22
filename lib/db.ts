import mongoose from 'mongoose';
// Import all models to ensure they are registered
import './models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not found, using fallback connection string');
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  connecting: boolean;
}

declare global {
  var mongoose: ConnectionCache | undefined;
}

const cached: ConnectionCache = global.mongoose || { conn: null, promise: null, connecting: false };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  // If already connected, return the connection
  if (cached.conn) {
    return cached.conn;
  }

  // If already connecting, wait for the existing promise
  if (cached.connecting && cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      cached.connecting = false;
      throw error;
    }
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    // Use fallback URI for development if MONGODB_URI is not set
    const uri = MONGODB_URI || 'mongodb://mongodb:27017/weddinglk';
    
    const opts = {
      bufferCommands: true, // Changed from false to true to fix connection issues
      maxPoolSize: 20, // Increased for better performance
      minPoolSize: 5, // Maintain minimum connections
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 60000, // Increased socket timeout
      family: 4, // Use IPv4 for faster connections
      // Performance optimizations
      autoIndex: false, // Disable auto-indexing for faster startup
      maxIdleTimeMS: 60000, // Keep connections alive longer
      // Retry options
      retryWrites: true,
      retryReads: true,
      // Connection options
      connectTimeoutMS: 15000,
      heartbeatFrequencyMS: 10000,
      // Pool options
      maxConnecting: 5, // Limit concurrent connection attempts
    };

    // Attempting to connect to MongoDB;
    
    cached.connecting = true;
    cached.promise = mongoose.connect(uri, opts);
  }

  try {
    cached.conn = await cached.promise;
    cached.connecting = false;
    
    // Enable query performance monitoring
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', false); // Disable debug in production
    }
    
    // Set global performance options
    mongoose.set('strictQuery', false);
    
    // MongoDB connected successfully
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.connecting = false;
    console.error('❌ MongoDB connection failed:', e);
    
    // For development, try to continue without database
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Continuing in development mode without database connection');
      return null;
    }
    
    throw e;
  }
}

// Add connection event listeners for better monitoring
mongoose.connection.on('connected', () => {
  // MongoDB connected successfully
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  // MongoDB disconnected
});

// Performance monitoring
mongoose.connection.on('connected', () => {
  // MongoDB Performance Stats logged in development only
  if (process.env.NODE_ENV === 'development') {
    const pool = (mongoose.connection as any).pool;
    if (pool) {
      console.log(`📊 MongoDB Performance Stats:`);
      console.log(`   Pool Size: ${pool.size()}`);
      console.log(`   Available: ${pool.available()}`);
      console.log(`   Pending: ${pool.pending()}`);
    }
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  // MongoDB connection closed through app termination
  process.exit(0);
});

// Export connection for direct access
export const getConnection = () => mongoose.connection;
