#!/usr/bin/env node

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk'

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+94 71 123 4567'
  },
  {
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: 'admin123',
    role: 'admin',
    phone: '+94 71 345 6789'
  },
  {
    name: 'Vendor Owner',
    email: 'vendor@example.com',
    password: 'vendor123',
    role: 'vendor',
    phone: '+94 71 456 7890'
  }
]

const sampleVendors = [
  {
    businessName: 'Perfect Moments Photography',
    name: 'Sarah Johnson',
    category: 'photography',
    description: 'Professional wedding photography capturing your special moments.',
    location: {
      city: 'Colombo',
      province: 'Western Province'
    },
    contact: {
      phone: '+94 71 111 1111',
      email: 'sarah@perfectmoments.com'
    },
    isVerified: true,
    isActive: true,
    featured: true
  }
]

const sampleVenues = [
  {
    name: 'Grand Ballroom Hotel',
    description: 'Luxurious hotel ballroom perfect for elegant weddings.',
    location: {
      city: 'Colombo',
      province: 'Western Province'
    },
    capacity: { min: 100, max: 500 },
    pricing: {
      basePrice: 150000,
      perPerson: 2500,
      minimumGuests: 100
    },
    isActive: true,
    isVerified: true,
    featured: true
  }
]

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Seed users
async function seedUsers() {
  try {
    const User = mongoose.model('User')
    
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email })
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        const user = new User({
          ...userData,
          password: hashedPassword
        })
        await user.save()
        console.log(`Created user: ${userData.email}`)
      } else {
        console.log(`User already exists: ${userData.email}`)
      }
    }
    
    console.log('Users seeding completed')
  } catch (error) {
    console.error('Error seeding users:', error)
  }
}

// Seed vendors
async function seedVendors() {
  try {
    const Vendor = mongoose.model('Vendor')
    const User = mongoose.model('User')
    
    for (const vendorData of sampleVendors) {
      const existingVendor = await Vendor.findOne({ businessName: vendorData.businessName })
      if (!existingVendor) {
        const owner = await User.findOne({ role: 'vendor' })
        if (owner) {
          const vendor = new Vendor({
            ...vendorData,
            owner: owner._id
          })
          await vendor.save()
          console.log(`Created vendor: ${vendorData.businessName}`)
        }
      } else {
        console.log(`Vendor already exists: ${vendorData.businessName}`)
      }
    }
    
    console.log('Vendors seeding completed')
  } catch (error) {
    console.error('Error seeding vendors:', error)
  }
}

// Seed venues
async function seedVenues() {
  try {
    const Venue = mongoose.model('Venue')
    const User = mongoose.model('User')
    
    for (const venueData of sampleVenues) {
      const existingVenue = await Venue.findOne({ name: venueData.name })
      if (!existingVenue) {
        const owner = await User.findOne({ role: 'admin' })
        if (owner) {
          const venue = new Venue({
            ...venueData,
            owner: owner._id
          })
          await venue.save()
          console.log(`Created venue: ${venueData.name}`)
        }
      } else {
        console.log(`Venue already exists: ${venueData.name}`)
      }
    }
    
    console.log('Venues seeding completed')
  } catch (error) {
    console.error('Error seeding venues:', error)
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB()
    
    console.log('Starting simple database seeding...')
    
    await seedUsers()
    await seedVendors()
    await seedVenues()
    
    console.log('Simple database seeding completed successfully!')
    
    // Close connection
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
    
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
}

export default seedDatabase 