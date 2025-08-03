#!/usr/bin/env node

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk'

// Import models
const User = mongoose.model('User', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  role: String,
  isVerified: Boolean,
  weddingDate: Date,
  preferences: Object,
  subscription: Object,
  createdAt: Date,
  updatedAt: Date
}))

const Venue = mongoose.model('Venue', new mongoose.Schema({
  name: String,
  description: String,
  location: Object,
  capacity: Object,
  pricing: Object,
  amenities: [String],
  images: [String],
  rating: Object,
  reviews: [Object],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  featured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}))

const Vendor = mongoose.model('Vendor', new mongoose.Schema({
  name: String,
  businessName: String,
  category: String,
  description: String,
  location: Object,
  contact: Object,
  services: [Object],
  portfolio: [String],
  pricing: Object,
  rating: Object,
  reviews: [Object],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  experience: Number,
  awards: [String],
  availability: Object,
  createdAt: Date,
  updatedAt: Date
}))

const Booking = mongoose.model('Booking', new mongoose.Schema({
  bookingNumber: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  guestCount: Number,
  eventType: String,
  requirements: String,
  budget: Number,
  contactInfo: Object,
  status: String,
  price: Object,
  payment: Object,
  notes: String,
  timeline: Object,
  services: [Object],
  addons: [Object],
  documents: [Object],
  reviews: [Object],
  cancellation: Object,
  metadata: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}))

const Message = mongoose.model('Message', new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  messageType: String,
  attachments: [Object],
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isRead: Boolean,
  readAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  isEdited: Boolean,
  editedAt: Date,
  originalContent: String,
  isDeleted: Boolean,
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  reactions: [Object],
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}))

const Conversation = mongoose.model('Conversation', new mongoose.Schema({
  participants: [Object],
  conversationType: String,
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: Date,
  unreadCount: Object,
  title: String,
  description: String,
  isArchived: Object,
  isPinned: Object,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}))

const Notification = mongoose.model('Notification', new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  title: String,
  message: String,
  data: Object,
  isRead: Boolean,
  readAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  deliveryChannels: [String],
  deliveryStatus: Object,
  scheduledFor: Date,
  expiresAt: Date,
  isArchived: Boolean,
  archivedAt: Date,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}))

