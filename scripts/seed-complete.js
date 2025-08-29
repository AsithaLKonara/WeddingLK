const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/weddinglk_dev?authSource=admin';

// Sample data generators
const generateLocation = () => ({
  country: 'Sri Lanka',
  state: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province']),
  city: faker.location.city(),
  zipCode: faker.location.zipCode()
});

const generateVendorLocation = () => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  province: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province']),
  serviceAreas: faker.helpers.arrayElements(['Colombo', 'Kandy', 'Galle', 'Negombo', 'Kurunegala'], { min: 1, max: 3 })
});

const generateVenueLocation = () => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  province: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province']),
  coordinates: {
    lat: faker.location.latitude({ min: 5.9, max: 9.9 }),
    lng: faker.location.longitude({ min: 79.5, max: 81.9 })
  }
});

// Seed functions
async function seedAdmins() {
  console.log('🌐 Seeding admin users...');
  
  const adminUsers = [
    {
      email: 'admin@weddinglk.com',
      password: await bcrypt.hash('admin123', 12),
      name: 'System Administrator',
      role: 'admin',
      roleVerified: true,
      roleVerifiedAt: new Date(),
      location: generateLocation(),
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: false }
      },
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      status: 'active',
      lastActiveAt: new Date()
    },
    {
      email: 'superadmin@weddinglk.com',
      password: await bcrypt.hash('super123', 12),
      name: 'Super Administrator',
      role: 'admin',
      roleVerified: true,
      roleVerifiedAt: new Date(),
      location: generateLocation(),
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: false }
      },
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      status: 'active',
      lastActiveAt: new Date()
    },
    {
      email: 'maintainer@weddinglk.com',
      password: await bcrypt.hash('maintain123', 12),
      name: 'System Maintainer',
      role: 'maintainer',
      roleVerified: true,
      roleVerifiedAt: new Date(),
      location: generateLocation(),
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: false, push: true },
        marketing: { email: false, sms: false, push: false }
      },
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      status: 'active',
      lastActiveAt: new Date()
    }
  ];

  // Create User model schema
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    roleVerified: { type: Boolean, default: false },
    roleVerifiedAt: { type: Date },
    location: { type: Object, required: true },
    preferences: { type: Object, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
    lastActiveAt: { type: Date, default: Date.now }
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  for (const adminData of adminUsers) {
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (!existingAdmin) {
      await User.create(adminData);
      console.log(`✅ Created admin: ${adminData.email}`);
    } else {
      console.log(`⚠️ Admin already exists: ${adminData.email}`);
    }
  }
  
  return User;
}

async function seedUsers(User) {
  console.log('👥 Seeding regular users...');
  
  const users = [];
  for (let i = 0; i < 50; i++) {
    const userData = {
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 12),
      name: faker.person.fullName(),
      phone: faker.phone.number('+94 ## ### ####'),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      gender: faker.helpers.arrayElement(['male', 'female', 'other', 'prefer_not_to_say']),
      role: faker.helpers.arrayElement(['user', 'vendor', 'wedding_planner']),
      roleVerified: faker.datatype.boolean(),
      avatar: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      location: generateLocation(),
      preferences: {
        language: faker.helpers.arrayElement(['en', 'si', 'ta']),
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: {
          email: faker.datatype.boolean(),
          sms: faker.datatype.boolean(),
          push: faker.datatype.boolean()
        },
        marketing: {
          email: faker.datatype.boolean(),
          sms: faker.datatype.boolean(),
          push: faker.datatype.boolean()
        }
      },
      isEmailVerified: faker.datatype.boolean(),
      isPhoneVerified: faker.datatype.boolean(),
      isIdentityVerified: faker.datatype.boolean(),
      status: faker.helpers.arrayElement(['active', 'inactive', 'pending_verification']),
      lastLoginAt: faker.date.recent(),
      loginAttempts: 0,
      lastActiveAt: new Date()
    };
    users.push(userData);
  }

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}

