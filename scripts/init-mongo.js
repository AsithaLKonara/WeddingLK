// ========================================
// MONGODB INITIALIZATION SCRIPT
// Runs when MongoDB container starts
// ========================================

print('Starting MongoDB initialization...');

// Create the main database
db = db.getSiblingDB('weddinglk');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('vendors');
db.createCollection('venues');
db.createCollection('bookings');
db.createCollection('conversations');
db.createCollection('payments');
db.createCollection('reviews');

// Create indexes for performance
print('Creating performance indexes...');

// Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "createdAt": -1 });

// Vendors collection indexes
db.vendors.createIndex({ "userId": 1 }, { unique: true });
db.vendors.createIndex({ "businessName": "text", "description": "text" });
db.vendors.createIndex({ "category": 1 });
db.vendors.createIndex({ "location.city": 1, "location.state": 1 });
db.vendors.createIndex({ "isVerified": 1 });
db.vendors.createIndex({ "rating": -1 });

// Venues collection indexes
db.venues.createIndex({ "userId": 1 }, { unique: true });
db.venues.createIndex({ "name": "text", "description": "text" });
db.venues.createIndex({ "location.city": 1, "location.state": 1 });
db.venues.createIndex({ "capacity": 1 });
db.venues.createIndex({ "priceRange": 1 });
db.venues.createIndex({ "isAvailable": 1 });

// Bookings collection indexes
db.bookings.createIndex({ "userId": 1 });
db.bookings.createIndex({ "vendorId": 1 });
db.bookings.createIndex({ "venueId": 1 });
db.bookings.createIndex({ "date": 1 });
db.bookings.createIndex({ "status": 1 });
db.bookings.createIndex({ "createdAt": -1 });

// Conversations collection indexes
db.conversations.createIndex({ "participants": 1 });
db.conversations.createIndex({ "lastMessageAt": -1 });

// Payments collection indexes
db.payments.createIndex({ "userId": 1 });
db.payments.createIndex({ "bookingId": 1 });
db.payments.createIndex({ "status": 1 });
db.payments.createIndex({ "createdAt": -1 });

// Reviews collection indexes
db.reviews.createIndex({ "targetId": 1, "targetType": 1 });
db.reviews.createIndex({ "userId": 1 });
db.reviews.createIndex({ "rating": -1 });
db.reviews.createIndex({ "createdAt": -1 });

print('MongoDB initialization completed successfully!');
print('Database: weddinglk');
print('Collections created with performance indexes'); 