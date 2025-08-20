#!/usr/bin/env node

/**
 * Simple Database Seeding Script for WeddingLK
 * Creates basic test data for testing purposes
 */

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Test configuration
const TEST_CONFIG = {
  users: 20,
  vendors: 10,
  venues: 15,
  bookings: 30,
  reviews: 25
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

// Main seeding function
const seedDatabase = async () => {
  try {
    logTest('Database Connection', 'INFO', 'Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weddinglk');
    logTest('Database Connection', 'PASS', 'Successfully connected to MongoDB');
    
    // Clear existing data
    logTest('Data Cleanup', 'INFO', 'Clearing existing test data...');
    
    // Get all collections and clear them
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
    }
    
    logTest('Data Cleanup', 'PASS', 'All existing data cleared');
    
    // Create users
    logTest('User Creation', 'INFO', `Creating ${TEST_CONFIG.users} users...`);
    const users = [];
    
    // Create clients
    for (let i = 0; i < Math.floor(TEST_CONFIG.users * 0.6); i++) {
      const userData = generateUserData('client', i);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new mongoose.models.User || new mongoose.model('User', new mongoose.Schema({}));
      user.set(userData);
      user.password = hashedPassword;
      await user.save();
      users.push(user);
    }
    
    // Create vendors
    for (let i = 0; i < Math.floor(TEST_CONFIG.users * 0.3); i++) {
      const userData = generateUserData('vendor', i);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new mongoose.models.User || new mongoose.model('User', new mongoose.Schema({}));
      user.set(userData);
      user.password = hashedPassword;
      await user.save();
      users.push(user);
    }
    
    // Create planners
    for (let i = 0; i < Math.floor(TEST_CONFIG.users * 0.1); i++) {
      const userData = generateUserData('planner', i);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new mongoose.models.User || new mongoose.model('User', new mongoose.Schema({}));
      user.set(userData);
      user.password = hashedPassword;
      await user.save();
      users.push(user);
    }
    
    logTest('User Creation', 'PASS', `Created ${users.length} users successfully`);
    
    // Create venues
    logTest('Venue Creation', 'INFO', `Creating ${TEST_CONFIG.venues} venues...`);
    const venues = [];
    
    for (let i = 0; i < TEST_CONFIG.venues; i++) {
      const venueData = generateVenueData(i);
      const venue = new mongoose.models.Venue || new mongoose.model('Venue', new mongoose.Schema({}));
      venue.set(venueData);
      await venue.save();
      venues.push(venue);
    }
    logTest('Venue Creation', 'PASS', `Created ${venues.length} venues successfully`);
    
    // Create vendors (simplified)
    logTest('Vendor Creation', 'INFO', `Creating ${TEST_CONFIG.vendors} vendors...`);
    const vendors = [];
    const vendorUsers = users.filter(u => u.role === 'vendor');
    
    for (let i = 0; i < Math.min(vendorUsers.length, TEST_CONFIG.vendors); i++) {
      const vendorData = generateVendorData(vendorUsers[i], i);
      const vendor = new mongoose.models.Vendor || new mongoose.model('Vendor', new mongoose.Schema({}));
      vendor.set(vendorData);
      await vendor.save();
      vendors.push(vendor);
    }
    logTest('Vendor Creation', 'PASS', `Created ${vendors.length} vendors successfully`);
    
    // Create bookings
    logTest('Booking Creation', 'INFO', `Creating ${TEST_CONFIG.bookings} bookings...`);
    const bookings = [];
    
    for (let i = 0; i < TEST_CONFIG.bookings; i++) {
      const bookingData = generateBookingData(users, vendors, venues);
      const booking = new mongoose.models.Booking || new mongoose.model('Booking', new mongoose.Schema({}));
      booking.set(bookingData);
      await booking.save();
      bookings.push(booking);
    }
    logTest('Booking Creation', 'PASS', `Created ${bookings.length} bookings successfully`);
    
    // Create reviews
    logTest('Review Creation', 'INFO', `Creating ${TEST_CONFIG.reviews} reviews...`);
    const reviews = [];
    
    for (let i = 0; i < TEST_CONFIG.reviews; i++) {
      const reviewData = generateReviewData(users, vendors, venues, bookings);
      const review = new mongoose.models.Review || new mongoose.model('Review', new mongoose.Schema({}));
      review.set(reviewData);
      await review.save();
      reviews.push(review);
    }
    logTest('Review Creation', 'PASS', `Created ${reviews.length} reviews successfully`);
    
    // Generate summary
    testLog.summary = {
      users: users.length,
      vendors: vendors.length,
      venues: venues.length,
      bookings: bookings.length,
      reviews: reviews.length
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