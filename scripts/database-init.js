// Comprehensive Database Initialization Script for WeddingLK
// This script creates all necessary collections, indexes, and sample data

db = db.getSiblingDB('weddinglk');

print("🚀 Initializing WeddingLK Database...");

// Drop existing collections to start fresh
db.users.drop();
db.vendors.drop();
db.venues.drop();
db.bookings.drop();
db.reviews.drop();
db.services.drop();
db.payments.drop();
db.tasks.drop();
db.notifications.drop();

print("✅ Dropped existing collections");

// Create collections
db.createCollection('users');
db.createCollection('vendors');
db.createCollection('venues');
db.createCollection('bookings');
db.createCollection('reviews');
db.createCollection('services');
db.createCollection('payments');
db.createCollection('tasks');
db.createCollection('notifications');

print("✅ Created collections");

// Create indexes for better performance
print("📊 Creating indexes...");

// Users indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "createdAt": -1 });

// Vendors indexes
db.vendors.createIndex({ "email": 1 }, { unique: true });
db.vendors.createIndex({ "category": 1 });
db.vendors.createIndex({ "location": 1 });
db.vendors.createIndex({ "status": 1 });
db.vendors.createIndex({ "rating": -1 });

// Venues indexes
db.venues.createIndex({ "location": "2dsphere" });
db.venues.createIndex({ "name": 1 });
db.venues.createIndex({ "capacity": 1 });
db.venues.createIndex({ "price": 1 });
db.venues.createIndex({ "status": 1 });

// Bookings indexes
db.bookings.createIndex({ "userId": 1 });
db.bookings.createIndex({ "vendorId": 1 });
db.bookings.createIndex({ "venueId": 1 });
db.bookings.createIndex({ "date": 1 });
db.bookings.createIndex({ "status": 1 });

// Reviews indexes
db.reviews.createIndex({ "vendorId": 1 });
db.reviews.createIndex({ "userId": 1 });
db.reviews.createIndex({ "rating": 1 });
db.reviews.createIndex({ "createdAt": -1 });

// Services indexes
db.services.createIndex({ "vendorId": 1 });
db.services.createIndex({ "category": 1 });
db.services.createIndex({ "price": 1 });

// Payments indexes
db.payments.createIndex({ "bookingId": 1 });
db.payments.createIndex({ "userId": 1 });
db.payments.createIndex({ "status": 1 });
db.payments.createIndex({ "createdAt": -1 });

// Tasks indexes
db.tasks.createIndex({ "userId": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "dueDate": 1 });

// Notifications indexes
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "read": 1 });
db.notifications.createIndex({ "createdAt": -1 });

print("✅ Created indexes");

