import mongoose from 'mongoose'

// Database connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk'

// Connection options
const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0,
}

// Global variable to track connection status
let isConnected = false

// Database connection function
export async function connectToDatabase() {
  if (isConnected) {
    console.log('✅ Using existing database connection')
    return
  }

  try {
    console.log('🔄 Connecting to MongoDB...')
    
    await mongoose.connect(MONGODB_URI, connectionOptions)
    
    isConnected = true
    console.log('✅ Successfully connected to MongoDB')
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error)
      isConnected = false
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected')
      isConnected = false
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
      isConnected = true
    })
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    throw error
  }
}

// Disconnect function
export async function disconnectFromDatabase() {
  if (!isConnected) {
    return
  }
  
  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error)
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    if (!isConnected) {
      return { status: 'disconnected', message: 'Database not connected' }
    }
    
    // Ping the database with proper null checking
    const db = mongoose.connection.db
    if (!db) {
      return { status: 'error', message: 'Database instance not available' }
    }
    
    await db.admin().ping()
    
    return { 
      status: 'healthy', 
      message: 'Database connection is healthy',
      collections: Object.keys(mongoose.connection.collections)
    }
  } catch (error) {
    return { 
      status: 'error', 
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get connection status
export function getConnectionStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  }
}

// Export mongoose instance for direct access
export { mongoose } 