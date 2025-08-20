import mongoose from 'mongoose';

// Production database configuration
const MONGODB_URI = process.env.MONGODB_URI!;
const MAX_POOL_SIZE = parseInt(process.env.MAX_POOL_SIZE || '50');
const MIN_POOL_SIZE = parseInt(process.env.MIN_POOL_SIZE || '10');

// Connection cache interface
interface ConnectionCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Global connection cache
declare global {
  var mongoose: ConnectionCache | undefined;
}

// Connection cache
const cached: ConnectionCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Production database connection with optimizations
export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: MAX_POOL_SIZE,
      minPoolSize: MIN_POOL_SIZE,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
      readPreference: 'secondaryPreferred',
      // Performance optimizations
      compressors: ['zlib'],
      zlibCompressionLevel: 6,
      // Connection monitoring
      monitorCommands: process.env.NODE_ENV === 'production',
    };

    console.log('🚀 Connecting to MongoDB with production optimizations...');
    console.log(`📊 Pool Size: ${MIN_POOL_SIZE}-${MAX_POOL_SIZE}`);
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    const connection = await cached.promise;
    cached.conn = connection;
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Connection ready state: ${mongoose.connection.readyState}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Monitor connection status
    setInterval(async () => {
      if (mongoose.connection.readyState === 1) {
        console.log(`📊 MongoDB Status: Connected (readyState: ${mongoose.connection.readyState})`);
        
        // Log slow queries if enabled
        if (process.env.ENABLE_SLOW_QUERY_LOGGING === 'true') {
          try {
            const slowQueries = await mongoose.connection.db?.admin().command({ getLog: 'global' });
            if (slowQueries && slowQueries.log && slowQueries.log.length > 0) {
              console.log('🐌 Slow queries detected:', slowQueries.log.slice(-5));
            }
          } catch (error) {
            // Ignore errors in monitoring
          }
        }
      }
    }, 60000); // Check every minute

    return connection;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', e);
    throw e;
  }
}

// Graceful shutdown
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    console.log('👋 MongoDB disconnected gracefully');
  }
}

// Health check
export async function checkDBHealth(): Promise<{ status: string; responseTime: number; error?: string }> {
  try {
    if (mongoose.connection.readyState === 1) {
      const start = Date.now();
      await mongoose.connection.db?.admin().ping();
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime
      };
    } else {
      return {
        status: 'unhealthy',
        responseTime: 0,
        error: 'Database not connected'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      responseTime: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Performance monitoring
export function getDBStats(): any {
  if (mongoose.connection.readyState === 1) {
    return {
      connections: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      },
      status: 'connected'
    };
  }
  return {
    status: 'disconnected',
    readyState: mongoose.connection.readyState
  };
}

// Export for use in other modules
export default connectDB; 