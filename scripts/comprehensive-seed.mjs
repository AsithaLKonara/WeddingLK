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
    phone: '+94 71 123 4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    phone: '+94 71 234 5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
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
    description: 'Professional wedding photography capturing your special moments with artistic flair and attention to detail.',
    location: {
      city: 'Colombo',
      province: 'Western Province',
      coordinates: [79.8612, 6.9271]
    },
    contact: {
      phone: '+94 71 111 1111',
      email: 'sarah@perfectmoments.com',
      website: 'https://perfectmoments.com'
    },
    services: ['Wedding Photography', 'Engagement Shoots', 'Wedding Albums'],
    pricing: {
      basePrice: 50000,
      currency: 'LKR',
      packages: [
        { name: 'Basic', price: 50000, description: '6 hours coverage, 200 edited photos' },
        { name: 'Premium', price: 80000, description: 'Full day coverage, 400 edited photos, album' }
      ]
    },
    rating: { average: 4.8, count: 25 },
    isVerified: true,
    isActive: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop'
    ]
  },
  {
    businessName: 'Elegant Catering Services',
    name: 'Michael Chen',
    category: 'catering',
    description: 'Premium wedding catering with customizable menus featuring local and international cuisine.',
    location: {
      city: 'Kandy',
      province: 'Central Province',
      coordinates: [80.6333, 7.2955]
    },
    contact: {
      phone: '+94 71 222 2222',
      email: 'michael@elegantcatering.com',
      website: 'https://elegantcatering.com'
    },
    services: ['Wedding Catering', 'Menu Planning', 'Food Styling'],
    pricing: {
      basePrice: 2500,
      currency: 'LKR',
      packages: [
        { name: 'Standard', price: 2500, description: 'Per person, 3-course meal' },
        { name: 'Premium', price: 4000, description: 'Per person, 5-course meal, wine service' }
      ]
    },
    rating: { average: 4.6, count: 18 },
    isVerified: true,
    isActive: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    ]
  },
  {
    businessName: 'Dream Decorations',
    name: 'Lisa Rodriguez',
    category: 'decoration',
    description: 'Creative wedding decorations and floral arrangements to transform any venue into a magical setting.',
    location: {
      city: 'Galle',
      province: 'Southern Province',
      coordinates: [80.2175, 6.0535]
    },
    contact: {
      phone: '+94 71 333 3333',
      email: 'lisa@dreamdecorations.com',
      website: 'https://dreamdecorations.com'
    },
    services: ['Wedding Decorations', 'Floral Arrangements', 'Venue Styling'],
    pricing: {
      basePrice: 75000,
      currency: 'LKR',
      packages: [
        { name: 'Basic', price: 75000, description: 'Ceremony and reception decorations' },
        { name: 'Luxury', price: 150000, description: 'Full venue transformation with premium flowers' }
      ]
    },
    rating: { average: 4.9, count: 32 },
    isVerified: true,
    isActive: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop'
    ]
  }
]

const sampleVenues = [
  {
    name: 'Grand Ballroom Hotel',
    description: 'Luxurious hotel ballroom perfect for elegant weddings with modern amenities and professional service.',
    location: {
      city: 'Colombo',
      province: 'Western Province',
      coordinates: [79.8612, 6.9271],
      address: '123 Marine Drive, Colombo 01'
    },
    capacity: { min: 100, max: 500 },
    pricing: {
      basePrice: 150000,
      currency: 'LKR',
      perPerson: 2500,
      minimumGuests: 100
    },
    amenities: ['Parking', 'Catering', 'Audio/Visual', 'Bridal Suite', 'Garden Area'],
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop'
    ],
    rating: { average: 4.7, count: 45 },
    isActive: true,
    isVerified: true,
    featured: true
  },
  {
    name: 'Garden Palace Resort',
    description: 'Beautiful garden resort with outdoor ceremony spaces and stunning natural surroundings.',
    location: {
      city: 'Kandy',
      province: 'Central Province',
      coordinates: [80.6333, 7.2955],
      address: '456 Peradeniya Road, Kandy'
    },
    capacity: { min: 50, max: 200 },
    pricing: {
      basePrice: 100000,
      currency: 'LKR',
      perPerson: 2000,
      minimumGuests: 50
    },
    amenities: ['Garden Ceremony', 'Outdoor Reception', 'Accommodation', 'Catering', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    ],
    rating: { average: 4.5, count: 28 },
    isActive: true,
    isVerified: true,
    featured: true
  }
]

const sampleReviews = [
  {
    content: 'Amazing photography service! Sarah captured our special day perfectly. Highly recommended!',
    rating: 5,
    user: null, // Will be populated with actual user ID
    vendor: null, // Will be populated with actual vendor ID
    venue: null,
    isVerified: true,
    isActive: true
  },
  {
    content: 'Excellent catering service with delicious food and professional staff.',
    rating: 5,
    user: null,
    vendor: null,
    venue: null,
    isVerified: true,
    isActive: true
  },
  {
    content: 'Beautiful venue with stunning views and excellent service.',
    rating: 4,
    user: null,
    vendor: null,
    venue: null,
    isVerified: true,
    isActive: true
  }
]

const sampleTasks = [
  {
    title: 'Book photographer',
    description: 'Research and book wedding photographer',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'pending',
    priority: 'high',
    category: 'vendors',
    estimatedHours: 2
  },
  {
    title: 'Choose wedding venue',
    description: 'Visit and select wedding venue',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    status: 'pending',
    priority: 'high',
    category: 'venue',
    estimatedHours: 4
  },
  {
    title: 'Order wedding dress',
    description: 'Select and order wedding dress',
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: 'pending',
    priority: 'medium',
    category: 'attire',
    estimatedHours: 3
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
        // Find vendor owner user
        const owner = await User.findOne({ email: vendorData.name.toLowerCase().replace(' ', '') + '@example.com' })
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
        // Find venue owner user
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

// Seed reviews
async function seedReviews() {
  try {
    const Review = mongoose.model('Review')
    const User = mongoose.model('User')
    const Vendor = mongoose.model('Vendor')
    const Venue = mongoose.model('Venue')
    
    const users = await User.find({ role: 'user' })
    const vendors = await Vendor.find()
    const venues = await Venue.find()
    
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = sampleReviews[i]
      const user = users[i % users.length]
      const vendor = vendors[i % vendors.length]
      const venue = venues[i % venues.length]
      
      if (user && (vendor || venue)) {
        const review = new Review({
          ...reviewData,
          user: user._id,
          vendor: vendor?._id,
          venue: venue?._id
        })
        await review.save()
        console.log(`Created review for ${vendor ? vendor.businessName : venue?.name}`)
      }
    }
    
    console.log('Reviews seeding completed')
  } catch (error) {
    console.error('Error seeding reviews:', error)
  }
}

// Seed tasks
async function seedTasks() {
  try {
    const Task = mongoose.model('Task')
    const User = mongoose.model('User')
    
    const users = await User.find({ role: 'user' })
    
    for (const taskData of sampleTasks) {
      const user = users[0] // Assign to first user
      if (user) {
        const task = new Task({
          ...taskData,
          user: user._id
        })
        await task.save()
        console.log(`Created task: ${taskData.title}`)
      }
    }
    
    console.log('Tasks seeding completed')
  } catch (error) {
    console.error('Error seeding tasks:', error)
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB()
    
    console.log('Starting database seeding...')
    
    await seedUsers()
    await seedVendors()
    await seedVenues()
    await seedReviews()
    await seedTasks()
    
    console.log('Database seeding completed successfully!')
    
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