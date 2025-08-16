#!/usr/bin/env node

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk'

// Define schemas inline for Node.js compatibility
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  avatar: { type: String },
  preferences: {
    weddingDate: Date,
    budget: Number,
    guestCount: Number,
    location: String,
    style: String
  },
  favorites: {
    venues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }]
  },
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientType: String,
    subject: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  twoFactorTemp: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true })

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  category: {
    type: String,
    enum: ["photographer", "decorator", "catering", "music", "transport", "makeup", "jewelry", "clothing"],
    required: true,
  },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    serviceAreas: [{ type: String }],
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
  },
  services: [
    {
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number },
      duration: { type: String },
    },
  ],
  portfolio: [{ type: String }],
  pricing: {
    startingPrice: { type: Number, required: true },
    currency: { type: String, default: "LKR" },
    packages: [
      {
        name: { type: String },
        price: { type: Number },
        features: [{ type: String }],
      },
    ],
  },
  availability: [
    {
      date: { type: Date },
      isAvailable: { type: Boolean, default: true },
    },
  ],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      comment: { type: String },
      images: [{ type: String }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  onboardingComplete: { type: Boolean, default: false },
  subscription: {
    plan: { type: String, enum: ["basic", "premium", "pro"], default: "basic" },
    expiresAt: { type: Date },
  },
}, { timestamps: true })

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  capacity: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: "LKR" },
    pricePerGuest: { type: Number },
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  availability: [
    {
      date: { type: Date },
      isAvailable: { type: Boolean, default: true },
    },
  ],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      comment: { type: String },
      images: [{ type: String }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

const BookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  date: { type: Date, required: true },
  guestCount: { type: Number, required: true, min: 1 },
  eventType: {
    type: String,
    enum: ["wedding", "engagement", "reception", "ceremony", "other"],
    default: "wedding",
  },
  requirements: { type: String, maxlength: 1000 },
  budget: {
    amount: { type: Number },
    currency: { type: String, default: "LKR" },
  },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
    default: "pending",
  },
  price: {
    amount: { type: Number },
    currency: { type: String, default: "LKR" },
    breakdown: [
      {
        item: { type: String },
        amount: { type: Number },
        description: { type: String },
      },
    ],
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "partial", "completed", "failed", "refunded"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["stripe", "payhere", "bank_transfer", "cash", "other"],
    },
    transactionId: { type: String },
    amountPaid: { type: Number, default: 0 },
    paidAt: { type: Date },
    dueDate: { type: Date },
  },
  notes: {
    client: { type: String },
    venue: { type: String },
    vendor: { type: String },
    admin: { type: String },
  },
  timeline: {
    setupTime: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    cleanupTime: { type: Date },
  },
  services: [
    {
      name: { type: String },
      description: { type: String },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
    },
  ],
  addons: [
    {
      name: { type: String },
      description: { type: String },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
    },
  ],
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

const ReviewSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const TaskSchema = new mongoose.Schema({
  plannerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: [
      "booking_request", "booking_confirmed", "booking_cancelled", "booking_updated",
      "payment_received", "payment_failed", "new_review", "review_reply",
      "new_message", "message_reply", "service_updated", "venue_available",
      "vendor_available", "reminder", "system_announcement", "welcome",
      "verification", "password_reset", "subscription_expired", "subscription_renewed",
    ],
    required: true,
  },
  title: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 500 },
  data: {
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
  },
  isRead: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  deliveryChannels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
}, { timestamps: true })

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 2000 },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "booking_request", "booking_update", "payment_notification", "review_notification"],
    default: "text",
  },
  attachments: [
    {
      type: { type: String, enum: ["image", "document", "video"], required: true },
      url: { type: String, required: true },
      filename: { type: String },
      size: { type: Number },
      mimeType: { type: String },
    },
  ],
  isRead: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
}, { timestamps: true })

