// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to admin database
db = db.getSiblingDB('admin');

// Create application database
db = db.getSiblingDB('weddinglk_dev');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
        },
        role: {
          enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'],
        },
      },
    },
  },
});

db.createCollection('vendors', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'category', 'location'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
        },
        category: {
          bsonType: 'string',
        },
        location: {
          bsonType: 'object',
          required: ['city'],
          properties: {
            city: { bsonType: 'string' },
          },
        },
      },
    },
  },
});

db.createCollection('venues', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'location', 'capacity'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
        },
        capacity: {
          bsonType: 'int',
          minimum: 1,
        },
      },
    },
  },
});

db.createCollection('bookings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'serviceId', 'serviceType', 'date'],
      properties: {
        userId: {
          bsonType: 'objectId',
        },
        serviceId: {
          bsonType: 'objectId',
        },
        serviceType: {
          enum: ['vendor', 'venue'],
        },
        date: {
          bsonType: 'date',
        },
      },
    },
  },
});

db.createCollection('payments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['bookingId', 'amount', 'currency', 'status'],
      properties: {
        amount: {
          bsonType: 'number',
          minimum: 0,
        },
        currency: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 3,
        },
        status: {
          enum: ['pending', 'completed', 'failed', 'refunded'],
        },
      },
    },
  },
});

db.createCollection('reviews', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'serviceId', 'serviceType', 'rating', 'comment'],
      properties: {
        rating: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5,
        },
        comment: {
          bsonType: 'string',
          maxLength: 1000,
        },
      },
    },
  },
});

// Create indexes for better performance
print('Creating indexes...');

// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ status: 1 });
db.users.createIndex({ createdAt: 1 });

// Vendors collection indexes
db.vendors.createIndex({ category: 1 });
db.vendors.createIndex({ 'location.city': 1 });
db.vendors.createIndex({ rating: -1 });
db.vendors.createIndex({ 'price.min': 1, 'price.max': 1 });

// Venues collection indexes
db.venues.createIndex({ 'location.city': 1 });
db.venues.createIndex({ capacity: 1 });
db.venues.createIndex({ rating: -1 });
db.venues.createIndex({ 'price.min': 1, 'price.max': 1 });

// Bookings collection indexes
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ serviceId: 1 });
db.bookings.createIndex({ date: 1 });
db.bookings.createIndex({ status: 1 });

// Payments collection indexes
db.payments.createIndex({ bookingId: 1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ createdAt: 1 });

// Reviews collection indexes
db.reviews.createIndex({ serviceId: 1 });
db.reviews.createIndex({ rating: 1 });
db.reviews.createIndex({ createdAt: 1 });

// Create text indexes for search
db.vendors.createIndex({
  name: 'text',
  description: 'text',
  category: 'text',
  'location.city': 'text',
});

db.venues.createIndex({
  name: 'text',
  description: 'text',
  'location.city': 'text',
  amenities: 'text',
});

print('MongoDB initialization completed successfully!');
print(
  'Collections created: users, vendors, venues, bookings, payments, reviews'
);
print('Indexes created for optimal performance');
