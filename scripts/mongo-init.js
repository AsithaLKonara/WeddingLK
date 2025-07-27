// MongoDB initialization script for WeddingLK
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('weddinglk');

// Create collections
db.createCollection('users');
db.createCollection('vendors');
db.createCollection('venues');
db.createCollection('bookings');
db.createCollection('reviews');
db.createCollection('services');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.vendors.createIndex({ "email": 1 }, { unique: true });
db.vendors.createIndex({ "category": 1 });
db.venues.createIndex({ "location": "2dsphere" });
db.venues.createIndex({ "name": 1 });
db.bookings.createIndex({ "userId": 1 });
db.bookings.createIndex({ "vendorId": 1 });
db.bookings.createIndex({ "date": 1 });
db.reviews.createIndex({ "vendorId": 1 });
db.reviews.createIndex({ "rating": 1 });

// Insert sample data
db.users.insertMany([
  {
    _id: ObjectId(),
    name: "Demo User",
    email: "demo@weddinglk.com",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Admin User",
    email: "admin@weddinglk.com",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.vendors.insertMany([
  {
    _id: ObjectId(),
    name: "Elegant Photography",
    email: "contact@elegantphotography.com",
    category: "photography",
    description: "Professional wedding photography services",
    location: "Colombo",
    rating: 4.8,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Royal Catering",
    email: "info@royalcatering.com",
    category: "catering",
    description: "Premium wedding catering services",
    location: "Kandy",
    rating: 4.6,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.venues.insertMany([
  {
    _id: ObjectId(),
    name: "Grand Hotel Colombo",
    description: "Luxury wedding venue in the heart of Colombo",
    location: {
      type: "Point",
      coordinates: [79.8612, 6.9271]
    },
    address: "123 Main Street, Colombo",
    capacity: 500,
    price: 500000,
    images: ["https://example.com/venue1.jpg"],
    amenities: ["Parking", "Catering", "Decoration"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Garden Palace Kandy",
    description: "Beautiful garden wedding venue in Kandy",
    location: {
      type: "Point",
      coordinates: [80.6337, 7.2906]
    },
    address: "456 Hill Road, Kandy",
    capacity: 300,
    price: 350000,
    images: ["https://example.com/venue2.jpg"],
    amenities: ["Garden", "Catering", "Photography"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("MongoDB initialization completed successfully!");
print("Database: weddinglk");
print("Collections created: users, vendors, venues, bookings, reviews, services");
print("Sample data inserted for testing"); 