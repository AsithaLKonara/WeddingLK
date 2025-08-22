#!/usr/bin/env node

// ========================================
// ADMIN USER SETUP SCRIPT
// Creates default admin user for WeddingLK
// ========================================

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/weddinglk?authSource=admin';
const DB_NAME = 'weddinglk';

async function setupAdminUser() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@weddinglk.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@weddinglk.com');
      console.log('🔑 Password: admin123');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      email: 'admin@weddinglk.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@weddinglk.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

setupAdminUser(); 