async function seedVendors(users) {
  console.log('🏢 Seeding vendors...');
  
  const vendorUsers = users.filter(user => user.role === 'vendor');
  const vendors = [];
  
  // Create Vendor model schema
  const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: Object, required: true },
    contact: { type: Object, required: true },
    services: [{ type: Object }],
    portfolio: [{ type: String }],
    pricing: { type: Object, required: true },
    availability: [{ type: Object }],
    rating: { type: Object, default: { average: 0, count: 0 } },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
    subscription: { type: Object }
  }, { timestamps: true });

  const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
  
  for (let i = 0; i < 50; i++) {
    const vendorUser = vendorUsers[i % vendorUsers.length] || users[i % users.length];
    
    const vendorData = {
      name: faker.company.name(),
      businessName: faker.company.name(),
      category: faker.helpers.arrayElement(['photographer', 'decorator', 'catering', 'music', 'transport', 'makeup', 'jewelry', 'clothing']),
      description: faker.lorem.paragraph(),
      location: generateVendorLocation(),
      contact: {
        phone: faker.phone.number('+94 ## ### ####'),
        email: faker.internet.email(),
        website: faker.internet.url(),
        socialMedia: {
          facebook: faker.internet.url(),
          instagram: faker.internet.url(),
          youtube: faker.internet.url()
        }
      },
      services: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 5000, max: 50000 }),
        duration: faker.helpers.arrayElement(['2 hours', '4 hours', '6 hours', '8 hours', 'Full day'])
      })),
      portfolio: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
      pricing: {
        startingPrice: faker.number.int({ min: 10000, max: 100000 }),
        currency: 'LKR',
        packages: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
          name: faker.helpers.arrayElement(['Basic', 'Standard', 'Premium', 'Luxury']),
          price: faker.number.int({ min: 15000, max: 150000 }),
          features: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => faker.lorem.word())
        }))
      },
      availability: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
        date: faker.date.future(),
        isAvailable: faker.datatype.boolean()
      })),
      rating: {
        average: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
        count: faker.number.int({ min: 5, max: 50 })
      },
      owner: vendorUser._id,
      isVerified: faker.datatype.boolean(),
      isActive: true,
      featured: faker.datatype.boolean(),
      onboardingComplete: faker.datatype.boolean(),
      subscription: {
        plan: faker.helpers.arrayElement(['basic', 'premium', 'pro']),
        expiresAt: faker.date.future()
      }
    };
    vendors.push(vendorData);
  }

  const createdVendors = await Vendor.insertMany(vendors);
  console.log(`✅ Created ${createdVendors.length} vendors`);
  return createdVendors;
}

async function seedVenues(users) {
  console.log('🏰 Seeding venues...');
  
  // Create Venue model schema
  const VenueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: Object, required: true },
    capacity: { type: Object, required: true },
    pricing: { type: Object, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    availability: [{ type: Object }],
    rating: { type: Object, default: { average: 0, count: 0 } },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  }, { timestamps: true });

  const Venue = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);
  
  const venues = [];
  for (let i = 0; i < 50; i++) {
    const venueData = {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      location: generateVenueLocation(),
      capacity: {
        min: faker.number.int({ min: 50, max: 200 }),
        max: faker.number.int({ min: 200, max: 1000 })
      },
      pricing: {
        basePrice: faker.number.int({ min: 50000, max: 500000 }),
        currency: 'LKR',
        pricePerGuest: faker.number.int({ min: 1000, max: 5000 })
      },
      amenities: faker.helpers.arrayElements([
        'Parking', 'Kitchen', 'Garden', 'Pool', 'AC', 'WiFi', 'Sound System', 
        'Lighting', 'Tables & Chairs', 'Catering Kitchen', 'Bridal Suite', 'Groom Room'
      ], { min: 5, max: 10 }),
      images: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
      availability: Array.from({ length: faker.number.int({ min: 10, max: 30 }) }, () => ({
        date: faker.date.future(),
        isAvailable: faker.datatype.boolean()
      })),
      rating: {
        average: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
        count: faker.number.int({ min: 5, max: 30 })
      },
      owner: users[i % users.length]._id,
      isActive: true,
      featured: faker.datatype.boolean()
    };
    venues.push(venueData);
  }

  const createdVenues = await Venue.insertMany(venues);
  console.log(`✅ Created ${createdVenues.length} venues`);
  return createdVenues;
}

