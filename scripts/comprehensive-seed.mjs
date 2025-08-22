#!/usr/bin/env node

// ========================================
// WEDDINGLK COMPREHENSIVE DATABASE SEEDING
// Populates all tables with 50 rows of realistic data
// ========================================

import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Database connection
const MONGODB_URI = 'mongodb://admin:password123@localhost:27017/weddinglk?authSource=admin';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['user', 'vendor', 'planner', 'admin'], default: 'user' },
  phone: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  servicesOffered: [String],
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  portfolio: [String],
  pricing: {
    basePrice: Number,
    currency: { type: String, default: 'USD' }
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    workingHours: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Venue Schema
const venueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [String],
  priceRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  isAvailable: { type: Boolean, default: true },
  images: [String],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  date: { type: Date, required: true },
  time: String,
  duration: Number,
  guestCount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  totalAmount: Number,
  depositAmount: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['vendor', 'venue'], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  method: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  createdAt: { type: Date, default: Date.now }
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: String,
  lastMessageAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  dueDate: Date,
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const Task = mongoose.model('Task', taskSchema);

// Data generation functions
function generateUser(role = 'user') {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    username: faker.internet.userName({ firstName, lastName }),
    email: faker.internet.email({ firstName, lastName }),
    password: bcrypt.hashSync('password123', 10),
    firstName,
    lastName,
    role,
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    isVerified: faker.datatype.boolean(0.8),
    isActive: faker.datatype.boolean(0.9)
  };
}

function generateVendor(userId) {
  const businessTypes = ['Photography', 'Videography', 'Catering', 'Music', 'Decoration', 'Transportation', 'Beauty', 'Planning'];
  const categories = ['Premium', 'Standard', 'Budget', 'Luxury'];
  
  return {
    userId,
    businessName: faker.company.name(),
    businessType: faker.helpers.arrayElement(businessTypes),
    category: faker.helpers.arrayElement(categories),
    description: faker.lorem.paragraph(),
    servicesOffered: faker.helpers.arrayElements(['Wedding Photography', 'Engagement Photos', 'Videography', 'Photo Editing', 'Albums'], { min: 2, max: 5 }),
    location: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude()
      }
    },
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
    totalReviews: faker.number.int({ min: 10, max: 200 }),
    experience: faker.number.int({ min: 1, max: 20 }),
    isVerified: faker.datatype.boolean(0.7),
    isActive: faker.datatype.boolean(0.9),
    portfolio: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
    pricing: {
      basePrice: faker.number.int({ min: 500, max: 5000 }),
      currency: 'USD'
    },
    availability: {
      isAvailable: faker.datatype.boolean(0.8),
      workingHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '10:00', end: '16:00' },
        sunday: { start: '10:00', end: '16:00' }
      }
    }
  };
}

function generateVenue(userId) {
  const venueTypes = ['Hotel', 'Restaurant', 'Garden', 'Beach', 'Barn', 'Mansion', 'Country Club', 'Museum'];
  
  return {
    userId,
    name: faker.company.name() + ' ' + faker.helpers.arrayElement(['Hotel', 'Resort', 'Venue', 'Center']),
    description: faker.lorem.paragraph(),
    type: faker.helpers.arrayElement(venueTypes),
    capacity: faker.number.int({ min: 50, max: 500 }),
    location: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude()
      }
    },
    amenities: faker.helpers.arrayElements(['Parking', 'Catering', 'Audio/Visual', 'WiFi', 'Accessibility', 'Outdoor Space'], { min: 3, max: 6 }),
    priceRange: {
      min: faker.number.int({ min: 2000, max: 10000 }),
      max: faker.number.int({ min: 15000, max: 50000 }),
      currency: 'USD'
    },
    isAvailable: faker.datatype.boolean(0.8),
    images: Array.from({ length: faker.number.int({ min: 4, max: 10 }) }, () => faker.image.url()),
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
    totalReviews: faker.number.int({ min: 5, max: 150 })
  };
}