// Insert sample users
print("👥 Inserting sample users...");
db.users.insertMany([
  {
    _id: ObjectId(),
    name: "Demo User",
    email: "demo@weddinglk.com",
    password: "$2a$10$hashedpassword", // In production, use proper hashing
    role: "user",
    status: "active",
    profile: {
      phone: "+94 71 234 5678",
      weddingDate: new Date("2024-12-15"),
      budget: 500000,
      location: "Colombo",
      preferences: ["Traditional", "Outdoor", "Photography"]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Admin User",
    email: "admin@weddinglk.com",
    password: "$2a$10$hashedpassword",
    role: "admin",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Wedding Planner",
    email: "planner@weddinglk.com",
    password: "$2a$10$hashedpassword",
    role: "planner",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample vendors
print("🏢 Inserting sample vendors...");
db.vendors.insertMany([
  {
    _id: ObjectId(),
    name: "Elegant Photography Studio",
    email: "contact@elegantphotography.com",
    password: "$2a$10$hashedpassword",
    category: "photography",
    description: "Professional wedding photography and videography services",
    location: "Colombo",
    address: "123 Main Street, Colombo 01",
    phone: "+94 11 234 5678",
    website: "https://elegantphotography.com",
    rating: 4.8,
    reviewCount: 45,
    services: ["Wedding Photography", "Videography", "Engagement Shoots"],
    portfolio: [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ],
    pricing: {
      basic: 75000,
      premium: 150000,
      luxury: 250000
    },
    status: "active",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Royal Catering Services",
    email: "info@royalcatering.com",
    password: "$2a$10$hashedpassword",
    category: "catering",
    description: "Premium wedding catering with traditional and international cuisine",
    location: "Kandy",
    address: "456 Hill Road, Kandy",
    phone: "+94 81 234 5678",
    website: "https://royalcatering.com",
    rating: 4.6,
    reviewCount: 32,
    services: ["Wedding Catering", "Menu Planning", "Staff Services"],
    portfolio: [
      "https://example.com/food1.jpg",
      "https://example.com/food2.jpg"
    ],
    pricing: {
      basic: 2500,
      premium: 3500,
      luxury: 5000
    },
    status: "active",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Blissful Decorations",
    email: "hello@blissfuldecor.com",
    password: "$2a$10$hashedpassword",
    category: "decoration",
    description: "Beautiful wedding decorations and floral arrangements",
    location: "Galle",
    address: "789 Beach Road, Galle",
    phone: "+94 91 234 5678",
    website: "https://blissfuldecor.com",
    rating: 4.7,
    reviewCount: 28,
    services: ["Wedding Decorations", "Floral Arrangements", "Lighting"],
    portfolio: [
      "https://example.com/decor1.jpg",
      "https://example.com/decor2.jpg"
    ],
    pricing: {
      basic: 50000,
      premium: 100000,
      luxury: 200000
    },
    status: "active",
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample venues
print("🏰 Inserting sample venues...");
db.venues.insertMany([
  {
    _id: ObjectId(),
    name: "Grand Hotel Colombo",
    description: "Luxury wedding venue in the heart of Colombo with stunning city views",
    location: {
      type: "Point",
      coordinates: [79.8612, 6.9271]
    },
    address: "123 Main Street, Colombo 01",
    city: "Colombo",
    capacity: 500,
    price: 500000,
    images: [
      "https://example.com/venue1.jpg",
      "https://example.com/venue2.jpg"
    ],
    amenities: ["Parking", "Catering", "Decoration", "Photography", "Music"],
    features: ["Air Conditioning", "Garden", "Pool", "Spa"],
    availability: [
      {
        date: new Date("2024-12-15"),
        available: false
      },
      {
        date: new Date("2024-12-20"),
        available: true
      }
    ],
    status: "active",
    rating: 4.5,
    reviewCount: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Garden Palace Kandy",
    description: "Beautiful garden wedding venue in the cultural capital",
    location: {
      type: "Point",
      coordinates: [80.6337, 7.2906]
    },
    address: "456 Hill Road, Kandy",
    city: "Kandy",
    capacity: 300,
    price: 350000,
    images: [
      "https://example.com/venue3.jpg",
      "https://example.com/venue4.jpg"
    ],
    amenities: ["Garden", "Catering", "Photography", "Music"],
    features: ["Mountain View", "Garden", "Traditional Architecture"],
    availability: [
      {
        date: new Date("2024-12-15"),
        available: true
      },
      {
        date: new Date("2024-12-20"),
        available: true
      }
    ],
    status: "active",
    rating: 4.7,
    reviewCount: 22,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Beach Resort Galle",
    description: "Stunning beachfront wedding venue with ocean views",
    location: {
      type: "Point",
      coordinates: [80.2176, 6.0535]
    },
    address: "789 Beach Road, Galle",
    city: "Galle",
    capacity: 200,
    price: 400000,
    images: [
      "https://example.com/venue5.jpg",
      "https://example.com/venue6.jpg"
    ],
    amenities: ["Beach Access", "Catering", "Decoration", "Photography"],
    features: ["Ocean View", "Beach", "Resort Facilities"],
    availability: [
      {
        date: new Date("2024-12-15"),
        available: true
      },
      {
        date: new Date("2024-12-20"),
        available: false
      }
    ],
    status: "active",
    rating: 4.8,
    reviewCount: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample services
print("🛠️ Inserting sample services...");
const vendorIds = db.vendors.find({}, {_id: 1}).toArray();
db.services.insertMany([
  {
    _id: ObjectId(),
    vendorId: vendorIds[0]._id,
    name: "Wedding Photography Package",
    description: "Complete wedding photography coverage including engagement shoot",
    category: "photography",
    price: 75000,
    duration: "Full Day",
    includes: ["Engagement Shoot", "Wedding Day Coverage", "Edited Photos", "Online Gallery"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    vendorId: vendorIds[1]._id,
    name: "Premium Catering Package",
    description: "Luxury catering service with international cuisine",
    category: "catering",
    price: 3500,
    duration: "Per Person",
    includes: ["Appetizers", "Main Course", "Desserts", "Beverages", "Staff"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    vendorId: vendorIds[2]._id,
    name: "Complete Decoration Package",
    description: "Full wedding decoration including floral arrangements",
    category: "decoration",
    price: 100000,
    duration: "Full Day",
    includes: ["Ceremony Decoration", "Reception Decoration", "Floral Arrangements", "Lighting"],
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample bookings
print("📅 Inserting sample bookings...");
const userId = db.users.findOne({email: "demo@weddinglk.com"})._id;
const venueId = db.venues.findOne({name: "Grand Hotel Colombo"})._id;
db.bookings.insertMany([
  {
    _id: ObjectId(),
    userId: userId,
    venueId: venueId,
    vendorIds: [vendorIds[0]._id, vendorIds[1]._id],
    date: new Date("2024-12-15"),
    guestCount: 150,
    status: "confirmed",
    totalAmount: 750000,
    deposit: 150000,
    remainingAmount: 600000,
    specialRequests: "Traditional Sri Lankan ceremony with modern reception",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample reviews
print("⭐ Inserting sample reviews...");
db.reviews.insertMany([
  {
    _id: ObjectId(),
    userId: userId,
    vendorId: vendorIds[0]._id,
    rating: 5,
    comment: "Excellent photography service! The photos turned out amazing.",
    images: ["https://example.com/review1.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: userId,
    vendorId: vendorIds[1]._id,
    rating: 4,
    comment: "Great food and service. Highly recommended!",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample tasks
print("📋 Inserting sample tasks...");
db.tasks.insertMany([
  {
    _id: ObjectId(),
    userId: userId,
    title: "Book Photographer",
    description: "Contact and book wedding photographer",
    status: "completed",
    priority: "high",
    dueDate: new Date("2024-10-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: userId,
    title: "Choose Wedding Cake",
    description: "Select and order wedding cake",
    status: "pending",
    priority: "medium",
    dueDate: new Date("2024-11-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: userId,
    title: "Send Invitations",
    description: "Print and send wedding invitations",
    status: "pending",
    priority: "high",
    dueDate: new Date("2024-11-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample notifications
print("🔔 Inserting sample notifications...");
db.notifications.insertMany([
  {
    _id: ObjectId(),
    userId: userId,
    title: "Booking Confirmed",
    message: "Your booking with Elegant Photography has been confirmed",
    type: "booking",
    read: false,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    userId: userId,
    title: "Payment Due",
    message: "Reminder: Payment due for venue booking",
    type: "payment",
    read: false,
    createdAt: new Date()
  }
]);

print("✅ Database initialization completed successfully!");
print("");
print("📊 Database Summary:");
print("   Collections: users, vendors, venues, bookings, reviews, services, payments, tasks, notifications");
print("   Sample Users: 3 (demo@weddinglk.com, admin@weddinglk.com, planner@weddinglk.com)");
print("   Sample Vendors: 3 (Photography, Catering, Decoration)");
print("   Sample Venues: 3 (Colombo, Kandy, Galle)");
print("   Sample Services: 3");
print("   Sample Bookings: 1");
print("   Sample Reviews: 2");
print("   Sample Tasks: 3");
print("   Sample Notifications: 2");
print("");
print("🔑 Default Login Credentials:");
print("   User: demo@weddinglk.com / any password");
print("   Admin: admin@weddinglk.com / any password");
print("   Planner: planner@weddinglk.com / any password");
print("");
print("🎉 WeddingLK Database is ready!"); 