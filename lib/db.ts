import mongoose from 'mongoose';
// Import all models to ensure they are registered
import './models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: ConnectionCache | undefined;
}

let cached: ConnectionCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 20, // Increased connection pool
      serverSelectionTimeoutMS: 3000, // Faster server selection
      socketTimeoutMS: 30000, // Reduced socket timeout
      family: 4, // Use IPv4 for faster connections
      // Performance optimizations
      autoIndex: false, // Disable auto-indexing for faster startup
      maxIdleTimeMS: 30000, // Keep connections alive longer
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    cached.conn = await cached.promise;
    
    // Enable query performance monitoring
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', false); // Disable debug in production
    }
    
    // Set global performance options
    mongoose.set('strictQuery', false);
    
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

// Add connection event listeners for better monitoring
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Performance monitoring
mongoose.connection.on('connected', () => {
  console.log('📊 MongoDB Performance Stats:');
  const pool = (mongoose.connection as any).pool;
  if (pool) {
    console.log(`   Pool Size: ${pool.size()}`);
    console.log(`   Available: ${pool.available()}`);
    console.log(`   Pending: ${pool.pending()}`);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// Export connection for direct access
export const getConnection = () => mongoose.connection;
