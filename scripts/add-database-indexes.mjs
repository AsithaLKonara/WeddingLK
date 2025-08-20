#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🚀 Adding Performance Database Indexes...');

const addIndexes = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    console.log('📊 Adding vendor indexes...');
    
    // Text search indexes for vendors
    try {
      await db.collection('vendors').createIndex({
        businessName: "text",
        description: "text",
        businessType: "text"
      }, { name: "vendor_text_search" });
      console.log('✅ Vendor text search index added');
    } catch (e) {
      if (e.code === 85) console.log('ℹ️ Vendor text search index already exists');
      else console.log('⚠️ Vendor text search index error:', e.message);
    }
    
    // Performance indexes for vendors
    const vendorIndexes = [
      { businessType: 1 },
      { rating: -1 },
      { isVerified: 1 },
      { isActive: 1 },
      { experience: -1 }
    ];
    
    for (const index of vendorIndexes) {
      try {
        await db.collection('vendors').createIndex(index);
        console.log(`✅ Vendor index added: ${Object.keys(index).join(', ')}`);
      } catch (e) {
        if (e.code === 85) console.log(`ℹ️ Vendor index already exists: ${Object.keys(index).join(', ')}`);
        else console.log(`⚠️ Vendor index error: ${Object.keys(index).join(', ')} - ${e.message}`);
      }
    }
    
    console.log('🏛️ Adding venue indexes...');
    
    // Text search indexes for venues
    try {
      await db.collection('venues').createIndex({
        name: "text",
        description: "text",
        type: "text"
      }, { name: "venue_text_search" });
      console.log('✅ Venue text search index added');
    } catch (e) {
      if (e.code === 85) console.log('ℹ️ Venue text search index already exists');
      else console.log('⚠️ Venue text search index error:', e.message);
    }
    
    // Performance indexes for venues
    const venueIndexes = [
      { type: 1 },
      { rating: -1 },
      { capacity: 1 },
      { isAvailable: 1 },
      { isVerified: 1 }
    ];
    
    for (const index of venueIndexes) {
      try {
        await db.collection('venues').createIndex(index);
        console.log(`✅ Venue index added: ${Object.keys(index).join(', ')}`);
      } catch (e) {
        if (e.code === 85) console.log(`ℹ️ Venue index already exists: ${Object.keys(index).join(', ')}`);
        else console.log(`⚠️ Venue index error: ${Object.keys(index).join(', ')} - ${e.message}`);
      }
    }
    
    console.log('📅 Adding booking indexes...');
    
    // Performance indexes for bookings
    const bookingIndexes = [
      { status: 1 },
      { eventDate: 1 },
      { clientId: 1 },
      { vendorId: 1 },
      { venueId: 1 }
    ];
    
    for (const index of bookingIndexes) {
      try {
        await db.collection('bookings').createIndex(index);
        console.log(`✅ Booking index added: ${Object.keys(index).join(', ')}`);
      } catch (e) {
        if (e.code === 85) console.log(`ℹ️ Booking index already exists: ${Object.keys(index).join(', ')}`);
        else console.log(`⚠️ Booking index error: ${Object.keys(index).join(', ')} - ${e.message}`);
      }
    }
    
    console.log('⭐ Adding review indexes...');
    
    // Performance indexes for reviews
    const reviewIndexes = [
      { rating: -1 },
      { vendorId: 1 },
      { venueId: 1 },
      { isVerified: 1 },
      { createdAt: -1 }
    ];
    
    for (const index of reviewIndexes) {
      try {
        await db.collection('reviews').createIndex(index);
        console.log(`✅ Review index added: ${Object.keys(index).join(', ')}`);
      } catch (e) {
        if (e.code === 85) console.log(`ℹ️ Review index already exists: ${Object.keys(index).join(', ')}`);
        else console.log(`⚠️ Review index error: ${Object.keys(index).join(', ')} - ${e.message}`);
      }
    }
    
    console.log('✅ All performance indexes processed!');
    
    // Show index information
    console.log('\n📋 Index Summary:');
    const collections = ['vendors', 'venues', 'bookings', 'reviews'];
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`\n${collectionName.toUpperCase()}:`);
      indexes.forEach(index => {
        const keys = Object.keys(index.key).map(k => `${k}:${index.key[k]}`).join(', ');
        console.log(`  - ${index.name}: ${keys}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error adding indexes:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

addIndexes(); 