function generateBooking(userId, vendorIds, venueIds) {
  const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  const hasVendor = faker.datatype.boolean(0.7);
  const hasVenue = faker.datatype.boolean(0.6);
  
  return {
    userId,
    vendorId: hasVendor ? faker.helpers.arrayElement(vendorIds) : null,
    venueId: hasVenue ? faker.helpers.arrayElement(venueIds) : null,
    date: faker.date.future(),
    time: faker.helpers.arrayElement(['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']),
    duration: faker.number.int({ min: 2, max: 8 }),
    guestCount: faker.number.int({ min: 50, max: 300 }),
    status: faker.helpers.arrayElement(statuses),
    totalAmount: faker.number.int({ min: 5000, max: 50000 }),
    depositAmount: faker.number.int({ min: 500, max: 5000 }),
    notes: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : ''
  };
}

function generateReview(userId, targetIds, targetType) {
  return {
    userId,
    targetId: faker.helpers.arrayElement(targetIds),
    targetType,
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.datatype.boolean(0.8) ? faker.lorem.paragraph() : '',
    isVerified: faker.datatype.boolean(0.6)
  };
}

function generatePayment(userId, bookingIds) {
  const methods = ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe'];
  const statuses = ['pending', 'completed', 'failed', 'refunded'];
  
  return {
    userId,
    bookingId: faker.helpers.arrayElement(bookingIds),
    amount: faker.number.int({ min: 500, max: 10000 }),
    currency: 'USD',
    method: faker.helpers.arrayElement(methods),
    status: faker.helpers.arrayElement(statuses),
    transactionId: faker.string.alphanumeric(16).toUpperCase()
  };
}

function generateConversation(userIds) {
  const participantCount = faker.number.int({ min: 2, max: 4 });
  const participants = faker.helpers.arrayElements(userIds, { min: 2, max: participantCount });
  
  return {
    participants,
    lastMessage: faker.lorem.sentence(),
    lastMessageAt: faker.date.recent(),
    isActive: faker.datatype.boolean(0.8)
  };
}

function generateMessage(conversationId, senderId) {
  const messageTypes = ['text', 'image', 'file'];
  
  return {
    conversationId,
    senderId,
    content: faker.lorem.paragraph(),
    messageType: faker.helpers.arrayElement(messageTypes),
    isRead: faker.datatype.boolean(0.7)
  };
}

