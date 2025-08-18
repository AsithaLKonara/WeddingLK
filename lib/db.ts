import mongoose from "mongoose"
// Import all models to ensure they are registered
import "./models"

const MONGODB_URI = process.env.MONGODB_URI as string

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // Skip connection during build time
  if (process.env.NODE_ENV === 'production' && !MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
  }

  // For development, return a mock connection if no URI
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not set, using mock connection for development")
    return { connection: { readyState: 1 } }
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
