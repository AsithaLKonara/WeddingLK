#!/usr/bin/env node

// ========================================
// WEDDINGLK BASIC MONGODB SEEDING
// Direct MongoDB driver seeding
// ========================================

import { MongoClient } from 'mongodb';

// Database connection
const MONGODB_URI = 'mongodb://admin:password123@mongodb:27017/weddinglk?authSource=admin';

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    return client.db('weddinglk');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Generate simple data
function generateUser(role = 'user', index) {
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

function generateVendor(userId, index) {
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

function generateVenue(userId, index) {
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
  let client;
  try {
    console.log('🚀 Starting basic MongoDB seeding...');
    
    const db = await connectDB();
    client = db.client;
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('vendors').deleteMany({});
    await db.collection('venues').deleteMany({});
    console.log('✅ Database cleared');
    
    // Generate users
    console.log('👥 Generating users...');
    const users = [];
    
    // Generate regular users
    for (let i = 1; i <= 30; i++) {
      const user = generateUser('user', i);
      const result = await db.collection('users').insertOne(user);
      users.push({ ...user, _id: result.insertedId });
    }
    
    // Generate vendors
    for (let i = 1; i <= 10; i++) {
      const user = generateUser('vendor', i);
      const result = await db.collection('users').insertOne(user);
      users.push({ ...user, _id: result.insertedId });
    }
    
    // Generate admin
    const adminUser = generateUser('admin', 'admin');
    const adminResult = await db.collection('users').insertOne(adminUser);
    users.push({ ...adminUser, _id: adminResult.insertedId });
    
    console.log(`✅ Generated ${users.length} users`);
    
    // Generate vendors
    console.log('🏢 Generating vendors...');
    const vendorUsers = users.filter(u => u.role === 'vendor');
    const vendors = [];
    
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendor = generateVendor(vendorUsers[i]._id, i + 1);
      const result = await db.collection('vendors').insertOne(vendor);
      vendors.push({ ...vendor, _id: result.insertedId });
    }
    
    console.log(`✅ Generated ${vendors.length} vendors`);
    
    // Generate venues
    console.log('🏰 Generating venues...');
    const venueUsers = users.filter(u => u.role === 'user').slice(0, 10);
    const venues = [];
    
    for (let i = 0; i < venueUsers.length; i++) {
      const venue = generateVenue(venueUsers[i]._id, i + 1);
      const result = await db.collection('venues').insertOne(venue);
      venues.push({ ...venue, _id: result.insertedId });
    }
    
    console.log(`✅ Generated ${venues.length} venues`);
    
    // Summary
    console.log('\n🎉 BASIC MONGODB SEEDING COMPLETED!');
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
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run seeding
seedDatabase(); 