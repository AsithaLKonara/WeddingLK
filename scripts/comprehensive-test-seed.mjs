#!/usr/bin/env node

/**
 * Comprehensive Test Data Seeding Script for WeddingLK
 * This script creates realistic test data for all database tables
 * and validates the data creation process.
 */

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import all models
import User from '../lib/models/user.ts';
import Vendor from '../lib/models/vendor.ts';
import Venue from '../lib/models/venue.ts';
import Booking from '../lib/models/booking.ts';
import Review from '../lib/models/review.ts';
import Message from '../lib/models/message.ts';
import Conversation from '../lib/models/conversation.ts';
import Notification from '../lib/models/notification.ts';
import Payment from '../lib/models/payment.ts';
import Task from '../lib/models/task.ts';
import Client from '../lib/models/client.ts';
import VendorProfile from '../lib/models/vendorProfile.ts';
import WeddingPlannerProfile from '../lib/models/weddingPlannerProfile.ts';
import Document from '../lib/models/document.ts';

// Test configuration
const TEST_CONFIG = {
  users: { count: 50, vendors: 20, planners: 10, clients: 20 },
  venues: { count: 30 },
  bookings: { count: 100 },
  reviews: { count: 150 },
  messages: { count: 200 },
  payments: { count: 80 },
  tasks: { count: 120 }
};

// Test log storage
const testLog = {
  startTime: new Date(),
  results: [],
  errors: [],
  summary: {}
};

// Utility functions
const logTest = (testName, status, details = '') => {
  const logEntry = {
    timestamp: new Date(),
    test: testName,
    status,
    details
  };
  
  testLog.results.push(logEntry);
  
  if (status === 'PASS') {
    console.log(`✅ ${testName}: ${details}`);
  } else if (status === 'FAIL') {
    console.log(`❌ ${testName}: ${details}`);
    testLog.errors.push(logEntry);
  } else {
    console.log(`ℹ️  ${testName}: ${details}`);
  }
};

const generateUserData = (role, index) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    email: faker.internet.email({ firstName, lastName, provider: 'gmail.com' }),
    password: 'TestPassword123!',
    firstName,
    lastName,
    phone: faker.phone.number('+94 7# ### ####'),
    role,
    isVerified: true,
    isActive: true,
    avatar: faker.image.avatar(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    location: {
      city: faker.location.city(),
      country: 'Sri Lanka',
      coordinates: [faker.location.longitude({ min: 79.5, max: 81.9 }), faker.location.latitude({ min: 5.9, max: 9.9 })]
    },
    preferences: {
      weddingStyle: faker.helpers.arrayElement(['Traditional', 'Modern', 'Elegant', 'Rustic', 'Luxury']),
      budget: faker.helpers.arrayElement(['Budget', 'Mid-range', 'Premium', 'Luxury']),
      guestCount: faker.number.int({ min: 50, max: 500 })
    }
  };
};

const generateVendorData = (user, index) => ({
  userId: user._id,
  businessName: faker.company.name(),
  businessType: faker.helpers.arrayElement(['Photography', 'Catering', 'Decoration', 'Music', 'Transport', 'Beauty', 'Flowers']),
  description: faker.lorem.paragraph(),
  services: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: faker.number.float({ min: 1000, max: 50000, precision: 0.01 }),
    duration: faker.number.int({ min: 1, max: 8 })
  })),
  experience: faker.number.int({ min: 1, max: 20 }),
  rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
  totalReviews: faker.number.int({ min: 10, max: 200 }),
  availability: {
    monday: { start: '09:00', end: '18:00', available: true },
    tuesday: { start: '09:00', end: '18:00', available: true },
    wednesday: { start: '09:00', end: '18:00', available: true },
    thursday: { start: '09:00', end: '18:00', available: true },
    friday: { start: '09:00', end: '18:00', available: true },
    saturday: { start: '09:00', end: '16:00', available: true },
    sunday: { start: '10:00', end: '16:00', available: false }
  },
  portfolio: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    imageUrl: faker.image.url(),
    category: faker.helpers.arrayElement(['Wedding', 'Engagement', 'Reception', 'Ceremony'])
  })),
  isVerified: true,
  isActive: true
});

