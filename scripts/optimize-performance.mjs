#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createPerformanceIndexes } from '../lib/models/index.js';

dotenv.config({ path: '.env.local' });

console.log('🚀 WeddingLK Performance Optimization Script');
console.log('==========================================\n');

const optimizePerformance = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create performance indexes
    console.log('\n📊 Creating performance indexes...');
    await createPerformanceIndexes();
    
    // Test query performance
    console.log('\n🧪 Testing query performance...');
    
    // Test User query performance
    const userStart = Date.now();
    const users = await mongoose.model('User').find({ role: 'client' }).limit(10).lean();
    const userTime = Date.now() - userStart;
    console.log(`✅ User query: ${userTime}ms (${users.length} results)`);
    
    // Test Vendor query performance
    const vendorStart = Date.now();
    const vendors = await mongoose.model('Vendor').find({ isVerified: true }).limit(10).lean();
    const vendorTime = Date.now() - vendorStart;
    console.log(`✅ Vendor query: ${vendorTime}ms (${vendors.length} results)`);
    
    // Test Venue query performance
    const venueStart = Date.now();
    const venues = await mongoose.model('Venue').find({ isAvailable: true }).limit(10).lean();
    const venueTime = Date.now() - venueStart;
    console.log(`✅ Venue query: ${venueTime}ms (${venues.length} results)`);
    
    // Test Booking query performance
    const bookingStart = Date.now();
    const bookings = await mongoose.model('Booking').find({ status: 'confirmed' }).limit(10).lean();
    const bookingTime = Date.now() - bookingStart;
    console.log(`✅ Booking query: ${bookingTime}ms (${bookings.length} results)`);
    
    // Performance summary
    console.log('\n📈 PERFORMANCE SUMMARY:');
    console.log('========================');
    console.log(`User Queries: ${userTime}ms`);
    console.log(`Vendor Queries: ${vendorTime}ms`);
    console.log(`Venue Queries: ${venueTime}ms`);
    console.log(`Booking Queries: ${bookingTime}ms`);
    
    const avgTime = Math.round((userTime + vendorTime + venueTime + bookingTime) / 4);
    console.log(`\nAverage Query Time: ${avgTime}ms`);
    
    if (avgTime < 100) {
      console.log('🎉 Excellent performance! Queries are running fast.');
    } else if (avgTime < 500) {
      console.log('✅ Good performance! Queries are running reasonably fast.');
        } else {
      console.log('⚠️ Performance needs improvement. Consider additional optimizations.');
    }
    
    console.log('\n💡 Performance optimization completed!');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

optimizePerformance();
