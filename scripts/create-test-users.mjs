#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

console.log('🔐 Creating Test User Accounts for Manual Testing...');

const createTestUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create schemas
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String,
      isVerified: Boolean,
      isActive: Boolean,
      avatar: String,
      location: Object,
      preferences: Object,
      createdAt: Date
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Test user data
    const testUsers = [
      {
        email: 'admin@weddinglk.test',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: { city: 'Colombo', country: 'Sri Lanka' },
        preferences: { theme: 'dark' }
      },
      {
        email: 'client@weddinglk.test',
        password: 'client123',
        firstName: 'Test',
        lastName: 'Client',
        role: 'client',
        isVerified: true,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        location: { city: 'Colombo', country: 'Sri Lanka' },
        preferences: { 
          weddingStyle: 'Modern',
          budget: 'Mid-range',
          guestCount: 150
        }
      },
      {
        email: 'vendor@weddinglk.test',
        password: 'vendor123',
        firstName: 'Test',
        lastName: 'Vendor',
        role: 'vendor',
        isVerified: true,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        location: { city: 'Colombo', country: 'Sri Lanka' },
        preferences: { businessType: 'Photography' }
      },
      {
        email: 'planner@weddinglk.test',
        password: 'planner123',
        firstName: 'Test',
        lastName: 'Planner',
        role: 'planner',
        isVerified: true,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        location: { city: 'Colombo', country: 'Sri Lanka' },
        preferences: { specialization: 'Luxury Weddings' }
      }
    ];
    
    console.log('🧹 Clearing existing test users...');
    await User.deleteMany({ 
      email: { 
        $in: testUsers.map(u => u.email) 
      } 
    });
    
    console.log('👥 Creating test users...');
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new User({
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
      });
      
      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.email} (Password: ${userData.password})`);
    }
    
    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 LOGIN CREDENTIALS FOR MANUAL TESTING:');
    console.log('==========================================');
    console.log('🔐 Admin User:');
    console.log('   Email: admin@weddinglk.test');
    console.log('   Password: admin123');
    console.log('   Role: Administrator');
    console.log('');
    console.log('👰 Client User:');
    console.log('   Email: client@weddinglk.test');
    console.log('   Password: client123');
    console.log('   Role: Wedding Client');
    console.log('');
    console.log('🏢 Vendor User:');
    console.log('   Email: vendor@weddinglk.test');
    console.log('   Password: vendor123');
    console.log('   Role: Service Vendor');
    console.log('');
    console.log('📋 Planner User:');
    console.log('   Email: planner@weddinglk.test');
    console.log('   Password: planner123');
    console.log('   Role: Wedding Planner');
    console.log('');
    console.log('🌐 Application URL: http://localhost:3000');
    console.log('📊 MongoDB Express: http://localhost:8081 (admin/admin123)');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createTestUsers(); 