function generateTask(userIds) {
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  const categories = ['Planning', 'Decoration', 'Catering', 'Music', 'Photography', 'Transportation', 'Beauty', 'Other'];
  
  return {
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraph(),
    assignedTo: faker.helpers.arrayElement(userIds),
    createdBy: faker.helpers.arrayElement(userIds),
    status: faker.helpers.arrayElement(statuses),
    priority: faker.helpers.arrayElement(priorities),
    dueDate: faker.date.future(),
    category: faker.helpers.arrayElement(categories)
  };
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🚀 Starting comprehensive database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Venue.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Task.deleteMany({})
    ]);
    
    console.log('✅ Database cleared');
    
    // Generate users
    console.log('👥 Generating users...');
    const users = [];
    
    // Generate regular users
    for (let i = 0; i < 30; i++) {
      const user = new User(generateUser('user'));
      users.push(await user.save());
    }
    
    // Generate vendors
    for (let i = 0; i < 10; i++) {
      const user = new User(generateUser('vendor'));
      users.push(await user.save());
    }
    
    // Generate planners
    for (let i = 0; i < 5; i++) {
      const user = new User(generateUser('planner'));
      users.push(await user.save());
    }
    
    // Generate admin
    const adminUser = new User(generateUser('admin'));
    users.push(await adminUser.save());
    
    console.log(`✅ Generated ${users.length} users`);
    
    // Generate vendors
    console.log('🏢 Generating vendors...');
    const vendorUsers = users.filter(u => u.role === 'vendor');
    const vendors = [];
    
    for (const user of vendorUsers) {
      const vendor = new Vendor(generateVendor(user._id));
      vendors.push(await vendor.save());
    }
    
    console.log(`✅ Generated ${vendors.length} vendors`);
    
    // Generate venues
    console.log('🏰 Generating venues...');
    const venueUsers = users.filter(u => u.role === 'user').slice(0, 10);
    const venues = [];
    
    for (const user of venueUsers) {
      const venue = new Venue(generateVenue(user._id));
      venues.push(await venue.save());
    }
    
    console.log(`✅ Generated ${venues.length} venues`);
    
    // Generate bookings
    console.log('📅 Generating bookings...');
    const regularUsers = users.filter(u => u.role === 'user');
    const vendorIds = vendors.map(v => v._id);
    const venueIds = venues.map(v => v._id);
    const bookings = [];
    
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const booking = new Booking(generateBooking(user._id, vendorIds, venueIds));
      bookings.push(await booking.save());
    }
    
    console.log(`✅ Generated ${bookings.length} bookings`);
    
    // Generate reviews
    console.log('⭐ Generating reviews...');
    const reviews = [];
    
    // Vendor reviews
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const review = new Review(generateReview(user._id, vendorIds, 'vendor'));
      reviews.push(await review.save());
    }
    
    // Venue reviews
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(regularUsers);
      const review = new Review(generateReview(user._id, venueIds, 'venue'));
      reviews.push(await review.save());
    }
    
    console.log(`✅ Generated ${reviews.length} reviews`);
    
    // Generate payments
    console.log('💳 Generating payments...');
    const paymentUsers = users.filter(u => u.role === 'user');
    const bookingIds = bookings.map(b => b._id);
    const payments = [];
    
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(paymentUsers);
      const payment = new Payment(generatePayment(user._id, bookingIds));
      payments.push(await payment.save());
    }
    
    console.log(`✅ Generated ${payments.length} payments`);
    
    // Generate conversations
    console.log('💬 Generating conversations...');
    const conversationUsers = users.filter(u => u.role === 'user');
    const conversations = [];
    
    for (let i = 0; i < 50; i++) {
      const conversation = new Conversation(generateConversation(conversationUsers.map(u => u._id)));
      conversations.push(await conversation.save());
    }
    
    console.log(`✅ Generated ${conversations.length} conversations`);
    
    // Generate messages
    console.log('📝 Generating messages...');
    const messages = [];
    
    for (const conversation of conversations) {
      const messageCount = faker.number.int({ min: 3, max: 10 });
      for (let i = 0; i < messageCount; i++) {
        const sender = faker.helpers.arrayElement(conversation.participants);
        const message = new Message(generateMessage(conversation._id, sender));
        messages.push(await message.save());
      }
    }
    
    console.log(`✅ Generated ${messages.length} messages`);
    
    // Generate tasks
    console.log('✅ Generating tasks...');
    const taskUsers = users.filter(u => ['user', 'planner'].includes(u.role));
    const tasks = [];
    
    for (let i = 0; i < 50; i++) {
      const task = new Task(generateTask(taskUsers.map(u => u._id)));
      tasks.push(await task.save());
    }
    
    console.log(`✅ Generated ${tasks.length} tasks`);
    
    // Update vendor and venue ratings based on reviews
    console.log('📊 Updating ratings...');
    
    for (const vendor of vendors) {
      const vendorReviews = reviews.filter(r => r.targetId.equals(vendor._id) && r.targetType === 'vendor');
      if (vendorReviews.length > 0) {
        const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
        vendor.rating = Math.round(avgRating * 10) / 10;
        vendor.totalReviews = vendorReviews.length;
        await vendor.save();
      }
    }
    
    for (const venue of venues) {
      const venueReviews = reviews.filter(r => r.targetId.equals(venue._id) && r.targetType === 'venue');
      if (venueReviews.length > 0) {
        const avgRating = venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length;
        venue.rating = Math.round(avgRating * 10) / 10;
        venue.totalReviews = venueReviews.length;
        await venue.save();
      }
    }
    
    console.log('✅ Ratings updated');
    
    // Summary
    console.log('\n🎉 DATABASE SEEDING COMPLETED!');
    console.log('=====================================');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏢 Vendors: ${vendors.length}`);
    console.log(`🏰 Venues: ${venues.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`💳 Payments: ${payments.length}`);
    console.log(`💬 Conversations: ${conversations.length}`);
    console.log(`📝 Messages: ${messages.length}`);
    console.log(`✅ Tasks: ${tasks.length}`);
    console.log('\n🔑 DEFAULT LOGIN CREDENTIALS:');
    console.log('=====================================');
    console.log('👑 Admin User:');
    console.log(`   Email: ${adminUser.email}`);
    console.log('   Password: password123');
    console.log('\n👤 Regular Users:');
    console.log('   Password: password123');
    console.log('   (Use any user email from the generated users)');
    console.log('\n🏢 Vendor Users:');
    console.log('   Password: password123');
    console.log('   (Use any vendor email from the generated users)');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding
seedDatabase(); 