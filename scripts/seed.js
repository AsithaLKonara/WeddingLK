const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/weddinglk_dev?authSource=admin';

// Simple seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting WeddingLK Database Seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create 3 admin users
    console.log('🌐 Creating admin users...');
    const adminUsers = [
      {
        email: 'admin@weddinglk.com',
        password: await bcrypt.hash('admin123', 12),
        name: 'System Administrator',
        role: 'admin',
        roleVerified: true,
        location: { country: 'Sri Lanka', state: 'Western Province', city: 'Colombo' },
        preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo' },
        isEmailVerified: true,
        status: 'active'
      },
      {
        email: 'superadmin@weddinglk.com',
        password: await bcrypt.hash('super123', 12),
        name: 'Super Administrator',
        role: 'admin',
        roleVerified: true,
        location: { country: 'Sri Lanka', state: 'Central Province', city: 'Kandy' },
        preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo' },
        isEmailVerified: true,
        status: 'active'
      },
      {
        email: 'maintainer@weddinglk.com',
        password: await bcrypt.hash('maintain123', 12),
        name: 'System Maintainer',
        role: 'maintainer',
        roleVerified: true,
        location: { country: 'Sri Lanka', state: 'Southern Province', city: 'Galle' },
        preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo' },
        isEmailVerified: true,
        status: 'active'
      }
    ];

    // Import User model dynamically
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      roleVerified: Boolean,
      location: Object,
      preferences: Object,
      isEmailVerified: Boolean,
      status: String
    }));

    for (const adminData of adminUsers) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (!existingAdmin) {
        await User.create(adminData);
        console.log(`✅ Created admin: ${adminData.email}`);
      } else {
        console.log(`⚠️ Admin already exists: ${adminData.email}`);
      }
    }

    console.log('🎉 Database seeding completed!');
    console.log('🎓 Your WeddingLK database is ready for the university presentation!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding
seedDatabase();