// Seed data
const seedData = {
  users: [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@weddinglk.lk',
      phone: '+94771234567',
      password: 'admin123',
      userType: 'admin',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+94771234568',
      password: 'password123',
      userType: 'couple',
      role: 'user',
      isVerified: true,
      weddingDate: new Date('2024-12-15'),
      preferences: {
        budget: 500000,
        guestCount: 150,
        location: 'Colombo',
        style: 'traditional'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+94771234569',
      password: 'password123',
      userType: 'couple',
      role: 'user',
      isVerified: true,
      weddingDate: new Date('2024-11-20'),
      preferences: {
        budget: 300000,
        guestCount: 80,
        location: 'Kandy',
        style: 'modern'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Venue',
      lastName: 'Owner',
      email: 'venue@example.com',
      phone: '+94771234570',
      password: 'password123',
      userType: 'vendor',
      role: 'vendor',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Photographer',
      lastName: 'Pro',
      email: 'photographer@example.com',
      phone: '+94771234571',
      password: 'password123',
      userType: 'vendor',
      role: 'vendor',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  venues: [
    {
      name: 'Grand Ballroom Hotel',
      description: 'Luxurious wedding venue with stunning ocean views and world-class amenities. Perfect for elegant weddings with up to 300 guests.',
      location: {
        address: '123 Marine Drive',
        city: 'Colombo',
        province: 'Western Province',
        coordinates: { lat: 6.9271, lng: 79.8612 }
      },
      capacity: { min: 50, max: 300 },
      pricing: {
        basePrice: 150000,
        currency: 'LKR',
        packages: [
          {
            name: 'Basic Package',
            description: 'Venue rental with basic setup',
            price: 150000,
            includes: ['Venue rental', 'Basic decoration', 'Sound system']
          },
          {
            name: 'Premium Package',
            description: 'Full service with catering',
            price: 250000,
            includes: ['Venue rental', 'Full decoration', 'Catering for 100 guests', 'Photography']
          }
        ]
      },
      amenities: ['Parking', 'Catering', 'Decoration', 'Sound System', 'Bridal Suite', 'Garden', 'Pool'],
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      rating: { average: 4.8, count: 89 },
      reviews: [],
      featured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Garden Paradise Resort',
      description: 'Beautiful garden wedding venue surrounded by nature. Ideal for intimate and romantic ceremonies.',
      location: {
        address: '456 Hill Street',
        city: 'Kandy',
        province: 'Central Province',
        coordinates: { lat: 7.2906, lng: 80.6337 }
      },
      capacity: { min: 30, max: 200 },
      pricing: {
        basePrice: 120000,
        currency: 'LKR',
        packages: [
          {
            name: 'Garden Package',
            description: 'Outdoor ceremony and reception',
            price: 120000,
            includes: ['Garden venue', 'Basic setup', 'Natural decoration']
          }
        ]
      },
      amenities: ['Garden', 'Pool', 'Accommodation', 'Photography', 'Catering'],
      images: ['/placeholder.svg', '/placeholder.svg'],
      rating: { average: 4.6, count: 45 },
      reviews: [],
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Seaside Wedding Villa',
      description: 'Exclusive beachfront villa perfect for destination weddings. Breathtaking ocean views and private beach access.',
      location: {
        address: '789 Beach Road',
        city: 'Galle',
        province: 'Southern Province',
        coordinates: { lat: 6.0535, lng: 80.2210 }
      },
      capacity: { min: 20, max: 150 },
      pricing: {
        basePrice: 100000,
        currency: 'LKR',
        packages: [
          {
            name: 'Beach Package',
            description: 'Beach ceremony and villa reception',
            price: 100000,
            includes: ['Beach access', 'Villa rental', 'Beach setup']
          }
        ]
      },
      amenities: ['Beach View', 'Photography', 'Catering', 'Accommodation', 'Water Sports'],
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      rating: { average: 4.9, count: 67 },
      reviews: [],
      featured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  vendors: [
    {
      name: 'Perfect Moments Photography',
      businessName: 'Perfect Moments Photography Studio',
      category: 'photographer',
      description: 'Professional wedding photography and videography services. Capturing your special moments with creativity and style.',
      location: {
        address: '321 Camera Street',
        city: 'Colombo',
        province: 'Western Province',
        coordinates: { lat: 6.9271, lng: 79.8612 }
      },
      contact: {
        phone: '+94771234572',
        email: 'info@perfectmoments.lk',
        website: 'www.perfectmoments.lk'
      },
      services: [
        {
          name: 'Wedding Photography',
          description: 'Full day wedding photography coverage',
          price: 75000
        },
        {
          name: 'Wedding Videography',
          description: 'Cinematic wedding video production',
          price: 95000
        },
        {
          name: 'Engagement Shoot',
          description: 'Pre-wedding engagement photography',
          price: 25000
        }
      ],
      portfolio: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      pricing: {
        startingPrice: 25000,
        currency: 'LKR'
      },
      rating: { average: 4.9, count: 156 },
      reviews: [],
      experience: 8,
      awards: ['Best Wedding Photographer 2023', 'Excellence in Photography Award'],
      availability: {
        isAvailable: true,
        nextAvailableDate: new Date('2024-10-15')
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Delicious Catering Co.',
      businessName: 'Delicious Catering Services',
      category: 'caterer',
      description: 'Premium wedding catering with diverse menu options. From traditional Sri Lankan cuisine to international dishes.',
      location: {
        address: '654 Food Street',
        city: 'Galle',
        province: 'Southern Province',
        coordinates: { lat: 6.0535, lng: 80.2210 }
      },
      contact: {
        phone: '+94771234573',
        email: 'orders@deliciouscatering.lk',
        website: 'www.deliciouscatering.lk'
      },
      services: [
        {
          name: 'Wedding Buffet',
          description: 'Full buffet service for wedding reception',
          price: 2500
        },
        {
          name: 'Plated Dinner',
          description: 'Elegant plated dinner service',
          price: 3000
        },
        {
          name: 'Cocktail Reception',
          description: 'Cocktail and canapé service',
          price: 1800
        }
      ],
      portfolio: ['/placeholder.svg', '/placeholder.svg'],
      pricing: {
        startingPrice: 1800,
        currency: 'LKR'
      },
      rating: { average: 4.7, count: 89 },
      reviews: [],
      experience: 12,
      awards: ['Best Catering Service 2022', 'Food Safety Excellence Award'],
      availability: {
        isAvailable: true,
        nextAvailableDate: new Date('2024-10-20')
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Harmony Live Band',
      businessName: 'Harmony Music Entertainment',
      category: 'music',
      description: 'Professional live music band specializing in wedding entertainment. Creating the perfect atmosphere for your special day.',
      location: {
        address: '987 Music Avenue',
        city: 'Kandy',
        province: 'Central Province',
        coordinates: { lat: 7.2906, lng: 80.6337 }
      },
      contact: {
        phone: '+94771234574',
        email: 'bookings@harmonymusic.lk',
        website: 'www.harmonymusic.lk'
      },
      services: [
        {
          name: 'Live Band Performance',
          description: '4-hour live band performance',
          price: 45000
        },
        {
          name: 'DJ Service',
          description: 'Professional DJ with sound system',
          price: 35000
        },
        {
          name: 'String Quartet',
          description: 'Elegant string quartet for ceremony',
          price: 30000
        }
      ],
      portfolio: ['/placeholder.svg', '/placeholder.svg'],
      pricing: {
        startingPrice: 30000,
        currency: 'LKR'
      },
      rating: { average: 4.8, count: 67 },
      reviews: [],
      experience: 15,
      awards: ['Best Wedding Band 2023', 'Musical Excellence Award'],
      availability: {
        isAvailable: true,
        nextAvailableDate: new Date('2024-10-25')
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  bookings: [
    {
      bookingNumber: 'BK2024001',
      guestCount: 150,
      eventType: 'wedding',
      requirements: 'Traditional Sri Lankan wedding with modern elements',
      budget: 500000,
      contactInfo: {
        phone: '+94771234568',
        email: 'john@example.com'
      },
      status: 'confirmed',
      price: {
        total: 450000,
        breakdown: {
          venue: 150000,
          catering: 225000,
          photography: 75000
        }
      },
      payment: {
        status: 'completed',
        method: 'card',
        installments: 1,
        paidAmount: 450000,
        remainingAmount: 0
      },
      notes: 'Special dietary requirements for 5 guests',
      timeline: {
        ceremony: '2024-12-15T16:00:00Z',
        reception: '2024-12-15T18:00:00Z',
        setup: '2024-12-15T14:00:00Z'
      },
      services: [
        { name: 'Venue Rental', price: 150000 },
        { name: 'Catering Service', price: 225000 },
        { name: 'Photography', price: 75000 }
      ],
      addons: [
        { name: 'Extra Decoration', price: 25000 },
        { name: 'Videography', price: 95000 }
      ],
      documents: [],
      reviews: [],
      cancellation: null,
      metadata: {},
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  conversations: [
    {
      participants: [
        { userId: 'user1', role: 'couple' },
        { userId: 'vendor1', role: 'vendor' }
      ],
      conversationType: 'booking',
      title: 'Wedding Photography Discussion',
      description: 'Discussion about wedding photography services',
      isArchived: { user1: false, vendor1: false },
      isPinned: { user1: false, vendor1: false },
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  messages: [
    {
      content: 'Hi! I\'m interested in your wedding photography services. Could you tell me more about your packages?',
      messageType: 'text',
      attachments: [],
      isRead: false,
      isDelivered: true,
      isEdited: false,
      isDeleted: false,
      reactions: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      content: 'Hello! Thank you for your interest. I offer several packages starting from LKR 25,000. Would you like me to send you the details?',
      messageType: 'text',
      attachments: [],
      isRead: true,
      isDelivered: true,
      isEdited: false,
      isDeleted: false,
      reactions: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  notifications: [
    {
      type: 'new_message',
      title: 'New Message',
      message: 'You have received a new message from Perfect Moments Photography',
      data: {
        conversationId: 'conv1',
        senderId: 'vendor1'
      },
      isRead: false,
      isDelivered: true,
      deliveryChannels: ['email', 'push'],
      deliveryStatus: {
        email: 'delivered',
        push: 'delivered'
      },
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your booking with Grand Ballroom Hotel has been confirmed',
      data: {
        bookingId: 'booking1',
        venueId: 'venue1'
      },
      isRead: true,
      isDelivered: true,
      deliveryChannels: ['email', 'push'],
      deliveryStatus: {
        email: 'delivered',
        push: 'delivered'
      },
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    console.log('MongoDB URI:', MONGODB_URI)
    
    // Connect with retry logic
    let retries = 5
    while (retries > 0) {
      try {
        await mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
        console.log('Connected to MongoDB')
        break
      } catch (error) {
        console.log(`Connection attempt ${6 - retries} failed:`, error.message)
        retries--
        if (retries === 0) {
          throw new Error('Failed to connect to MongoDB after 5 attempts')
        }
        console.log('Retrying in 5 seconds...')
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    // Clear existing data
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Venue.deleteMany({})
    await Vendor.deleteMany({})
    await Booking.deleteMany({})
    await Conversation.deleteMany({})
    await Message.deleteMany({})
    await Notification.deleteMany({})
    console.log('Existing data cleared')

    // Hash passwords
    console.log('Hashing passwords...')
    const hashedUsers = await Promise.all(
      seedData.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    )

    // Create users
    console.log('Creating users...')
    const createdUsers = await User.insertMany(hashedUsers)
    console.log(`Created ${createdUsers.length} users`)

    // Assign owners to venues and vendors
    const venueOwner = createdUsers.find(u => u.email === 'venue@example.com')
    const vendorOwner = createdUsers.find(u => u.email === 'photographer@example.com')
    const couple1 = createdUsers.find(u => u.email === 'john@example.com')
    const couple2 = createdUsers.find(u => u.email === 'jane@example.com')

    // Create venues with owners
    console.log('Creating venues...')
    const venuesWithOwners = seedData.venues.map((venue, index) => ({
      ...venue,
      owner: venueOwner._id
    }))
    const createdVenues = await Venue.insertMany(venuesWithOwners)
    console.log(`Created ${createdVenues.length} venues`)

    // Create vendors with owners
    console.log('Creating vendors...')
    const vendorsWithOwners = seedData.vendors.map((vendor, index) => ({
      ...vendor,
      owner: vendorOwner._id
    }))
    const createdVendors = await Vendor.insertMany(vendorsWithOwners)
    console.log(`Created ${createdVendors.length} vendors`)

    // Create bookings with references
    console.log('Creating bookings...')
    const bookingsWithRefs = seedData.bookings.map((booking, index) => ({
      ...booking,
      clientId: couple1._id,
      venueId: createdVenues[0]._id,
      vendorId: createdVendors[0]._id
    }))
    const createdBookings = await Booking.insertMany(bookingsWithRefs)
    console.log(`Created ${createdBookings.length} bookings`)

    // Create conversations with references
    console.log('Creating conversations...')
    const conversationsWithRefs = seedData.conversations.map((conversation, index) => ({
      ...conversation,
      participants: [
        { userId: couple1._id, role: 'couple' },
        { userId: vendorOwner._id, role: 'vendor' }
      ]
    }))
    const createdConversations = await Conversation.insertMany(conversationsWithRefs)
    console.log(`Created ${createdConversations.length} conversations`)

    // Create messages with references
    console.log('Creating messages...')
    const messagesWithRefs = seedData.messages.map((message, index) => ({
      ...message,
      conversationId: createdConversations[0]._id,
      sender: index === 0 ? couple1._id : vendorOwner._id,
      recipient: index === 0 ? vendorOwner._id : couple1._id
    }))
    const createdMessages = await Message.insertMany(messagesWithRefs)
    console.log(`Created ${createdMessages.length} messages`)

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(createdConversations[0]._id, {
      lastMessage: createdMessages[createdMessages.length - 1]._id,
      lastMessageAt: createdMessages[createdMessages.length - 1].createdAt,
      unreadCount: { [couple1._id.toString()]: 1, [vendorOwner._id.toString()]: 0 }
    })

    // Create notifications with references
    console.log('Creating notifications...')
    const notificationsWithRefs = seedData.notifications.map((notification, index) => ({
      ...notification,
      recipient: couple1._id,
      sender: index === 0 ? vendorOwner._id : null,
      data: {
        ...notification.data,
        conversationId: index === 0 ? createdConversations[0]._id : null,
        bookingId: index === 1 ? createdBookings[0]._id : null,
        venueId: index === 1 ? createdVenues[0]._id : null
      }
    }))
    const createdNotifications = await Notification.insertMany(notificationsWithRefs)
    console.log(`Created ${createdNotifications.length} notifications`)

    console.log('Database seeding completed successfully!')
    console.log('\nCreated:')
    console.log(`- ${createdUsers.length} users`)
    console.log(`- ${createdVenues.length} venues`)
    console.log(`- ${createdVendors.length} vendors`)
    console.log(`- ${createdBookings.length} bookings`)
    console.log(`- ${createdConversations.length} conversations`)
    console.log(`- ${createdMessages.length} messages`)
    console.log(`- ${createdNotifications.length} notifications`)

    console.log('\nTest Accounts:')
    console.log('Admin: admin@weddinglk.lk / admin123')
    console.log('Couple: john@example.com / password123')
    console.log('Vendor: photographer@example.com / password123')

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seed function
seedDatabase() 