const generateVenueData = (index) => ({
  name: faker.company.name(),
  type: faker.helpers.arrayElement(['Hotel', 'Resort', 'Garden', 'Beach', 'Historic', 'Modern Hall']),
  description: faker.lorem.paragraph(),
  capacity: faker.number.int({ min: 100, max: 1000 }),
  location: {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: 'Sri Lanka',
    coordinates: [faker.location.longitude({ min: 79.5, max: 81.9 }), faker.location.latitude({ min: 5.9, max: 9.9 })]
  },
  amenities: Array.from({ length: faker.number.int({ min: 5, max: 12 }) }, () => 
    faker.helpers.arrayElement(['Parking', 'Catering', 'Decoration', 'Music System', 'Lighting', 'Air Conditioning', 'Garden', 'Pool', 'Beach Access', 'WiFi', 'Security', 'Valet Service'])
  ),
  pricing: {
    weekday: faker.number.float({ min: 50000, max: 500000, precision: 0.01 }),
    weekend: faker.number.float({ min: 75000, max: 750000, precision: 0.01 }),
    holiday: faker.number.float({ min: 100000, max: 1000000, precision: 0.01 })
  },
  images: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
  rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
  totalReviews: faker.number.int({ min: 5, max: 100 }),
  isAvailable: true,
  isVerified: true
});

const generateBookingData = (users, vendors, venues) => {
  const client = faker.helpers.arrayElement(users.filter(u => u.role === 'client'));
  const vendor = faker.helpers.arrayElement(vendors);
  const venue = faker.helpers.arrayElement(venues);
  
  const eventDate = faker.date.future({ years: 1 });
  const bookingDate = faker.date.past({ years: 1, refDate: eventDate });
  
  return {
    clientId: client._id,
    vendorId: vendor._id,
    venueId: venue._id,
    eventType: faker.helpers.arrayElement(['Wedding', 'Engagement', 'Reception', 'Anniversary', 'Birthday']),
    eventDate,
    startTime: faker.date.between({ from: eventDate, to: new Date(eventDate.getTime() + 8 * 60 * 60 * 1000) }),
    endTime: faker.date.between({ from: new Date(eventDate.getTime() + 8 * 60 * 60 * 1000), to: new Date(eventDate.getTime() + 12 * 60 * 60 * 1000) }),
    guestCount: faker.number.int({ min: 50, max: 500 }),
    totalAmount: faker.number.float({ min: 100000, max: 2000000, precision: 0.01 }),
    status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed', 'cancelled']),
    requirements: faker.lorem.paragraph(),
    specialRequests: faker.lorem.sentence(),
    bookingDate,
    paymentStatus: faker.helpers.arrayElement(['pending', 'partial', 'completed']),
    depositAmount: faker.number.float({ min: 10000, max: 200000, precision: 0.01 }),
    remainingAmount: faker.number.float({ min: 0, max: 1000000, precision: 0.01 })
  };
};

const generateReviewData = (users, vendors, venues, bookings) => {
  const reviewer = faker.helpers.arrayElement(users);
  const vendor = faker.helpers.arrayElement(vendors);
  const venue = faker.helpers.arrayElement(venues);
  const booking = faker.helpers.arrayElement(bookings);
  
  return {
    reviewerId: reviewer._id,
    vendorId: vendor._id,
    venueId: venue._id,
    bookingId: booking._id,
    rating: faker.number.int({ min: 1, max: 5 }),
    title: faker.lorem.words(3),
    comment: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(['Service Quality', 'Value for Money', 'Professionalism', 'Communication', 'Overall Experience']),
    isVerified: true,
    helpfulCount: faker.number.int({ min: 0, max: 50 }),
    createdAt: faker.date.past({ years: 1 })
  };
};

const generateMessageData = (users, conversations) => {
  const sender = faker.helpers.arrayElement(users);
  const conversation = faker.helpers.arrayElement(conversations);
  
  return {
    conversationId: conversation._id,
    senderId: sender._id,
    content: faker.lorem.paragraph(),
    messageType: faker.helpers.arrayElement(['text', 'image', 'file']),
    isRead: faker.datatype.boolean(),
    createdAt: faker.date.past({ years: 1 })
  };
};

