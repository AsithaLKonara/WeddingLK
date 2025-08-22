#!/usr/bin/env node

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://admin:password123@mongodb:27017/weddinglk?authSource=admin';

async function checkDatabase() {
  let client;
  try {
    console.log('🔍 Checking database content...');
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('weddinglk');
    
    const userCount = await db.collection('users').countDocuments();
    const vendorCount = await db.collection('vendors').countDocuments();
    const venueCount = await db.collection('venues').countDocuments();
    const bookingCount = await db.collection('bookings').countDocuments();
    const reviewCount = await db.collection('reviews').countDocuments();
    
    console.log('\n📊 DATABASE CONTENT:');
    console.log('=====================================');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏢 Vendors: ${vendorCount}`);
    console.log(`🏰 Venues: ${venueCount}`);
    console.log(`📅 Bookings: ${bookingCount}`);
    console.log(`⭐ Reviews: ${reviewCount}`);
    
    if (userCount > 0) {
      console.log('\n👤 Sample Users:');
      const users = await db.collection('users').find({}).limit(3).toArray();
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

checkDatabase(); 