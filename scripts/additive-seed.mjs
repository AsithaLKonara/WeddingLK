#!/usr/bin/env node

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://admin:password123@mongodb:27017/weddinglk?authSource=admin';

async function additiveSeed() {
  let client;
  try {
    console.log('🚀 Starting additive database seeding...');
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('weddinglk');
    
    // Get existing users
    const existingUsers = await db.collection('users').find({}).toArray();
    console.log(`📊 Found ${existingUsers.length} existing users`);
    
    // Add more users if needed
    if (existingUsers.length < 50) {
      console.log('👥 Adding more users...');
      const usersToAdd = 50 - existingUsers.length;
      
      for (let i = existingUsers.length + 1; i <= 50; i++) {
        const user = {
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: 'password123',
          firstName: `User${i}`,
          lastName: 'Example',
          role: 'user',
          isVerified: true,
          isActive: true,
          createdAt: new Date()
        };
        await db.collection('users').insertOne(user);
      }
      console.log(`✅ Added ${usersToAdd} more users`);
    }
    
    // Add vendors
    console.log('🏢 Adding vendors...');
    const vendorUsers = existingUsers.filter(u => u.role === 'vendor');
    const regularUsers = existingUsers.filter(u => u.role === 'user');
    
    if (vendorUsers.length === 0) {
      // Convert some users to vendors
      for (let i = 0; i < 10; i++) {
        const user = regularUsers[i];
        if (user) {
          await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { role: 'vendor' } }
          );
          vendorUsers.push(user);
        }
      }
    }
    
    // Generate vendors
    const types = ['Photography', 'Videography', 'Catering', 'Music', 'Decoration', 'Transportation', 'Beauty', 'Planning'];
    for (let i = 0; i < vendorUsers.length; i++) {
      const vendor = {
        userId: vendorUsers[i]._id,
        businessName: `${types[i % types.length]} Pro ${i + 1}`,
        businessType: types[i % types.length],
        category: 'Premium',
        description: `Professional ${types[i % types.length]} services for your special day`,
        rating: 4.0 + (i % 10) * 0.1,
        totalReviews: 15 + (i % 35),
        experience: 2 + (i % 8),
        isVerified: true,
        isActive: true,
        servicesOffered: [`Wedding ${types[i % types.length]}`, 'Engagement Photos', 'Event Coverage'],
        location: {
          address: `${100 + i} Main Street`,
          city: 'Wedding City',
          state: 'WC',
          zipCode: '12345'
        },
        pricing: {
          basePrice: 1000 + (i % 2000),
          currency: 'USD'
        }
      };
      await db.collection('vendors').insertOne(vendor);
    }
    console.log(`✅ Added ${vendorUsers.length} vendors`);
    
    // Add venues
    console.log('🏰 Adding venues...');
    const venueUsers = regularUsers.slice(10, 20);
    const venueTypes = ['Hotel', 'Restaurant', 'Garden', 'Beach', 'Barn', 'Country Club', 'Mansion', 'Museum'];
    
    for (let i = 0; i < venueUsers.length; i++) {
      const venue = {
        userId: venueUsers[i]._id,
        name: `${venueTypes[i % venueTypes.length]} Venue ${i + 1}`,
        description: `Beautiful ${venueTypes[i % venueTypes.length].toLowerCase()} venue for your wedding`,
        type: venueTypes[i % venueTypes.length],
        capacity: 100 + (i % 200),
        location: {
          address: `${200 + i} Venue Street`,
          city: 'Wedding City',
          state: 'WC',
          zipCode: '12345'
        },
        amenities: ['Parking', 'Catering', 'Audio/Visual', 'WiFi'],
        priceRange: {
          min: 3000 + (i % 5000),
          max: 15000 + (i % 25000),
          currency: 'USD'
        },
        isAvailable: true,
        rating: 4.0 + (i % 10) * 0.1,
        totalReviews: 8 + (i % 22)
      };
      await db.collection('venues').insertOne(venue);
    }
    console.log(`✅ Added ${venueUsers.length} venues`);
    
    // Add bookings
    console.log('📅 Adding bookings...');
    const allUsers = await db.collection('users').find({}).toArray();
    const allVendors = await db.collection('vendors').find({}).toArray();
    const allVenues = await db.collection('venues').find({}).toArray();
    
    for (let i = 0; i < 50; i++) {
      const user = allUsers[i % allUsers.length];
      const vendor = allVendors[i % allVendors.length];
      const venue = allVenues[i % allVenues.length];
      
      const booking = {
        userId: user._id,
        vendorId: vendor._id,
        venueId: venue._id,
        date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)), // Future dates
        time: '14:00',
        duration: 6,
        guestCount: 100 + (i % 150),
        status: ['pending', 'confirmed', 'completed'][i % 3],
        totalAmount: 5000 + (i % 15000),
        depositAmount: 500 + (i % 1000),
        notes: `Wedding booking ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection('bookings').insertOne(booking);
    }
    console.log('✅ Added 50 bookings');
    
    // Add reviews
    console.log('⭐ Adding reviews...');
    for (let i = 0; i < 50; i++) {
      const user = allUsers[i % allUsers.length];
      const target = i % 2 === 0 ? allVendors[i % allVendors.length] : allVenues[i % allVenues.length];
      
      const review = {
        userId: user._id,
        targetId: target._id,
        targetType: i % 2 === 0 ? 'vendor' : 'venue',
        rating: 3 + (i % 3), // 3, 4, or 5 stars
        comment: `Great service! ${i + 1}`,
        isVerified: true,
        createdAt: new Date()
      };
      await db.collection('reviews').insertOne(review);
    }
    console.log('✅ Added 50 reviews');
    
    // Update ratings
    console.log('📊 Updating ratings...');
    
    // Update vendor ratings
    for (const vendor of allVendors) {
      const reviews = await db.collection('reviews').find({ 
        targetId: vendor._id, 
        targetType: 'vendor' 
      }).toArray();
      
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await db.collection('vendors').updateOne(
          { _id: vendor._id },
          { 
            $set: { 
              rating: Math.round(avgRating * 10) / 10,
              totalReviews: reviews.length
            }
          }
        );
      }
    }
    
    // Update venue ratings
    for (const venue of allVenues) {
      const reviews = await db.collection('reviews').find({ 
        targetId: venue._id, 
        targetType: 'venue' 
      }).toArray();
      
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await db.collection('venues').updateOne(
          { _id: venue._id },
          { 
            $set: { 
              rating: Math.round(avgRating * 10) / 10,
              totalReviews: reviews.length
            }
          }
        );
      }
    }
    
    console.log('✅ Ratings updated');
    
    // Final summary
    const finalCounts = {
      users: await db.collection('users').countDocuments(),
      vendors: await db.collection('vendors').countDocuments(),
      venues: await db.collection('venues').countDocuments(),
      bookings: await db.collection('bookings').countDocuments(),
      reviews: await db.collection('reviews').countDocuments()
    };
    
    console.log('\n🎉 ADDITIVE SEEDING COMPLETED!');
    console.log('=====================================');
    console.log(`👥 Users: ${finalCounts.users}`);
    console.log(`🏢 Vendors: ${finalCounts.vendors}`);
    console.log(`🏰 Venues: ${finalCounts.venues}`);
    console.log(`📅 Bookings: ${finalCounts.bookings}`);
    console.log(`⭐ Reviews: ${finalCounts.reviews}`);
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
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

additiveSeed(); 