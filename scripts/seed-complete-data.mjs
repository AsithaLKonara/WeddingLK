#!/usr/bin/env node

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Import models
import { User } from '../lib/models/user.ts'
import { Vendor } from '../lib/models/vendor.ts'
import { Venue } from '../lib/models/venue.ts'
import { Review } from '../lib/models/review.ts'
import { Payment } from '../lib/models/payment.ts'
import { Task } from '../lib/models/task.ts'
import { Message } from '../lib/models/message.ts'
import { Notification } from '../lib/models/notification.ts'
import { Booking } from '../lib/models/booking.ts'
import { Service } from '../lib/models/service.ts'

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

// Seed data
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({}),
      Task.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Booking.deleteMany({}),
      Service.deleteMany({})
    ])

    console.log('✅ Existing data cleared')

    // Create admin user
    console.log('👑 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@weddinglk.com',
      phone: '+94 11 123 4567',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      subscription: {
        plan: 'premium',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    })

    // Create vendor users
    console.log('🏢 Creating vendor users...')
    const vendorUsers = await Promise.all([
      User.create({
        name: 'John Vendor',
        email: 'john@perfectphoto.com',
        phone: '+94 11 234 5678',
        password: await bcrypt.hash('vendor123', 12),
        role: 'vendor',
        isVerified: true,
        isActive: true
      }),
      User.create({
        name: 'Sarah Designer',
        email: 'sarah@elegantdesigns.com',
        phone: '+94 11 345 6789',
        password: await bcrypt.hash('vendor123', 12),
        role: 'vendor',
        isVerified: true,
        isActive: true
      }),
      User.create({
        name: 'Mike Caterer',
        email: 'mike@tastefulcatering.com',
        phone: '+94 11 456 7890',
        password: await bcrypt.hash('vendor123', 12),
        role: 'vendor',
        isVerified: true,
        isActive: true
      })
    ])

    // Create regular users
    console.log('👥 Creating regular users...')
    const regularUsers = await Promise.all([
      User.create({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+94 11 567 8901',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        isVerified: true,
        isActive: true,
        weddingDate: new Date('2024-12-15')
      }),
      User.create({
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+94 11 678 9012',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        isVerified: true,
        isActive: true,
        weddingDate: new Date('2024-11-20')
      }),
      User.create({
        name: 'Carol Davis',
        email: 'carol@example.com',
        phone: '+94 11 789 0123',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        isVerified: true,
        isActive: true,
        weddingDate: new Date('2025-01-10')
      })
    ])

    // Create vendors
    console.log('🏪 Creating vendors...')
    const vendors = await Promise.all([
      Vendor.create({
        name: 'John Vendor',
        businessName: 'Perfect Photography',
        category: 'photographer',
        description: 'Professional wedding photography services with over 10 years of experience',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western',
          coordinates: [79.8612, 6.9271]
        },
        contact: {
          phone: '+94 11 123 4567',
          email: 'john@perfectphoto.com'
        },
        rating: { average: 4.8, count: 25 },
        owner: vendorUsers[0]._id,
        isVerified: true,
        isActive: true,
        featured: true,
        businessHours: {
          start: '09:00',
          end: '18:00'
        }
      }),
      Vendor.create({
        name: 'Sarah Designer',
        businessName: 'Elegant Designs',
        category: 'decorator',
        description: 'Creative wedding decoration and floral arrangements',
        location: {
          address: '456 Oak Ave',
          city: 'Kandy',
          province: 'Central',
          coordinates: [80.6337, 7.2906]
        },
        contact: {
          phone: '+94 11 345 6789',
          email: 'sarah@elegantdesigns.com'
        },
        rating: { average: 4.6, count: 18 },
        owner: vendorUsers[1]._id,
        isVerified: true,
        isActive: true,
        featured: true,
        businessHours: {
          start: '08:00',
          end: '17:00'
        }
      }),
      Vendor.create({
        name: 'Mike Caterer',
        businessName: 'Tasteful Catering',
        category: 'caterer',
        description: 'Exquisite wedding catering with customizable menus',
        location: {
          address: '789 Pine St',
          city: 'Galle',
          province: 'Southern',
          coordinates: [80.2176, 6.0535]
        },
        contact: {
          phone: '+94 11 456 7890',
          email: 'mike@tastefulcatering.com'
        },
        rating: { average: 4.9, count: 32 },
        owner: vendorUsers[2]._id,
        isVerified: true,
        isActive: true,
        featured: true,
        businessHours: {
          start: '07:00',
          end: '19:00'
        }
      })
    ])

    // Create venues
    console.log('🏰 Creating venues...')
    const venues = await Promise.all([
      Venue.create({
        name: 'Grand Ballroom',
        description: 'Elegant ballroom perfect for large wedding receptions',
        location: {
          address: '100 Luxury Lane',
          city: 'Colombo',
          province: 'Western',
          coordinates: [79.8612, 6.9271]
        },
        capacity: { min: 100, max: 500 },
        pricing: {
          basePrice: 50000,
          perPerson: 2500,
          minimumGuests: 100
        },
        amenities: ['parking', 'catering', 'decorations', 'music', 'photography'],
        owner: adminUser._id,
        isActive: true,
        featured: true,
        businessHours: {
          start: '08:00',
          end: '23:00'
        }
      }),
      Venue.create({
        name: 'Garden Paradise',
        description: 'Beautiful outdoor garden venue for intimate weddings',
        location: {
          address: '200 Nature Way',
          city: 'Kandy',
          province: 'Central',
          coordinates: [80.6337, 7.2906]
        },
        capacity: { min: 50, max: 200 },
        pricing: {
          basePrice: 30000,
          perPerson: 2000,
          minimumGuests: 50
        },
        amenities: ['parking', 'garden', 'decorations', 'outdoor-ceremony'],
        owner: adminUser._id,
        isActive: true,
        featured: true,
        businessHours: {
          start: '06:00',
          end: '22:00'
        }
      })
    ])

    // Create services
    console.log('🛠️  Creating services...')
    const services = await Promise.all([
      Service.create({
        vendor: vendors[0]._id,
        name: 'Wedding Photography Package',
        description: 'Complete wedding photography coverage including engagement shoot',
        category: 'photography',
        subcategory: 'wedding',
        price: 75000,
        pricingType: 'fixed',
        duration: '8 hours',
        capacity: { min: 1, max: 1 },
        isAvailable: true,
        isFeatured: true,
        features: ['Engagement shoot', 'Full day coverage', 'Edited photos', 'Online gallery'],
        requirements: ['Advance booking required', '50% deposit']
      }),
      Service.create({
        vendor: vendors[1]._id,
        name: 'Wedding Decoration',
        description: 'Complete wedding decoration and floral arrangements',
        category: 'decoration',
        subcategory: 'wedding',
        price: 45000,
        pricingType: 'fixed',
        duration: '6 hours',
        capacity: { min: 50, max: 500 },
        isAvailable: true,
        isFeatured: true,
        features: ['Flowers', 'Lighting', 'Table settings', 'Ceremony arch'],
        requirements: ['Site visit required', '30% deposit']
      }),
      Service.create({
        vendor: vendors[2]._id,
        name: 'Wedding Catering',
        description: 'Premium wedding catering with customizable menu',
        category: 'catering',
        subcategory: 'wedding',
        price: 3500,
        pricingType: 'per-person',
        duration: '4 hours',
        capacity: { min: 50, max: 300 },
        isAvailable: true,
        isFeatured: true,
        features: ['Custom menu', 'Staff included', 'Setup and cleanup', 'Dietary options'],
        requirements: ['Menu tasting required', '25% deposit']
      })
    ])

    // Create reviews
    console.log('⭐ Creating reviews...')
    const reviews = await Promise.all([
      Review.create({
        user: regularUsers[0]._id,
        vendor: vendors[0]._id,
        rating: 5,
        comment: 'Amazing photography! John captured every special moment perfectly.',
        isVerified: true,
        isActive: true
      }),
      Review.create({
        user: regularUsers[1]._id,
        vendor: vendors[1]._id,
        rating: 4,
        comment: 'Beautiful decorations that made our wedding magical.',
        isVerified: true,
        isActive: true
      }),
      Review.create({
        user: regularUsers[2]._id,
        vendor: vendors[2]._id,
        rating: 5,
        comment: 'Delicious food and excellent service. Highly recommended!',
        isVerified: true,
        isActive: true
      }),
      Review.create({
        user: regularUsers[0]._id,
        venue: venues[0]._id,
        rating: 4,
        comment: 'Stunning venue with great staff. Perfect for our reception.',
        isVerified: true,
        isActive: true
      })
    ])

    // Create tasks
    console.log('📋 Creating tasks...')
    const tasks = await Promise.all([
      Task.create({
        user: regularUsers[0]._id,
        title: 'Book photographer',
        description: 'Research and book wedding photographer',
        dueDate: new Date('2024-10-15'),
        status: 'completed',
        priority: 'high',
        category: 'vendors'
      }),
      Task.create({
        user: regularUsers[0]._id,
        title: 'Choose wedding dress',
        description: 'Schedule dress fittings and make final selection',
        dueDate: new Date('2024-11-01'),
        status: 'in-progress',
        priority: 'high',
        category: 'attire'
      }),
      Task.create({
        user: regularUsers[1]._id,
        title: 'Book venue',
        description: 'Visit and book wedding venue',
        dueDate: new Date('2024-09-30'),
        status: 'pending',
        priority: 'urgent',
        category: 'venue'
      })
    ])

    // Create bookings
    console.log('📅 Creating bookings...')
    const bookings = await Promise.all([
      Booking.create({
        user: regularUsers[0]._id,
        vendor: vendors[0]._id,
        service: services[0]._id,
        date: new Date('2024-12-15'),
        startTime: '08:00',
        endTime: '16:00',
        guests: 150,
        status: 'confirmed',
        totalAmount: 75000,
        depositAmount: 37500,
        depositPaid: true,
        contactInfo: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+94 11 567 8901'
        }
      }),
      Booking.create({
        user: regularUsers[1]._id,
        venue: venues[0]._id,
        date: new Date('2024-11-20'),
        startTime: '18:00',
        endTime: '23:00',
        guests: 200,
        status: 'confirmed',
        totalAmount: 550000,
        depositAmount: 165000,
        depositPaid: true,
        contactInfo: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+94 11 678 9012'
        }
      })
    ])

    // Create payments
    console.log('💰 Creating payments...')
    const payments = await Promise.all([
      Payment.create({
        user: regularUsers[0]._id,
        vendor: vendors[0]._id,
        booking: bookings[0]._id,
        amount: 37500,
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN_' + Date.now() + '_1',
        description: 'Deposit payment for wedding photography'
      }),
      Payment.create({
        user: regularUsers[1]._id,
        venue: venues[0]._id,
        booking: bookings[1]._id,
        amount: 165000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN_' + Date.now() + '_2',
        description: 'Deposit payment for venue booking'
      })
    ])

    // Create messages
    console.log('💬 Creating messages...')
    const conversationId1 = `${regularUsers[0]._id}-${vendors[0]._id}`
    const conversationId2 = `${regularUsers[1]._id}-${vendors[1]._id}`

    await Promise.all([
      Message.create({
        sender: regularUsers[0]._id,
        receiver: vendors[0]._id,
        content: 'Hi! I\'m interested in your wedding photography package. Are you available on December 15th?',
        conversationId: conversationId1,
        messageType: 'text'
      }),
      Message.create({
        sender: vendors[0]._id,
        receiver: regularUsers[0]._id,
        content: 'Hello! Yes, I\'m available on December 15th. Would you like to schedule a consultation?',
        conversationId: conversationId1,
        messageType: 'text'
      }),
      Message.create({
        sender: regularUsers[1]._id,
        receiver: vendors[1]._id,
        content: 'Hi Sarah! I love your decoration work. Can you help with our November 20th wedding?',
        conversationId: conversationId2,
        messageType: 'text'
      })
    ])

    // Create notifications
    console.log('🔔 Creating notifications...')
    await Promise.all([
      Notification.create({
        user: regularUsers[0]._id,
        title: 'Booking Confirmed',
        message: 'Your photography booking for December 15th has been confirmed!',
        type: 'success',
        actionUrl: '/dashboard/bookings'
      }),
      Notification.create({
        user: regularUsers[1]._id,
        title: 'Payment Received',
        message: 'Your venue deposit payment has been received successfully.',
        type: 'success',
        actionUrl: '/dashboard/payments'
      }),
      Notification.create({
        user: regularUsers[2]._id,
        title: 'Welcome to WeddingLK',
        message: 'Welcome to WeddingLK! Start planning your perfect wedding today.',
        type: 'info',
        actionUrl: '/dashboard'
      })
    ])

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📊 Seeded Data Summary:')
    console.log(`👥 Users: ${await User.countDocuments()}`)
    console.log(`🏢 Vendors: ${await Vendor.countDocuments()}`)
    console.log(`🏰 Venues: ${await Vendor.countDocuments()}`)
    console.log(`⭐ Reviews: ${await Review.countDocuments()}`)
    console.log(`📋 Tasks: ${await Task.countDocuments()}`)
    console.log(`📅 Bookings: ${await Booking.countDocuments()}`)
    console.log(`💰 Payments: ${await Payment.countDocuments()}`)
    console.log(`💬 Messages: ${await Message.countDocuments()}`)
    console.log(`🔔 Notifications: ${await Notification.countDocuments()}`)
    console.log(`🛠️  Services: ${await Service.countDocuments()}`)

    console.log('\n🔑 Test Accounts:')
    console.log('👑 Admin: admin@weddinglk.com / admin123')
    console.log('🏢 Vendor: john@perfectphoto.com / vendor123')
    console.log('👥 User: alice@example.com / user123')

    process.exit(0)

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeder
connectDB().then(() => seedDatabase()) 

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Import models
import { User } from '../lib/models/user.ts'
import { Vendor } from '../lib/models/vendor.ts'
import { Venue } from '../lib/models/venue.ts'
import { Review } from '../lib/models/review.ts'
import { Payment } from '../lib/models/payment.ts'
import { Task } from '../lib/models/task.ts'
import { Message } from '../lib/models/message.ts'
import { Notification } from '../lib/models/notification.ts'
import { Booking } from '../lib/models/booking.ts'
import { Service } from '../lib/models/service.ts'

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