const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["couple", "vendor", "planner", "admin"], required: true },
      isActive: { type: Boolean, default: true },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  conversationType: {
    type: String,
    enum: ["direct", "group", "booking", "support"],
    default: "direct",
  },
  title: { type: String, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  settings: {
    allowFileSharing: { type: Boolean, default: true },
    allowReactions: { type: Boolean, default: true },
    allowEditing: { type: Boolean, default: true },
    allowDeletion: { type: Boolean, default: true },
    maxFileSize: { type: Number, default: 10 * 1024 * 1024 },
    allowedFileTypes: [{ type: String }],
  },
}, { timestamps: true })

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "LKR", enum: ["LKR", "USD", "EUR"] },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["stripe", "payhere", "bank_transfer", "cash"],
    required: true,
  },
  transactionId: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

const ServiceSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
})

// Create models
const User = mongoose.model('User', UserSchema)
const Vendor = mongoose.model('Vendor', VendorSchema)
const Venue = mongoose.model('Venue', VenueSchema)
const Booking = mongoose.model('Booking', BookingSchema)
const Review = mongoose.model('Review', ReviewSchema)
const Task = mongoose.model('Task', TaskSchema)
const Notification = mongoose.model('Notification', NotificationSchema)
const Message = mongoose.model('Message', MessageSchema)
const Conversation = mongoose.model('Conversation', ConversationSchema)
const Payment = mongoose.model('Payment', PaymentSchema)
const Service = mongoose.model('Service', ServiceSchema)

// Faker configuration for consistent data
faker.seed(12345)

// Data generation functions
const generateUser = (role = 'user') => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  
  return {
    email: faker.internet.email({ firstName, lastName }),
    name: `${firstName} ${lastName}`,
    phone: faker.phone.number('+94 ## ### ####'),
    role,
    avatar: faker.image.avatar(),
    preferences: {
      weddingDate: faker.date.future({ years: 2 }),
      budget: faker.number.int({ min: 200000, max: 2000000 }),
      guestCount: faker.number.int({ min: 50, max: 500 }),
      location: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Polonnaruwa', 'Trincomalee', 'Batticaloa']),
      style: faker.helpers.arrayElement(['Traditional', 'Modern', 'Rustic', 'Elegant', 'Bohemian', 'Classic', 'Contemporary', 'Vintage'])
    },
    favorites: {
      venues: [],
      vendors: []
    },
    isVerified: true,
    isActive: true,
    lastLogin: faker.date.recent({ days: 30 })
  }
}

const generateVendor = (ownerId) => {
  const categories = ['photographer', 'decorator', 'catering', 'music', 'transport', 'makeup', 'jewelry', 'clothing']
  const category = faker.helpers.arrayElement(categories)
  
  return {
    name: faker.person.fullName(),
    businessName: faker.company.name(),
    category,
    description: faker.lorem.paragraph(3),
    location: {
      address: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Polonnaruwa', 'Trincomalee', 'Batticaloa']),
      province: faker.helpers.arrayElement(['Western', 'Central', 'Southern', 'Northern', 'North Central', 'North Western', 'Eastern', 'Uva'])
    },
    contact: {
      phone: faker.phone.number('+94 ## ### ####'),
      email: faker.internet.email(),
      website: faker.internet.url(),
      socialMedia: {
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
        youtube: faker.internet.url()
      }
    },
    services: [
      {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 5000, max: 100000 }),
        duration: faker.helpers.arrayElement(['2 hours', '4 hours', '6 hours', '8 hours', 'Full day'])
      }
    ],
    portfolio: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url()
    ],
    pricing: {
      startingPrice: faker.number.int({ min: 10000, max: 200000 }),
      currency: 'LKR',
      packages: [
        {
          name: 'Basic Package',
          price: faker.number.int({ min: 10000, max: 50000 }),
          features: ['Basic service', 'Standard quality', 'Basic support']
        }
      ]
    },
    availability: [
      {
        date: faker.date.future({ years: 1 }),
        isAvailable: true
      }
    ],
    rating: {
      average: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
      count: faker.number.int({ min: 5, max: 50 })
    },
    owner: ownerId,
    isVerified: true,
    isActive: true,
    featured: faker.datatype.boolean(0.2),
    onboardingComplete: true,
    subscription: {
      plan: faker.helpers.arrayElement(['basic', 'premium', 'pro']),
      expiresAt: faker.date.future({ years: 1 })
    }
  }
}

