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

// Connect to database
export async function connectToDatabase() {
  if (isConnected) {
    console.log('Database already connected')
    return
  }

  try {
    await mongoose.connect(MONGODB_URI, connectionOptions)
    isConnected = true
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Disconnect from database
export async function disconnectFromDatabase() {
  if (!isConnected) {
    console.log('Database not connected')
    return
  }

  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('✅ Database disconnected successfully')
  } catch (error) {
    console.error('❌ Database disconnection failed:', error)
    throw error
  }
}

// Check database health
export async function checkDatabaseHealth() {
  try {
    if (!isConnected) {
      return { status: 'error', message: 'Database not connected' }
    }

    // Ping the database with proper null checking
    const db = mongoose.connection.db
    if (!db) {
      return { status: 'error', message: 'Database instance not available' }
    }
    await db.admin().ping()
    
    return { status: 'healthy', message: 'Database is healthy' }
  } catch (error) {
    return { status: 'error', message: `Database health check failed: ${error}` }
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

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB')
  isConnected = true
})

mongoose.connection.on('error', (error) => {
  console.error('❌ Mongoose connection error:', error)
  isConnected = false
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB')
  isConnected = false
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectFromDatabase()
  process.exit(0)
})

export default mongoose 