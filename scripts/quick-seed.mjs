#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🚀 Starting Quick Database Seeding...');

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create a simple test collection
    const testSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestUser = mongoose.model('TestUser', testSchema);
    
    console.log('🧹 Clearing existing test data...');
    await TestUser.deleteMany({});
    
    console.log('👥 Creating test users...');
    const testUsers = [
      { name: 'John Doe', email: 'john@example.com', role: 'client' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'vendor' },
      { name: 'Bob Johnson', email: 'bob@example.com', role: 'planner' }
    ];
    
    for (const userData of testUsers) {
      const user = new TestUser(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.name}`);
    }
    
    // Count total users
    const totalUsers = await TestUser.countDocuments();
    console.log(`📊 Total test users created: ${totalUsers}`);
    
    console.log('🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedDatabase(); 