const generateVenue = (ownerId) => {
  return {
    name: faker.company.name(),
    description: faker.lorem.paragraph(3),
    location: {
      address: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Polonnaruwa', 'Trincomalee', 'Batticaloa']),
      province: faker.helpers.arrayElement(['Western', 'Central', 'Southern', 'Northern', 'North Central', 'North Western', 'Eastern', 'Uva']),
      coordinates: {
        lat: faker.location.latitude({ min: 5.9, max: 9.9 }),
        lng: faker.location.longitude({ min: 79.5, max: 81.9 })
      }
    },
    capacity: {
      min: faker.number.int({ min: 50, max: 200 }),
      max: faker.number.int({ min: 200, max: 1000 })
    },
    pricing: {
      basePrice: faker.number.int({ min: 50000, max: 500000 }),
      currency: 'LKR',
      pricePerGuest: faker.number.int({ min: 1000, max: 5000 })
    },
    amenities: faker.helpers.arrayElements([
      'Parking', 'Air Conditioning', 'Kitchen', 'Bridal Suite', 'Garden', 'Pool', 'WiFi', 'Sound System',
      'Lighting', 'Tables & Chairs', 'Catering Kitchen', 'Bar', 'Dance Floor', 'Photography Areas'
    ], { min: 5, max: 10 }),
    images: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url()
    ],
    availability: [
      {
        date: faker.date.future({ years: 1 }),
        isAvailable: true
      }
    ],
    rating: {
      average: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
      count: faker.number.int({ min: 5, max: 50 })
    },
    owner: ownerId,
    isActive: true,
    featured: faker.datatype.boolean(0.2)
  }
}

const generateBooking = (clientId, venueId, vendorId) => {
  const eventTypes = ['wedding', 'engagement', 'reception', 'ceremony', 'other']
  const statuses = ['pending', 'confirmed', 'cancelled', 'completed', 'refunded']
  const paymentStatuses = ['pending', 'partial', 'completed', 'failed', 'refunded']
  
  return {
    bookingNumber: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    clientId,
    venueId,
    vendorId,
    date: faker.date.future({ years: 1 }),
    guestCount: faker.number.int({ min: 50, max: 500 }),
    eventType: faker.helpers.arrayElement(eventTypes),
    requirements: faker.lorem.paragraph(2),
    budget: {
      amount: faker.number.int({ min: 100000, max: 2000000 }),
      currency: 'LKR'
    },
    contactInfo: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+94 ## ### ####'),
      address: faker.location.streetAddress()
    },
    status: faker.helpers.arrayElement(statuses),
    price: {
      amount: faker.number.int({ min: 100000, max: 2000000 }),
      currency: 'LKR',
      breakdown: [
        {
          item: 'Venue Rental',
          amount: faker.number.int({ min: 50000, max: 500000 }),
          description: 'Main venue rental fee'
        }
      ]
    },
    payment: {
      status: faker.helpers.arrayElement(paymentStatuses),
      method: faker.helpers.arrayElement(['stripe', 'payhere', 'bank_transfer', 'cash', 'other']),
      transactionId: faker.string.alphanumeric(20),
      amountPaid: faker.number.int({ min: 0, max: 2000000 }),
      paidAt: faker.date.recent({ days: 30 }),
      dueDate: faker.date.future({ years: 1 })
    },
    notes: {
      client: faker.lorem.sentence(),
      venue: faker.lorem.sentence(),
      vendor: faker.lorem.sentence(),
      admin: faker.lorem.sentence()
    },
    timeline: {
      setupTime: faker.date.future({ years: 1 }),
      startTime: faker.date.future({ years: 1 }),
      endTime: faker.date.future({ years: 1 }),
      cleanupTime: faker.date.future({ years: 1 })
    },
    services: [
      {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 5000, max: 100000 }),
        quantity: 1
      }
    ],
    addons: [
      {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 1000, max: 50000 }),
        quantity: 1
      }
    ],
    isActive: true
  }
}

const generateReview = (vendorId, userId) => {
  return {
    vendorId,
    userId,
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.paragraph(2),
    createdAt: faker.date.recent({ days: 365 })
  }
}