const generatePaymentData = (bookings) => {
  const booking = faker.helpers.arrayElement(bookings);
  
  return {
    bookingId: booking._id,
    amount: faker.number.float({ min: 10000, max: 500000, precision: 0.01 }),
    currency: 'LKR',
    paymentMethod: faker.helpers.arrayElement(['credit_card', 'debit_card', 'bank_transfer', 'cash', 'digital_wallet']),
    status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'failed', 'refunded']),
    transactionId: faker.string.alphanumeric(16).toUpperCase(),
    paymentDate: faker.date.past({ years: 1 }),
    description: faker.lorem.sentence(),
    gateway: faker.helpers.arrayElement(['stripe', 'paypal', 'payhere', 'bank'])
  };
};

const generateTaskData = (users, bookings) => {
  const assignee = faker.helpers.arrayElement(users);
  const booking = faker.helpers.arrayElement(bookings);
  
  return {
    title: faker.lorem.words(4),
    description: faker.lorem.paragraph(),
    assigneeId: assignee._id,
    bookingId: booking._id,
    priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
    status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'cancelled']),
    dueDate: faker.date.future({ years: 1 }),
    estimatedHours: faker.number.int({ min: 1, max: 8 }),
    actualHours: faker.number.int({ min: 0, max: 10 }),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => 
      faker.helpers.arrayElement(['Planning', 'Decoration', 'Catering', 'Music', 'Photography', 'Transport', 'Beauty'])
    ),
    createdAt: faker.date.past({ years: 1 })
  };
};