async function seedBookings(users, vendors, venues) {
  console.log('📅 Seeding bookings...');
  
  // Create Booking model schema
  const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    guestCount: { type: Number, min: 1 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    totalAmount: { type: Number, required: true, min: 0 },
    depositAmount: { type: Number, min: 0 },
    depositPaid: { type: Boolean, default: false },
    notes: { type: String },
    specialRequirements: { type: String },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });

  const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
  
  const bookings = [];
  for (let i = 0; i < 50; i++) {
    const bookingData = {
      user: users[i % users.length]._id,
      vendor: faker.datatype.boolean() ? vendors[i % vendors.length]._id : undefined,
      venue: faker.datatype.boolean() ? venues[i % venues.length]._id : undefined,
      date: faker.date.future(),
      startTime: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']),
      endTime: faker.helpers.arrayElement(['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']),
      guestCount: faker.number.int({ min: 50, max: 500 }),
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled', 'completed']),
      totalAmount: faker.number.int({ min: 100000, max: 2000000 }),
      depositAmount: faker.number.int({ min: 20000, max: 200000 }),
      depositPaid: faker.datatype.boolean(),
      notes: faker.lorem.sentence(),
      specialRequirements: faker.lorem.sentence(),
      isActive: true
    };
    bookings.push(bookingData);
  }

  const createdBookings = await Booking.insertMany(bookings);
  console.log(`✅ Created ${createdBookings.length} bookings`);
  return createdBookings;
}

async function seedPayments(users, vendors, venues, bookings) {
  console.log('💰 Seeding payments...');
  
  // Create Payment model schema
  const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'LKR' },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed },
    description: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  }, { timestamps: true });

  const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
  
  const payments = [];
  for (let i = 0; i < 50; i++) {
    const paymentData = {
      user: users[i % users.length]._id,
      vendor: faker.datatype.boolean() ? vendors[i % vendors.length]._id : undefined,
      venue: faker.datatype.boolean() ? venues[i % venues.length]._id : undefined,
      booking: faker.datatype.boolean() ? bookings[i % bookings.length]._id : undefined,
      amount: faker.number.int({ min: 10000, max: 500000 }),
      currency: 'LKR',
      status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'failed', 'refunded']),
      paymentMethod: faker.helpers.arrayElement(['credit_card', 'debit_card', 'bank_transfer', 'mobile_payment', 'cash']),
      transactionId: faker.string.alphanumeric(16),
      gatewayResponse: { success: faker.datatype.boolean() },
      description: faker.lorem.sentence(),
      metadata: { source: 'seeded_data' }
    };
    payments.push(paymentData);
  }

  const createdPayments = await Payment.insertMany(payments);
  console.log(`✅ Created ${createdPayments.length} payments`);
  return createdPayments;
}

async function seedReviews(vendors, users) {
  console.log('⭐ Seeding reviews...');
  
  // Create Review model schema
  const ReviewSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  });

  const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
  
  const reviews = [];
  for (let i = 0; i < 50; i++) {
    const reviewData = {
      vendorId: vendors[i % vendors.length]._id,
      userId: users[i % users.length]._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      createdAt: faker.date.recent()
    };
    reviews.push(reviewData);
  }

  const createdReviews = await Review.insertMany(reviews);
  console.log(`✅ Created ${createdReviews.length} reviews`);
  return createdReviews;
}

async function seedServices(vendors) {
  console.log('🔧 Seeding services...');
  
  // Create Service model schema
  const ServiceSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    priceType: { type: String, enum: ['fixed', 'per-person', 'per-hour'], default: 'fixed' },
    duration: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }],
    features: [{ type: String }],
    requirements: [{ type: String }]
  }, { timestamps: true });

  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
  
  const services = [];
  for (let i = 0; i < 50; i++) {
    const serviceData = {
      vendor: vendors[i % vendors.length]._id,
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement(['photography', 'decoration', 'catering', 'music', 'transport', 'beauty', 'jewelry', 'fashion']),
      price: faker.number.int({ min: 5000, max: 100000 }),
      priceType: faker.helpers.arrayElement(['fixed', 'per-person', 'per-hour']),
      duration: faker.number.int({ min: 2, max: 12 }),
      isActive: true,
      images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.image.url()),
      features: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => faker.lorem.word()),
      requirements: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.lorem.sentence())
    };
    services.push(serviceData);
  }

  const createdServices = await Service.insertMany(services);
  console.log(`✅ Created ${createdServices.length} services`);
  return createdServices;
}