const generateTask = (plannerId, clientId) => {
  const tasks = [
    'Book venue', 'Book photographer', 'Book caterer', 'Book decorator', 'Book music band',
    'Send invitations', 'Choose wedding dress', 'Choose groom suit', 'Book honeymoon',
    'Arrange transportation', 'Plan rehearsal dinner', 'Choose wedding cake', 'Book makeup artist'
  ]
  
  return {
    plannerId,
    clientId,
    task: faker.helpers.arrayElement(tasks),
    date: faker.date.future({ years: 1 }),
    status: faker.helpers.arrayElement(['pending', 'done']),
    createdAt: faker.date.recent({ days: 30 })
  }
}

const generateNotification = (recipientId, senderId, type) => {
  const notificationTypes = {
    booking_request: {
      title: 'New Booking Request',
      message: 'You have received a new booking request for your services.'
    },
    booking_confirmed: {
      title: 'Booking Confirmed',
      message: 'Your booking has been confirmed successfully.'
    },
    payment_received: {
      title: 'Payment Received',
      message: 'Payment has been received for your booking.'
    },
    new_review: {
      title: 'New Review',
      message: 'You have received a new review from a client.'
    },
    reminder: {
      title: 'Wedding Planning Reminder',
      message: 'Don\'t forget to complete your upcoming wedding planning tasks.'
    }
  }
  
  const notification = notificationTypes[type] || {
    title: 'System Notification',
    message: 'You have a new system notification.'
  }
  
  return {
    recipient: recipientId,
    sender: senderId,
    type,
    title: notification.title,
    message: notification.message,
    data: {
      priority: faker.helpers.arrayElement(['low', 'normal', 'high', 'urgent'])
    },
    isRead: faker.datatype.boolean(0.3),
    isDelivered: faker.datatype.boolean(0.8),
    deliveryChannels: {
      inApp: true,
      email: faker.datatype.boolean(0.5),
      sms: faker.datatype.boolean(0.3),
      push: faker.datatype.boolean(0.4)
    }
  }
}

const generateMessage = (conversationId, sender, recipient) => {
  const messageTypes = ['text', 'image', 'file', 'booking_request', 'booking_update']
  const messageType = faker.helpers.arrayElement(messageTypes)
  
  return {
    conversationId,
    sender,
    recipient,
    content: faker.lorem.paragraph(2),
    messageType,
    attachments: messageType === 'image' ? [
      {
        type: 'image',
        url: faker.image.url(),
        filename: faker.system.fileName(),
        size: faker.number.int({ min: 100000, max: 5000000 }),
        mimeType: 'image/jpeg'
      }
    ] : [],
    isRead: faker.datatype.boolean(0.7),
    isDelivered: faker.datatype.boolean(0.9)
  }
}

const generateConversation = (participants) => {
  const conversationTypes = ['direct', 'group', 'booking', 'support']
  
  return {
    participants: participants.map(p => ({
      user: p.userId,
      role: p.role,
      isActive: true,
      joinedAt: faker.date.recent({ days: 30 })
    })),
    conversationType: faker.helpers.arrayElement(conversationTypes),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    isActive: true,
    isArchived: false,
    settings: {
      allowFileSharing: true,
      allowReactions: true,
      allowEditing: true,
      allowDeletion: true,
      maxFileSize: 10 * 1024 * 1024,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
    }
  }
}

const generatePayment = (userId, bookingId) => {
  const statuses = ['pending', 'completed', 'failed', 'refunded']
  const methods = ['stripe', 'payhere', 'bank_transfer', 'cash']
  
  return {
    userId,
    bookingId,
    amount: faker.number.int({ min: 10000, max: 500000 }),
    currency: 'LKR',
    status: faker.helpers.arrayElement(statuses),
    paymentMethod: faker.helpers.arrayElement(methods),
    transactionId: faker.string.alphanumeric(20),
    description: faker.lorem.sentence(),
    metadata: {
      source: faker.helpers.arrayElement(['website', 'phone', 'email', 'walk_in']),
      campaign: faker.helpers.arrayElement(['google_ads', 'facebook_ads', 'organic', 'referral']),
      referrer: faker.internet.url()
    }
  }
}