// Main seeding function
const seedDatabase = async () => {
  try {
    logTest('Database Connection', 'INFO', 'Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk');
    logTest('Database Connection', 'PASS', 'Successfully connected to MongoDB');
    
    // Clear existing data
    logTest('Data Cleanup', 'INFO', 'Clearing existing test data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Message.deleteMany({}),
      Conversation.deleteMany({}),
      Notification.deleteMany({}),
      Payment.deleteMany({}),
      Task.deleteMany({}),
      Client.deleteMany({}),
      VendorProfile.deleteMany({}),
      WeddingPlannerProfile.deleteMany({}),
      Document.deleteMany({})
    ]);
    logTest('Data Cleanup', 'PASS', 'All existing data cleared');
    
    // Create users
    logTest('User Creation', 'INFO', `Creating ${TEST_CONFIG.users.count} users...`);
    const users = [];
    
    // Create clients
    for (let i = 0; i < TEST_CONFIG.users.clients; i++) {
      const userData = generateUserData('client', i);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      users.push(user);
    }
    
    // Create vendors
    for (let i = 0; i < TEST_CONFIG.users.vendors; i++) {
      const userData = generateUserData('vendor', i);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      users.push(user);
    }
    
    // Create planners
    for (let i = 0; i < TEST_CONFIG.users.planners; i++) {
      const userData = generateUserData('planner', i);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      users.push(user);
    }
    
    logTest('User Creation', 'PASS', `Created ${users.length} users successfully`);
    
    // Create vendor profiles
    logTest('Vendor Profile Creation', 'INFO', `Creating ${TEST_CONFIG.users.vendors} vendor profiles...`);
    const vendors = [];
    const vendorUsers = users.filter(u => u.role === 'vendor');
    
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendorData = generateVendorData(vendorUsers[i], i);
      const vendor = new Vendor(vendorData);
      await vendor.save();
      vendors.push(vendor);
    }
    logTest('Vendor Profile Creation', 'PASS', `Created ${vendors.length} vendor profiles successfully`);
    
    // Create venues
    logTest('Venue Creation', 'INFO', `Creating ${TEST_CONFIG.venues.count} venues...`);
    const venues = [];
    
    for (let i = 0; i < TEST_CONFIG.venues.count; i++) {
      const venueData = generateVenueData(i);
      const venue = new Venue(venueData);
      await venue.save();
      venues.push(venue);
    }
    logTest('Venue Creation', 'PASS', `Created ${venues.length} venues successfully`);
    
    // Create bookings
    logTest('Booking Creation', 'INFO', `Creating ${TEST_CONFIG.bookings.count} bookings...`);
    const bookings = [];
    
    for (let i = 0; i < TEST_CONFIG.bookings.count; i++) {
      const bookingData = generateBookingData(users, vendors, venues);
      const booking = new Booking(bookingData);
      await booking.save();
      bookings.push(booking);
    }
    logTest('Booking Creation', 'PASS', `Created ${bookings.length} bookings successfully`);
    
    // Create reviews
    logTest('Review Creation', 'INFO', `Creating ${TEST_CONFIG.reviews.count} reviews...`);
    const reviews = [];
    
    for (let i = 0; i < TEST_CONFIG.reviews.count; i++) {
      const reviewData = generateReviewData(users, vendors, venues, bookings);
      const review = new Review(reviewData);
      await review.save();
      reviews.push(review);
    }
    logTest('Review Creation', 'PASS', `Created ${reviews.length} reviews successfully`);
    
    // Create conversations
    logTest('Conversation Creation', 'INFO', 'Creating conversations...');
    const conversations = [];
    
    for (let i = 0; i < bookings.length; i++) {
      const conversation = new Conversation({
        participants: [bookings[i].clientId, bookings[i].vendorId],
        bookingId: bookings[i]._id,
        lastMessage: faker.lorem.sentence(),
        lastMessageAt: faker.date.past({ years: 1 }),
        isActive: true
      });
      await conversation.save();
      conversations.push(conversation);
    }
    logTest('Conversation Creation', 'PASS', `Created ${conversations.length} conversations successfully`);
    
    // Create messages
    logTest('Message Creation', 'INFO', `Creating ${TEST_CONFIG.messages.count} messages...`);
    const messages = [];
    
    for (let i = 0; i < TEST_CONFIG.messages.count; i++) {
      const messageData = generateMessageData(users, conversations);
      const message = new Message(messageData);
      await message.save();
      messages.push(message);
    }
    logTest('Message Creation', 'PASS', `Created ${messages.length} messages successfully`);
    
    // Create payments
    logTest('Payment Creation', 'INFO', `Creating ${TEST_CONFIG.payments.count} payments...`);
    const payments = [];
    
    for (let i = 0; i < TEST_CONFIG.payments.count; i++) {
      const paymentData = generatePaymentData(bookings);
      const payment = new Payment(paymentData);
      await payment.save();
      payments.push(payment);
    }
    logTest('Payment Creation', 'PASS', `Created ${payments.length} payments successfully`);
    
    // Create tasks
    logTest('Task Creation', 'INFO', `Creating ${TEST_CONFIG.tasks.count} tasks...`);
    const tasks = [];
    
    for (let i = 0; i < TEST_CONFIG.tasks.count; i++) {
      const taskData = generateTaskData(users, bookings);
      const task = new Task(taskData);
      await task.save();
      tasks.push(task);
    }
    logTest('Task Creation', 'PASS', `Created ${tasks.length} tasks successfully`);
    
    // Generate summary
    testLog.summary = {
      users: users.length,
      vendors: vendors.length,
      venues: venues.length,
      bookings: bookings.length,
      reviews: reviews.length,
      conversations: conversations.length,
      messages: messages.length,
      payments: payments.length,
      tasks: tasks.length
    };
    
    logTest('Database Seeding', 'PASS', 'All test data created successfully!');
    
    // Display summary
    console.log('\n📊 DATABASE SEEDING SUMMARY:');
    console.log('================================');
    Object.entries(testLog.summary).forEach(([key, value]) => {
      console.log(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
    });
    
    // Save test log
    const fs = await import('fs');
    const logData = {
      ...testLog,
      endTime: new Date(),
      duration: new Date() - testLog.startTime
    };
    
    fs.writeFileSync('test-seeding-log.json', JSON.stringify(logData, null, 2));
    logTest('Log Export', 'PASS', 'Test log saved to test-seeding-log.json');
    
  } catch (error) {
    logTest('Database Seeding', 'FAIL', error.message);
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    logTest('Database Connection', 'INFO', 'Disconnected from MongoDB');
  }
};

// Run the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase; 