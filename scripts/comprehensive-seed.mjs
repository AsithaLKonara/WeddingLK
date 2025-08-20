#!/usr/bin/env node

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🚀 Starting Comprehensive Database Seeding...');

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create schemas for seeding
    const userSchema = new mongoose.Schema({
      email: String,
      firstName: String,
      lastName: String,
      role: String,
      isVerified: Boolean,
      isActive: Boolean,
      avatar: String,
      location: Object,
      preferences: Object
    });
    
    const vendorSchema = new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      businessName: String,
      businessType: String,
      description: String,
      services: Array,
      experience: Number,
      rating: Number,
      totalReviews: Number,
      availability: Object,
      portfolio: Array,
      isVerified: Boolean,
      isActive: Boolean
    });
    
    const venueSchema = new mongoose.Schema({
      name: String,
      type: String,
      description: String,
      capacity: Number,
      location: Object,
      amenities: Array,
      pricing: Object,
      images: Array,
      rating: Number,
      totalReviews: Number,
      isAvailable: Boolean,
      isVerified: Boolean
    });
    
    const bookingSchema = new mongoose.Schema({
      clientId: mongoose.Schema.Types.ObjectId,
      vendorId: mongoose.Schema.Types.ObjectId,
      venueId: mongoose.Schema.Types.ObjectId,
      eventType: String,
      eventDate: Date,
      guestCount: Number,
      totalAmount: Number,
      status: String,
      requirements: String,
      bookingDate: Date,
      paymentStatus: String
    });
    
    const reviewSchema = new mongoose.Schema({
      reviewerId: mongoose.Schema.Types.ObjectId,
      vendorId: mongoose.Schema.Types.ObjectId,
      venueId: mongoose.Schema.Types.ObjectId,
      rating: Number,
      title: String,
      comment: String,
      category: String,
      isVerified: Boolean,
      createdAt: Date
    });
    
    // Create models
    const User = mongoose.model('User', userSchema);
    const Vendor = mongoose.model('Vendor', vendorSchema);
    const Venue = mongoose.model('Venue', venueSchema);
    const Booking = mongoose.model('Booking', bookingSchema);
    const Review = mongoose.model('Review', reviewSchema);
    
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({})
    ]);
    
    console.log('👥 Creating users...');
    const users = [];
    
    // Create clients
    for (let i = 0; i < 15; i++) {
      const user = new User({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: 'client',
        isVerified: true,
        isActive: true,
        avatar: faker.image.avatar(),
        location: {
          city: faker.location.city(),
          country: 'Sri Lanka'
        },
        preferences: {
          weddingStyle: faker.helpers.arrayElement(['Traditional', 'Modern', 'Elegant', 'Rustic']),
          budget: faker.helpers.arrayElement(['Budget', 'Mid-range', 'Premium']),
          guestCount: faker.number.int({ min: 50, max: 300 })
        }
      });
      await user.save();
      users.push(user);
      console.log(`✅ Created client: ${user.firstName} ${user.lastName}`);
    }
    
    // Create vendors
    for (let i = 0; i < 20; i++) {
      const user = new User({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: 'vendor',
        isVerified: true,
        isActive: true,
        avatar: faker.image.avatar(),
        location: {
          city: faker.location.city(),
          country: 'Sri Lanka'
        }
      });
      await user.save();
      users.push(user);
      console.log(`✅ Created vendor user: ${user.firstName} ${user.lastName}`);
    }
    
    // Create planners
    for (let i = 0; i < 5; i++) {
      const user = new User({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: 'planner',
        isVerified: true,
        isActive: true,
        avatar: faker.image.avatar(),
        location: {
          city: faker.location.city(),
          country: 'Sri Lanka'
        }
      });
      await user.save();
      users.push(user);
      console.log(`✅ Created planner: ${user.firstName} ${user.lastName}`);
    }
    
    console.log('🏢 Creating vendors...');
    const vendors = [];
    const vendorUsers = users.filter(u => u.role === 'vendor');
    
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendor = new Vendor({
        userId: vendorUsers[i]._id,
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
      await vendor.save();
      vendors.push(vendor);
      console.log(`✅ Created vendor: ${vendor.businessName}`);
    }
    
    console.log('🏛️ Creating venues...');
    const venues = [];
    
    for (let i = 0; i < 25; i++) {
      const venue = new Venue({
        name: faker.company.name(),
        type: faker.helpers.arrayElement(['Hotel', 'Resort', 'Garden', 'Beach', 'Historic', 'Modern Hall']),
        description: faker.lorem.paragraph(),
        capacity: faker.number.int({ min: 100, max: 1000 }),
        location: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          country: 'Sri Lanka'
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
      await venue.save();
      venues.push(venue);
      console.log(`✅ Created venue: ${venue.name}`);
    }
    
    console.log('📅 Creating bookings...');
    const bookings = [];
    
    for (let i = 0; i < 30; i++) {
      const client = faker.helpers.arrayElement(users.filter(u => u.role === 'client'));
      const vendor = faker.helpers.arrayElement(vendors);
      const venue = faker.helpers.arrayElement(venues);
      
      const booking = new Booking({
        clientId: client._id,
        vendorId: vendor._id,
        venueId: venue._id,
        eventType: faker.helpers.arrayElement(['Wedding', 'Engagement', 'Reception', 'Anniversary', 'Birthday']),
        eventDate: faker.date.future({ years: 1 }),
        guestCount: faker.number.int({ min: 50, max: 500 }),
        totalAmount: faker.number.float({ min: 100000, max: 2000000, precision: 0.01 }),
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed', 'cancelled']),
        requirements: faker.lorem.paragraph(),
        bookingDate: faker.date.past({ years: 1 }),
        paymentStatus: faker.helpers.arrayElement(['pending', 'partial', 'completed'])
      });
      await booking.save();
      bookings.push(booking);
      console.log(`✅ Created booking: ${booking.eventType} for ${client.firstName}`);
    }
    
    console.log('⭐ Creating reviews...');
    const reviews = [];
    
    for (let i = 0; i < 40; i++) {
      const reviewer = faker.helpers.arrayElement(users);
      const vendor = faker.helpers.arrayElement(vendors);
      const venue = faker.helpers.arrayElement(venues);
      const booking = faker.helpers.arrayElement(bookings);
      
      const review = new Review({
        reviewerId: reviewer._id,
        vendorId: vendor._id,
        venueId: venue._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        title: faker.lorem.words(3),
        comment: faker.lorem.paragraph(),
        category: faker.helpers.arrayElement(['Service Quality', 'Value for Money', 'Professionalism', 'Communication', 'Overall Experience']),
        isVerified: true,
        createdAt: faker.date.past({ years: 1 })
      });
      await review.save();
      reviews.push(review);
      console.log(`✅ Created review: ${review.title}`);
    }
    
    // Display summary
    console.log('\n📊 DATABASE SEEDING SUMMARY:');
    console.log('================================');
    console.log(`Users: ${users.length}`);
    console.log(`Vendors: ${vendors.length}`);
    console.log(`Venues: ${venues.length}`);
    console.log(`Bookings: ${bookings.length}`);
    console.log(`Reviews: ${reviews.length}`);
    
    console.log('\n🎉 Comprehensive seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedDatabase(); 