const generateService = (vendorId) => {
  return {
    vendorId,
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 5000, max: 100000 }),
    description: faker.lorem.sentence(),
    createdAt: faker.date.recent({ days: 365 })
  }
}

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting comprehensive database seeding...')
    
    // Connect to database
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to database')
    
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      Message.deleteMany({}),
      Conversation.deleteMany({}),
      Payment.deleteMany({}),
      Service.deleteMany({})
    ])
    console.log('✅ Existing data cleared')
    
    // Generate users
    console.log('👥 Generating users...')
    const users = []
    
    // Generate 2 admin users
    for (let i = 0; i < 2; i++) {
      const adminData = generateUser('admin')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      const admin = new User({
        ...adminData,
        password: hashedPassword
      })
      users.push(await admin.save())
    }
    
    // Generate 50 regular users
    for (let i = 0; i < 50; i++) {
      const userData = generateUser('user')
      const hashedPassword = await bcrypt.hash('user123', 12)
      const user = new User({
        ...userData,
        password: hashedPassword
      })
      users.push(await user.save())
    }
    
    console.log(`✅ Generated ${users.length} users`)
    
    // Generate vendors (50)
    console.log('🏢 Generating vendors...')
    const vendors = []
    const vendorUsers = users.filter(u => u.role === 'user').slice(0, 50)
    
    for (let i = 0; i < 50; i++) {
      const vendorData = generateVendor(vendorUsers[i]._id)
      const vendor = new Vendor(vendorData)
      vendors.push(await vendor.save())
      
      // Update user role to vendor
      await User.findByIdAndUpdate(vendorUsers[i]._id, { role: 'vendor' })
    }
    
    console.log(`✅ Generated ${vendors.length} vendors`)
    
    // Generate venues (25)
    console.log('🏰 Generating venues...')
    const venues = []
    const venueOwners = users.filter(u => u.role === 'user').slice(0, 25)
    
    for (let i = 0; i < 25; i++) {
      const venueData = generateVenue(venueOwners[i]._id)
      const venue = new Venue(venueData)
      venues.push(await venue.save())
    }
    
    console.log(`✅ Generated ${venues.length} venues`)
    
    // Generate services
    console.log('🔧 Generating services...')
    const services = []
    for (const vendor of vendors) {
      const serviceData = generateService(vendor._id)
      const service = new Service(serviceData)
      services.push(await service.save())
    }
    console.log(`✅ Generated ${services.length} services`)
    
    // Generate bookings
    console.log('📅 Generating bookings...')
    const bookings = []
    const clients = users.filter(u => u.role === 'user').slice(0, 30)
    
    for (let i = 0; i < 50; i++) {
      const client = faker.helpers.arrayElement(clients)
      const venue = faker.helpers.arrayElement(venues)
      const vendor = faker.helpers.arrayElement(vendors)
      
      const bookingData = generateBooking(client._id, venue._id, vendor._id)
      const booking = new Booking(bookingData)
      bookings.push(await booking.save())
    }
    
    console.log(`✅ Generated ${bookings.length} bookings`)
    
    // Generate reviews
    console.log('⭐ Generating reviews...')
    const reviews = []
    const reviewUsers = users.filter(u => u.role === 'user').slice(0, 40)
    
    for (let i = 0; i < 100; i++) {
      const vendor = faker.helpers.arrayElement(vendors)
      const user = faker.helpers.arrayElement(reviewUsers)
      
      const reviewData = generateReview(vendor._id, user._id)
      const review = new Review(reviewData)
      reviews.push(await review.save())
    }
    
    console.log(`✅ Generated ${reviews.length} reviews`)
    
    // Generate tasks
    console.log('📋 Generating tasks...')
    const tasks = []
    const planners = users.filter(u => u.role === 'admin')
    const taskClients = users.filter(u => u.role === 'user').slice(0, 20)
    
    for (let i = 0; i < 50; i++) {
      const planner = faker.helpers.arrayElement(planners)
      const client = faker.helpers.arrayElement(taskClients)
      
      const taskData = generateTask(planner._id, client._id)
      const task = new Task(taskData)
      tasks.push(await task.save())
    }
    
    console.log(`✅ Generated ${tasks.length} tasks`)
    
    // Generate conversations
    console.log('💬 Generating conversations...')
    const conversations = []
    
    // Generate direct conversations between users and vendors
    for (let i = 0; i < 30; i++) {
      const user = faker.helpers.arrayElement(users.filter(u => u.role === 'user'))
      const vendor = faker.helpers.arrayElement(vendors)
      
      const conversationData = generateConversation([
        { userId: user._id, role: 'couple' },
        { userId: vendor.owner, role: 'vendor' }
      ])
      
      const conversation = new Conversation(conversationData)
      conversations.push(await conversation.save())
    }
    
    console.log(`✅ Generated ${conversations.length} conversations`)
    
    // Generate messages
    console.log('💌 Generating messages...')
    const messages = []
    
    for (const conversation of conversations) {
      const messageCount = faker.number.int({ min: 3, max: 10 })
      
      for (let i = 0; i < messageCount; i++) {
        const sender = faker.helpers.arrayElement(conversation.participants).user
        const otherParticipants = conversation.participants.filter(p => p.user.toString() !== sender.toString())
        
        if (otherParticipants.length > 0) {
          const recipient = faker.helpers.arrayElement(otherParticipants).user
          
          const messageData = generateMessage(conversation._id, sender, recipient)
          const message = new Message(messageData)
          messages.push(await message.save())
        }
      }
    }
    
    console.log(`✅ Generated ${messages.length} messages`)
    
    // Generate notifications
    console.log('🔔 Generating notifications...')
    const notifications = []
    
    for (let i = 0; i < 100; i++) {
      const recipient = faker.helpers.arrayElement(users)
      const sender = faker.helpers.arrayElement(users.filter(u => u._id.toString() !== recipient._id.toString()))
      const type = faker.helpers.arrayElement(['booking_request', 'booking_confirmed', 'payment_received', 'new_review', 'reminder'])
      
      const notificationData = generateNotification(recipient._id, sender._id, type)
      const notification = new Notification(notificationData)
      notifications.push(await notification.save())
    }
    
    console.log(`✅ Generated ${notifications.length} notifications`)
    
    // Generate payments
    console.log('💰 Generating payments...')
    const payments = []
    
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users)
      const booking = faker.helpers.arrayElement(bookings)
      
      const paymentData = generatePayment(user._id, booking._id)
      const payment = new Payment(paymentData)
      payments.push(await payment.save())
    }
    
    console.log(`✅ Generated ${payments.length} payments`)
    
    // Update ratings based on reviews
    console.log('📊 Updating ratings...')
    for (const vendor of vendors) {
      const vendorReviews = reviews.filter(r => r.vendorId.toString() === vendor._id.toString())
      if (vendorReviews.length > 0) {
        const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length
        await Vendor.findByIdAndUpdate(vendor._id, {
          'rating.average': Math.round(avgRating * 10) / 10,
          'rating.count': vendorReviews.length
        })
      }
    }
    
    for (const venue of venues) {
      const venueReviews = reviews.filter(r => r.venueId?.toString() === venue._id.toString())
      if (venueReviews.length > 0) {
        const avgRating = venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length
        await Venue.findByIdAndUpdate(venue._id, {
          'rating.average': Math.round(avgRating * 10) / 10,
          'rating.count': venueReviews.length
        })
      }
    }
    
    console.log('✅ Ratings updated')
    
    // Generate summary
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   👥 Users: ${users.length} (2 admins, ${users.length - 2} regular users)`)
    console.log(`   🏢 Vendors: ${vendors.length}`)
    console.log(`   🏰 Venues: ${venues.length}`)
    console.log(`   🔧 Services: ${services.length}`)
    console.log(`   📅 Bookings: ${bookings.length}`)
    console.log(`   ⭐ Reviews: ${reviews.length}`)
    console.log(`   📋 Tasks: ${tasks.length}`)
    console.log(`   💬 Conversations: ${conversations.length}`)
    console.log(`   💌 Messages: ${messages.length}`)
    console.log(`   🔔 Notifications: ${notifications.length}`)
    console.log(`   💰 Payments: ${payments.length}`)
    
    console.log('\n🔑 Default login credentials:')
    console.log('   Admin: admin@weddinglk.com / admin123')
    console.log('   User: user@weddinglk.com / user123')
    
    console.log('\n✨ All features and tables have been seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from database')
  }
}

// Run seeding
seedDatabase() 