// Seed data
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({}),
      Task.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Booking.deleteMany({}),
      Service.deleteMany({})
    ])

    console.log('✅ Existing data cleared')

    // Create admin user
    console.log('👑 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@weddinglk.com',
      phone: '+94 11 123 4567',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      subscription: {
        plan: 'premium',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    })

    // Create vendor users
    console.log('🏢 Creating vendor users...')
    const vendorUsers = await Promise.all([
      User.create({
        name: 'John Vendor',
        email: 'john@perfectphoto.com',
        phone: '+94 11 234 5678',
        password: await bcrypt.hash('vendor123', 12),
        role: 'vendor',
        isVerified: true,
        isActive: true
      }),
      User.create({
        name: 'Sarah Designer',
        email: 'sarah@elegantdesigns.com',
        phone: '+94 11 345 6789',
        password: await bcrypt.hash('vendor123', 12),
        role: 'vendor',
        isVerified: true,
        isActive: true
      }),
      User.create({
        name: 'Mike Caterer',
        email: 'mike@tastefulcatering.com',
        phone: '+94 11 456 7890',
        password: await bcrypt.hash('vendor123', 12),
        role: 'vendor',
        isVerified: true,
        isActive: true
      })
    ])

    // Create regular users
    console.log('👥 Creating regular users...')
    const regularUsers = await Promise.all([
      User.create({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+94 11 567 8901',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        isVerified: true,
        isActive: true,
        weddingDate: new Date('2024-12-15')
      }),
      User.create({
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+94 11 678 9012',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        isVerified: true,
        isActive: true,
        weddingDate: new Date('2024-11-20')
      }),
      User.create({
        name: 'Carol Davis',
        email: 'carol@example.com',
        phone: '+94 11 789 0123',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        isVerified: true,
        isActive: true,
        weddingDate: new Date('2025-01-10')
      })
    ])

    // Create vendors
    console.log('🏪 Creating vendors...')
    const vendors = await Promise.all([
      Vendor.create({
        name: 'John Vendor',
        businessName: 'Perfect Photography',
        category: 'photographer',
        description: 'Professional wedding photography services with over 10 years of experience',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western',
          coordinates: [79.8612, 6.9271]
        },
        contact: {
          phone: '+94 11 123 4567',
          email: 'john@perfectphoto.com'
        },
        rating: { average: 4.8, count: 25 },
        owner: vendorUsers[0]._id,
        isVerified: true,
        isActive: true,
        featured: true,
        businessHours: {
          start: '09:00',
          end: '18:00'
        }
      }),
      Vendor.create({
        name: 'Sarah Designer',
        businessName: 'Elegant Designs',
        category: 'decorator',
        description: 'Creative wedding decoration and floral arrangements',
        location: {
          address: '456 Oak Ave',
          city: 'Kandy',
          province: 'Central',
          coordinates: [80.6337, 7.2906]
        },
        contact: {
          phone: '+94 11 345 6789',
          email: 'sarah@elegantdesigns.com'
        },
        rating: { average: 4.6, count: 18 },
        owner: vendorUsers[1]._id,
        isVerified: true,
        isActive: true,
        featured: true,
        businessHours: {
          start: '08:00',
          end: '17:00'
        }
      }),
      Vendor.create({
        name: 'Mike Caterer',
        businessName: 'Tasteful Catering',
        category: 'caterer',
        description: 'Exquisite wedding catering with customizable menus',
        location: {
          address: '789 Pine St',
          city: 'Galle',
          province: 'Southern',
          coordinates: [80.2176, 6.0535]
        },
        contact: {
          phone: '+94 11 456 7890',
          email: 'mike@tastefulcatering.com'
        },
        rating: { average: 4.9, count: 32 },
        owner: vendorUsers[2]._id,
        isVerified: true,
        isActive: true,
        featured: true,
        businessHours: {
          start: '07:00',
          end: '19:00'
        }
      })
    ])

    // Create venues
    console.log('🏰 Creating venues...')
    const venues = await Promise.all([
      Venue.create({
        name: 'Grand Ballroom',
        description: 'Elegant ballroom perfect for large wedding receptions',
        location: {
          address: '100 Luxury Lane',
          city: 'Colombo',
          province: 'Western',
          coordinates: [79.8612, 6.9271]
        },
        capacity: { min: 100, max: 500 },
        pricing: {
          basePrice: 50000,
          perPerson: 2500,
          minimumGuests: 100
        },
        amenities: ['parking', 'catering', 'decorations', 'music', 'photography'],
        owner: adminUser._id,
        isActive: true,
        featured: true,
        businessHours: {
          start: '08:00',
          end: '23:00'
        }
      }),
      Venue.create({
        name: 'Garden Paradise',
        description: 'Beautiful outdoor garden venue for intimate weddings',
        location: {
          address: '200 Nature Way',
          city: 'Kandy',
          province: 'Central',
          coordinates: [80.6337, 7.2906]
        },
        capacity: { min: 50, max: 200 },
        pricing: {
          basePrice: 30000,
          perPerson: 2000,
          minimumGuests: 50
        },
        amenities: ['parking', 'garden', 'decorations', 'outdoor-ceremony'],
        owner: adminUser._id,
        isActive: true,
        featured: true,
        businessHours: {
          start: '06:00',
          end: '22:00'
        }
      })
    ])

    // Create services
    console.log('🛠️  Creating services...')
    const services = await Promise.all([
      Service.create({
        vendor: vendors[0]._id,
        name: 'Wedding Photography Package',
        description: 'Complete wedding photography coverage including engagement shoot',
        category: 'photography',
        subcategory: 'wedding',
        price: 75000,
        pricingType: 'fixed',
        duration: '8 hours',
        capacity: { min: 1, max: 1 },
        isAvailable: true,
        isFeatured: true,
        features: ['Engagement shoot', 'Full day coverage', 'Edited photos', 'Online gallery'],
        requirements: ['Advance booking required', '50% deposit']
      }),
      Service.create({
        vendor: vendors[1]._id,
        name: 'Wedding Decoration',
        description: 'Complete wedding decoration and floral arrangements',
        category: 'decoration',
        subcategory: 'wedding',
        price: 45000,
        pricingType: 'fixed',
        duration: '6 hours',
        capacity: { min: 50, max: 500 },
        isAvailable: true,
        isFeatured: true,
        features: ['Flowers', 'Lighting', 'Table settings', 'Ceremony arch'],
        requirements: ['Site visit required', '30% deposit']
      }),
      Service.create({
        vendor: vendors[2]._id,
        name: 'Wedding Catering',
        description: 'Premium wedding catering with customizable menu',
        category: 'catering',
        subcategory: 'wedding',
        price: 3500,
        pricingType: 'per-person',
        duration: '4 hours',
        capacity: { min: 50, max: 300 },
        isAvailable: true,
        isFeatured: true,
        features: ['Custom menu', 'Staff included', 'Setup and cleanup', 'Dietary options'],
        requirements: ['Menu tasting required', '25% deposit']
      })
    ])

    // Create reviews
    console.log('⭐ Creating reviews...')
    const reviews = await Promise.all([
      Review.create({
        user: regularUsers[0]._id,
        vendor: vendors[0]._id,
        rating: 5,
        comment: 'Amazing photography! John captured every special moment perfectly.',
        isVerified: true,
        isActive: true
      }),
      Review.create({
        user: regularUsers[1]._id,
        vendor: vendors[1]._id,
        rating: 4,
        comment: 'Beautiful decorations that made our wedding magical.',
        isVerified: true,
        isActive: true
      }),
      Review.create({
        user: regularUsers[2]._id,
        vendor: vendors[2]._id,
        rating: 5,
        comment: 'Delicious food and excellent service. Highly recommended!',
        isVerified: true,
        isActive: true
      }),
      Review.create({
        user: regularUsers[0]._id,
        venue: venues[0]._id,
        rating: 4,
        comment: 'Stunning venue with great staff. Perfect for our reception.',
        isVerified: true,
        isActive: true
      })
    ])

    // Create tasks
    console.log('📋 Creating tasks...')
    const tasks = await Promise.all([
      Task.create({
        user: regularUsers[0]._id,
        title: 'Book photographer',
        description: 'Research and book wedding photographer',
        dueDate: new Date('2024-10-15'),
        status: 'completed',
        priority: 'high',
        category: 'vendors'
      }),
      Task.create({
        user: regularUsers[0]._id,
        title: 'Choose wedding dress',
        description: 'Schedule dress fittings and make final selection',
        dueDate: new Date('2024-11-01'),
        status: 'in-progress',
        priority: 'high',
        category: 'attire'
      }),
      Task.create({
        user: regularUsers[1]._id,
        title: 'Book venue',
        description: 'Visit and book wedding venue',
        dueDate: new Date('2024-09-30'),
        status: 'pending',
        priority: 'urgent',
        category: 'venue'
      })
    ])

    // Create bookings
    console.log('📅 Creating bookings...')
    const bookings = await Promise.all([
      Booking.create({
        user: regularUsers[0]._id,
        vendor: vendors[0]._id,
        service: services[0]._id,
        date: new Date('2024-12-15'),
        startTime: '08:00',
        endTime: '16:00',
        guests: 150,
        status: 'confirmed',
        totalAmount: 75000,
        depositAmount: 37500,
        depositPaid: true,
        contactInfo: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+94 11 567 8901'
        }
      }),
      Booking.create({
        user: regularUsers[1]._id,
        venue: venues[0]._id,
        date: new Date('2024-11-20'),
        startTime: '18:00',
        endTime: '23:00',
        guests: 200,
        status: 'confirmed',
        totalAmount: 550000,
        depositAmount: 165000,
        depositPaid: true,
        contactInfo: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+94 11 678 9012'
        }
      })
    ])

    // Create payments
    console.log('💰 Creating payments...')
    const payments = await Promise.all([
      Payment.create({
        user: regularUsers[0]._id,
        vendor: vendors[0]._id,
        booking: bookings[0]._id,
        amount: 37500,
        status: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN_' + Date.now() + '_1',
        description: 'Deposit payment for wedding photography'
      }),
      Payment.create({
        user: regularUsers[1]._id,
        venue: venues[0]._id,
        booking: bookings[1]._id,
        amount: 165000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN_' + Date.now() + '_2',
        description: 'Deposit payment for venue booking'
      })
    ])

    // Create messages
    console.log('💬 Creating messages...')
    const conversationId1 = `${regularUsers[0]._id}-${vendors[0]._id}`
    const conversationId2 = `${regularUsers[1]._id}-${vendors[1]._id}`

    await Promise.all([
      Message.create({
        sender: regularUsers[0]._id,
        receiver: vendors[0]._id,
        content: 'Hi! I\'m interested in your wedding photography package. Are you available on December 15th?',
        conversationId: conversationId1,
        messageType: 'text'
      }),
      Message.create({
        sender: vendors[0]._id,
        receiver: regularUsers[0]._id,
        content: 'Hello! Yes, I\'m available on December 15th. Would you like to schedule a consultation?',
        conversationId: conversationId1,
        messageType: 'text'
      }),
      Message.create({
        sender: regularUsers[1]._id,
        receiver: vendors[1]._id,
        content: 'Hi Sarah! I love your decoration work. Can you help with our November 20th wedding?',
        conversationId: conversationId2,
        messageType: 'text'
      })
    ])

    // Create notifications
    console.log('🔔 Creating notifications...')
    await Promise.all([
      Notification.create({
        user: regularUsers[0]._id,
        title: 'Booking Confirmed',
        message: 'Your photography booking for December 15th has been confirmed!',
        type: 'success',
        actionUrl: '/dashboard/bookings'
      }),
      Notification.create({
        user: regularUsers[1]._id,
        title: 'Payment Received',
        message: 'Your venue deposit payment has been received successfully.',
        type: 'success',
        actionUrl: '/dashboard/payments'
      }),
      Notification.create({
        user: regularUsers[2]._id,
        title: 'Welcome to WeddingLK',
        message: 'Welcome to WeddingLK! Start planning your perfect wedding today.',
        type: 'info',
        actionUrl: '/dashboard'
      })
    ])

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📊 Seeded Data Summary:')
    console.log(`👥 Users: ${await User.countDocuments()}`)
    console.log(`🏢 Vendors: ${await Vendor.countDocuments()}`)
    console.log(`🏰 Venues: ${await Vendor.countDocuments()}`)
    console.log(`⭐ Reviews: ${await Review.countDocuments()}`)
    console.log(`📋 Tasks: ${await Task.countDocuments()}`)
    console.log(`📅 Bookings: ${await Booking.countDocuments()}`)
    console.log(`💰 Payments: ${await Payment.countDocuments()}`)
    console.log(`💬 Messages: ${await Message.countDocuments()}`)
    console.log(`🔔 Notifications: ${await Notification.countDocuments()}`)
    console.log(`🛠️  Services: ${await Service.countDocuments()}`)

    console.log('\n🔑 Test Accounts:')
    console.log('👑 Admin: admin@weddinglk.com / admin123')
    console.log('🏢 Vendor: john@perfectphoto.com / vendor123')
    console.log('👥 User: alice@example.com / user123')

    process.exit(0)

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeder
connectDB().then(() => seedDatabase()) 