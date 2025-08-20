#!/usr/bin/env node

import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

const dropIndexes = async () => {
  try {
    console.log('🗑️  Dropping existing indexes...')
    
    const db = mongoose.connection.db
    
    // Drop indexes from collections
    const collections = ['bookings', 'vendors', 'venues', 'users', 'reviews', 'tasks', 'payments', 'messages', 'notifications']
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName)
        await collection.dropIndexes()
        console.log(`✅ Dropped indexes from ${collectionName}`)
      } catch (error) {
        console.log(`ℹ️  No indexes to drop from ${collectionName}`)
      }
    }
    
    console.log('✅ All indexes dropped successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Failed to drop indexes:', error)
    process.exit(1)
  }
}

// Run the script
connectDB().then(() => dropIndexes()) 