async function seedTasks(users) {
  console.log('✅ Seeding tasks...');
  
  // Create Task model schema
  const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
    dueDate: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });

  const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
  
  const tasks = [];
  for (let i = 0; i < 50; i++) {
    const taskData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement(['planning', 'decoration', 'catering', 'photography', 'music', 'transport', 'beauty', 'logistics']),
      priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
      status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed', 'cancelled']),
      dueDate: faker.date.future(),
      assignedTo: faker.datatype.boolean() ? users[i % users.length]._id : undefined,
      createdBy: users[i % users.length]._id,
      isActive: true
    };
    tasks.push(taskData);
  }

  const createdTasks = await Task.insertMany(tasks);
  console.log(`✅ Created ${createdTasks.length} tasks`);
  return createdTasks;
}

async function seedClients(users) {
  console.log('👥 Seeding clients...');
  
  const plannerUsers = users.filter(user => user.role === 'wedding_planner');
  
  // Create Client model schema
  const ClientSchema = new mongoose.Schema({
    plannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    weddingDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
  });

  const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
  
  const clients = [];
  for (let i = 0; i < 50; i++) {
    const plannerUser = plannerUsers[i % plannerUsers.length] || users[i % users.length];
    
    const clientData = {
      plannerId: plannerUser._id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('+94 ## ### ####'),
      weddingDate: faker.date.future(),
      createdAt: faker.date.recent()
    };
    clients.push(clientData);
  }

  const createdClients = await Client.insertMany(clients);
  console.log(`✅ Created ${createdClients.length} clients`);
  return createdClients;
}

async function seedNotifications(users) {
  console.log('🔔 Seeding notifications...');
  
  // Create Notification model schema
  const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    actionUrl: { type: String },
    actionText: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  }, { timestamps: true });

  const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
  
  const notifications = [];
  for (let i = 0; i < 50; i++) {
    const notificationData = {
      user: users[i % users.length]._id,
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      type: faker.helpers.arrayElement([
        'info', 'success', 'warning', 'error', 'booking_request', 
        'booking_status_update', 'new_review', 'payment_received', 
        'new_message', 'service_updated', 'user_status_changed', 
        'vendor_approved', 'vendor_rejected'
      ]),
      isRead: faker.datatype.boolean(),
      isActive: true,
      actionUrl: faker.internet.url(),
      actionText: faker.lorem.word(),
      metadata: { source: 'seeded_data' }
    };
    notifications.push(notificationData);
  }

  const createdNotifications = await Notification.insertMany(notifications);
  console.log(`✅ Created ${createdNotifications.length} notifications`);
  return createdNotifications;
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting WeddingLK Database Seeding...');
    console.log('==========================================');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Seed data in order (respecting dependencies)
    const User = await seedAdmins();
    const users = await seedUsers(User);
    const vendors = await seedVendors(users);
    const venues = await seedVenues(users);
    const services = await seedServices(vendors);
    const bookings = await seedBookings(users, vendors, venues);
    const payments = await seedPayments(users, vendors, venues, bookings);
    const reviews = await seedReviews(vendors, users);
    const tasks = await seedTasks(users);
    const clients = await seedClients(users);
    const notifications = await seedNotifications(users);
    
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('==========================================');
    console.log('📊 Summary of created records:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏢 Vendors: ${vendors.length}`);
    console.log(`   🏰 Venues: ${venues.length}`);
    console.log(`   🔧 Services: ${services.length}`);
    console.log(`   📅 Bookings: ${bookings.length}`);
    console.log(`   💰 Payments: ${payments.length}`);
    console.log(`   ⭐ Reviews: ${reviews.length}`);
    console.log(`   ✅ Tasks: ${tasks.length}`);
    console.log(`   👥 Clients: ${clients.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log('');
    console.log('🎓 Your WeddingLK database is ready for the university presentation!');
    console.log('🌐 Access your app at: http://localhost:3000');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('   • admin@weddinglk.com / admin123');
    console.log('   • superadmin@weddinglk.com / super123');
    console.log('   • maintainer@weddinglk.com / maintain123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding
seedDatabase();
