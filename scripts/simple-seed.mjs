#!/usr/bin/env node

// ========================================
// WEDDINGLK SIMPLE DATABASE SEEDING
// Basic seeding script for testing
// ========================================

import mongoose from 'mongoose';

// Database connection
const MONGODB_URI = 'mongodb://admin:password123@mongodb:27017/weddinglk?authSource=admin';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Simple User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date
});

// Simple Vendor Schema
const vendorSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  businessName: String,
  businessType: String,
  category: String,
  description: String,
  rating: Number,
  totalReviews: Number,
  isVerified: Boolean,
  isActive: Boolean
});

// Simple Venue Schema
const venueSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  type: String,
  capacity: Number,
  priceRange: {
    min: Number,
    max: Number
  },
  isAvailable: Boolean,
  rating: Number
});

// Create models
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Venue = mongoose.model('Venue', venueSchema);

// Generate simple data
function generateSimpleUser(role = 'user', index) {
  return {
    username: `user${index}`,
    email: `user${index}@example.com`,
    password: 'password123',
    firstName: `User${index}`,
    lastName: 'Example',
    role,
    isVerified: true,
    isActive: true,
    createdAt: new Date()
  };
}

function generateSimpleVendor(userId, index) {
  const types = ['Photography', 'Videography', 'Catering', 'Music', 'Decoration'];
  return {
    userId,
    businessName: `Vendor ${index}`,
    businessType: types[index % types.length],
    category: 'Standard',
    description: `This is vendor ${index}`,
    rating: 4.0 + (index % 10) * 0.1,
    totalReviews: 10 + (index % 50),
    isVerified: true,
    isActive: true
  };
}

function generateSimpleVenue(userId, index) {
  const types = ['Hotel', 'Restaurant', 'Garden', 'Beach', 'Barn'];
  return {
    userId,
    name: `Venue ${index}`,
    description: `This is venue ${index}`,
    type: types[index % types.length],
    capacity: 100 + (index % 200),
    priceRange: {
      min: 2000 + (index % 5000),
      max: 10000 + (index % 20000)
    },
    isAvailable: true,
    rating: 4.0 + (index % 10) * 0.1
  };
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🚀 Starting simple database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Venue.deleteMany({});
    console.log('✅ Database cleared');
    
    // Generate users
    console.log('👥 Generating users...');
    const users = [];
    
    // Generate regular users
    for (let i = 1; i <= 30; i++) {
      const user = new User(generateSimpleUser('user', i));
      users.push(await user.save());
    }
    
    // Generate vendors
    for (let i = 1; i <= 10; i++) {
      const user = new User(generateSimpleUser('vendor', i));
      users.push(await user.save());
    }
    
    // Generate admin
    const adminUser = new User(generateSimpleUser('admin', 'admin'));
    users.push(await adminUser.save());
    
    console.log(`✅ Generated ${users.length} users`);
    
    // Generate vendors
    console.log('🏢 Generating vendors...');
    const vendorUsers = users.filter(u => u.role === 'vendor');
    const vendors = [];
    
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendor = new Vendor(generateSimpleVendor(vendorUsers[i]._id, i + 1));
      vendors.push(await vendor.save());
    }
    
    console.log(`✅ Generated ${vendors.length} vendors`);
    
    // Generate venues
    console.log('🏰 Generating venues...');
    const venueUsers = users.filter(u => u.role === 'user').slice(0, 10);
    const venues = [];
    
    for (let i = 0; i < venueUsers.length; i++) {
      const venue = new Venue(generateSimpleVenue(venueUsers[i]._id, i + 1));
      venues.push(await venue.save());
    }
    
    console.log(`✅ Generated ${venues.length} venues`);
    
    // Summary
    console.log('\n🎉 SIMPLE DATABASE SEEDING COMPLETED!');
    console.log('=====================================');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏢 Vendors: ${vendors.length}`);
    console.log(`🏰 Venues: ${venues.length}`);
    console.log('\n🔑 DEFAULT LOGIN CREDENTIALS:');
    console.log('=====================================');
    console.log('👑 Admin User:');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123');
    console.log('\n👤 Regular Users:');
    console.log('   Email: user1@example.com, user2@example.com, etc.');
    console.log('   Password: password123');
    console.log('\n🏢 Vendor Users:');
    console.log('   Email: vendor1@example.com, vendor2@example.com, etc.');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding
seedDatabase(); 