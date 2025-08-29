const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Import models
const User = require('../lib/models/user');
const Vendor = require('../lib/models/vendor');
const Venue = require('../lib/models/venue');
const Booking = require('../lib/models/booking');
const Payment = require('../lib/models/Payment');
const Review = require('../lib/models/review');
const Service = require('../lib/models/service');
const Message = require('../lib/models/message');
const Notification = require('../lib/models/notification');
const Task = require('../lib/models/task');
const Client = require('../lib/models/client');
const Conversation = require('../lib/models/conversation');
const VendorProfile = require('../lib/models/vendorProfile');
const WeddingPlannerProfile = require('../lib/models/weddingPlannerProfile');
const Document = require('../lib/models/document');
const VenueBoost = require('../lib/models/venueBoost');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/weddinglk_dev?authSource=admin';

// Sample data generators
const generateLocation = () => ({
  country: 'Sri Lanka',
  state: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province']),
  city: faker.location.city(),
  zipCode: faker.location.zipCode(),
  coordinates: {
    latitude: faker.location.latitude({ min: 5.9, max: 9.9 }),
    longitude: faker.location.longitude({ min: 79.5, max: 81.9 })
  }
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

const generateSocialAccounts = () => ({
  google: {
    id: faker.string.alphanumeric(21),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    picture: faker.image.avatar()
  },
  facebook: {
    id: faker.string.alphanumeric(15),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    picture: faker.image.avatar()
  },
  instagram: {
    id: faker.string.alphanumeric(10),
    username: faker.internet.userName(),
    fullName: faker.person.fullName(),
    picture: faker.image.avatar()
  }
});

const generatePreferences = () => ({
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
      preferences: generatePreferences(),
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
      preferences: generatePreferences(),
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
      preferences: generatePreferences(),
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      status: 'active',
      lastActiveAt: new Date()
    }
  ];

  for (const adminData of adminUsers) {
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (!existingAdmin) {
      await User.create(adminData);
      console.log(`✅ Created admin: ${adminData.email}`);
    } else {
      console.log(`⚠️ Admin already exists: ${adminData.email}`);
    }
  }
}

async function seedUsers() {
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
      preferences: generatePreferences(),
      socialAccounts: generateSocialAccounts(),
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

async function seedServices(vendors) {
  console.log('🔧 Seeding services...');
  
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

async function seedBookings(users, vendors, venues) {
  console.log('📅 Seeding bookings...');
  
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

async function seedTasks(users) {
  console.log('✅ Seeding tasks...');
  
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

async function seedConversations(users, bookings, venues, vendors) {
  console.log('💬 Seeding conversations...');
  
  const conversations = [];
  for (let i = 0; i < 50; i++) {
    const conversationData = {
      participants: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
        user: users[i % users.length]._id,
        role: faker.helpers.arrayElement(['couple', 'vendor', 'planner', 'admin']),
        isActive: true,
        joinedAt: faker.date.recent()
      })),
      conversationType: faker.helpers.arrayElement(['direct', 'group', 'booking', 'support']),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      bookingId: faker.datatype.boolean() ? bookings[i % bookings.length]._id : undefined,
      venueId: faker.datatype.boolean() ? venues[i % venues.length]._id : undefined,
      vendorId: faker.datatype.boolean() ? vendors[i % vendors.length]._id : undefined,
      lastMessage: {
        content: faker.lorem.sentence(),
        sender: users[i % users.length]._id,
        timestamp: faker.date.recent(),
        messageType: 'text'
      },
      unreadCounts: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        user: users[i % users.length]._id,
        count: faker.number.int({ min: 0, max: 10 }),
        lastReadAt: faker.date.recent()
      })),
      isActive: true,
      isArchived: false
    };
    conversations.push(conversationData);
  }

  const createdConversations = await Conversation.insertMany(conversations);
  console.log(`✅ Created ${createdConversations.length} conversations`);
  return createdConversations;
}

async function seedMessages(users, conversations) {
  console.log('💌 Seeding messages...');
  
  const messages = [];
  for (let i = 0; i < 50; i++) {
    const messageData = {
      sender: users[i % users.length]._id,
      receiver: users[(i + 1) % users.length]._id,
      conversationId: conversations[i % conversations.length]._id.toString(),
      content: faker.lorem.paragraph(),
      messageType: faker.helpers.arrayElement(['text', 'image', 'file', 'audio']),
      isRead: faker.datatype.boolean(),
      isDeleted: false,
      attachments: faker.datatype.boolean() ? [faker.image.url()] : [],
      replyTo: faker.datatype.boolean() && i > 0 ? messages[i - 1]?._id : undefined
    };
    messages.push(messageData);
  }

  const createdMessages = await Message.insertMany(messages);
  console.log(`✅ Created ${createdMessages.length} messages`);
  return createdMessages;
}

async function seedNotifications(users) {
  console.log('🔔 Seeding notifications...');
  
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

async function seedDocuments(users) {
  console.log('📄 Seeding documents...');
  
  const documents = [];
  for (let i = 0; i < 50; i++) {
    const documentData = {
      userId: users[i % users.length]._id,
      documentType: faker.helpers.arrayElement(['identity', 'business_license', 'certification', 'insurance', 'portfolio', 'other']),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      fileName: faker.system.fileName(),
      originalName: faker.system.fileName(),
      fileUrl: faker.image.url(),
      thumbnailUrl: faker.image.url(),
      fileSize: faker.number.int({ min: 100000, max: 10000000 }),
      mimeType: faker.helpers.arrayElement(['image/jpeg', 'image/png', 'application/pdf', 'image/gif']),
      status: faker.helpers.arrayElement(['pending', 'verified', 'rejected', 'expired']),
      verificationNotes: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
      verifiedBy: faker.datatype.boolean() ? users[i % users.length]._id : undefined,
      verifiedAt: faker.datatype.boolean() ? faker.date.recent() : undefined,
      expiresAt: faker.date.future(),
      tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.word()),
      metadata: {
        category: faker.lorem.word(),
        subcategory: faker.lorem.word(),
        documentNumber: faker.string.alphanumeric(10),
        issuingAuthority: faker.company.name(),
        issueDate: faker.date.past(),
        expiryDate: faker.date.future()
      }
    };
    documents.push(documentData);
  }

  const createdDocuments = await Document.insertMany(documents);
  console.log(`✅ Created ${createdDocuments.length} documents`);
  return createdDocuments;
}

async function seedVenueBoosts(venues, users) {
  console.log('🚀 Seeding venue boosts...');
  
  const venueBoosts = [];
  for (let i = 0; i < 50; i++) {
    const boostData = {
      venue: venues[i % venues.length]._id,
      owner: users[i % users.length]._id,
      boostType: faker.helpers.arrayElement(['basic', 'premium', 'featured', 'trending']),
      status: faker.helpers.arrayElement(['pending', 'active', 'paused', 'completed', 'cancelled']),
      budget: {
        amount: faker.number.int({ min: 10000, max: 1000000 }),
        spent: faker.number.int({ min: 0, max: 500000 }),
        remaining: faker.number.int({ min: 1000, max: 500000 }),
        currency: 'LKR'
      },
      duration: {
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        days: faker.number.int({ min: 7, max: 90 })
      },
      targeting: {
        locations: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.location.city()),
        guestCount: {
          min: faker.number.int({ min: 50, max: 200 }),
          max: faker.number.int({ min: 200, max: 1000 })
        },
        eventTypes: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.helpers.arrayElement(['wedding', 'reception', 'engagement', 'anniversary'])),
        priceRange: {
          min: faker.number.int({ min: 100000, max: 1000000 }),
          max: faker.number.int({ min: 1000000, max: 5000000 })
        },
        seasons: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.helpers.arrayElement(['spring', 'summer', 'autumn', 'winter'])),
        daysOfWeek: Array.from({ length: faker.number.int({ min: 1, max: 7 }) }, () => faker.helpers.arrayElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
      },
      performance: {
        impressions: faker.number.int({ min: 1000, max: 100000 }),
        clicks: faker.number.int({ min: 50, max: 5000 }),
        views: faker.number.int({ min: 100, max: 10000 }),
        inquiries: faker.number.int({ min: 10, max: 500 }),
        bookings: faker.number.int({ min: 1, max: 50 }),
        ctr: faker.number.float({ min: 0.01, max: 0.15, precision: 0.01 }),
        cpc: faker.number.float({ min: 10, max: 500, precision: 0.01 }),
        cpm: faker.number.float({ min: 1000, max: 50000, precision: 0.01 }),
        roi: faker.number.float({ min: 1.0, max: 10.0, precision: 0.1 })
      },
      dailyStats: Array.from({ length: faker.number.int({ min: 7, max: 30 }) }, () => ({
        date: faker.date.recent(),
        impressions: faker.number.int({ min: 50, max: 5000 }),
        clicks: faker.number.int({ min: 5, max: 500 }),
        views: faker.number.int({ min: 10, max: 1000 }),
        inquiries: faker.number.int({ min: 1, max: 50 }),
        bookings: faker.number.int({ min: 0, max: 10 }),
        spend: faker.number.int({ min: 100, max: 10000 })
      })),
      autoRenew: faker.datatype.boolean(),
      bidAmount: faker.number.int({ min: 100, max: 10000 })
    };
    venueBoosts.push(boostData);
  }

  const createdVenueBoosts = await VenueBoost.insertMany(venueBoosts);
  console.log(`✅ Created ${createdVenueBoosts.length} venue boosts`);
  return createdVenueBoosts;
}

async function seedVendorProfiles(vendors, users) {
  console.log('🏢 Seeding vendor profiles...');
  
  const vendorProfiles = [];
  for (let i = 0; i < 50; i++) {
    const vendorProfileData = {
      vendor: vendors[i % vendors.length]._id,
      owner: users[i % users.length]._id,
      businessDetails: {
        businessName: faker.company.name(),
        businessType: faker.helpers.arrayElement(['sole_proprietorship', 'partnership', 'corporation', 'llc']),
        registrationNumber: faker.string.alphanumeric(10),
        taxId: faker.string.alphanumeric(12),
        yearEstablished: faker.number.int({ min: 1990, max: 2024 }),
        employeeCount: faker.number.int({ min: 1, max: 100 })
      },
      certifications: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
        name: faker.lorem.word(),
        issuingAuthority: faker.company.name(),
        issueDate: faker.date.past(),
        expiryDate: faker.date.future(),
        certificateNumber: faker.string.alphanumeric(8)
      })),
      insurance: {
        hasInsurance: faker.datatype.boolean(),
        provider: faker.datatype.boolean() ? faker.company.name() : undefined,
        policyNumber: faker.datatype.boolean() ? faker.string.alphanumeric(10) : undefined,
        coverageAmount: faker.datatype.boolean() ? faker.number.int({ min: 1000000, max: 10000000 }) : undefined,
        expiryDate: faker.datatype.boolean() ? faker.date.future() : undefined
      },
      portfolio: {
        description: faker.lorem.paragraph(),
        highlights: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.lorem.sentence()),
        images: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => faker.image.url()),
        videos: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => faker.internet.url())
      },
      socialProof: {
        testimonials: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => ({
          clientName: faker.person.fullName(),
          clientImage: faker.image.avatar(),
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: faker.lorem.paragraph(),
          date: faker.date.recent()
        })),
        awards: Array.from({ length: faker.number.int({ min: 0, max: 4 }) }, () => ({
          name: faker.lorem.words(3),
          year: faker.number.int({ min: 2015, max: 2024 }),
          organization: faker.company.name(),
          description: faker.lorem.sentence()
        })),
        mediaFeatures: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
          title: faker.lorem.sentence(),
          publication: faker.company.name(),
          date: faker.date.recent(),
          url: faker.internet.url()
        }))
      },
      subscription: {
        plan: faker.helpers.arrayElement(['basic', 'premium', 'pro']),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        autoRenew: faker.datatype.boolean(),
        features: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.lorem.word())
      },
      isVerified: faker.datatype.boolean(),
      verificationDate: faker.datatype.boolean() ? faker.date.recent() : undefined,
      verificationNotes: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined
    };
    vendorProfiles.push(vendorProfileData);
  }

  const createdVendorProfiles = await VendorProfile.insertMany(vendorProfiles);
  console.log(`✅ Created ${createdVendorProfiles.length} vendor profiles`);
  return createdVendorProfiles;
}

async function seedWeddingPlannerProfiles(users) {
  console.log('👰 Seeding wedding planner profiles...');
  
  const plannerUsers = users.filter(user => user.role === 'wedding_planner');
  const plannerProfiles = [];
  
  for (let i = 0; i < 50; i++) {
    const plannerUser = plannerUsers[i % plannerUsers.length] || users[i % users.length];
    
    const plannerProfileData = {
      owner: plannerUser._id,
      businessDetails: {
        businessName: faker.company.name(),
        businessType: faker.helpers.arrayElement(['sole_proprietorship', 'partnership', 'corporation', 'llc']),
        registrationNumber: faker.string.alphanumeric(10),
        yearEstablished: faker.number.int({ min: 1990, max: 2024 }),
        employeeCount: faker.number.int({ min: 1, max: 50 })
      },
      specialties: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => faker.helpers.arrayElement([
        'destination_weddings', 'traditional_weddings', 'modern_weddings', 'cultural_weddings',
        'intimate_weddings', 'luxury_weddings', 'budget_weddings', 'eco_friendly_weddings'
      ])),
      experience: {
        yearsOfExperience: faker.number.int({ min: 1, max: 25 }),
        weddingsPlanned: faker.number.int({ min: 10, max: 500 }),
        averageGuestCount: faker.number.int({ min: 50, max: 300 }),
        successRate: faker.number.float({ min: 0.85, max: 1.0, precision: 0.01 })
      },
      portfolio: {
        description: faker.lorem.paragraph(),
        featuredWeddings: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          images: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.image.url()),
          date: faker.date.past(),
          guestCount: faker.number.int({ min: 50, max: 300 }),
          budget: faker.number.int({ min: 500000, max: 5000000 })
        })),
        testimonials: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => ({
          clientName: faker.person.fullName(),
          clientImage: faker.image.avatar(),
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: faker.lorem.paragraph(),
          date: faker.date.recent()
        }))
      },
      pricing: {
        structure: faker.helpers.arrayElement(['percentage', 'fixed', 'hourly', 'package']),
        basePrice: faker.number.int({ min: 50000, max: 500000 }),
        percentageRate: faker.datatype.boolean() ? faker.number.float({ min: 0.05, max: 0.20, precision: 0.01 }) : undefined,
        hourlyRate: faker.datatype.boolean() ? faker.number.int({ min: 2000, max: 10000 }) : undefined,
        packages: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
          name: faker.helpers.arrayElement(['Basic', 'Standard', 'Premium', 'Luxury']),
          price: faker.number.int({ min: 30000, max: 300000 }),
          features: Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => faker.lorem.sentence()),
          description: faker.lorem.paragraph()
        }))
      },
      availability: {
        isAvailable: faker.datatype.boolean(),
        nextAvailableDate: faker.date.future(),
        maxBookingsPerMonth: faker.number.int({ min: 1, max: 8 }),
        advanceBookingRequired: faker.number.int({ min: 3, max: 12 })
      },
      isVerified: faker.datatype.boolean(),
      verificationDate: faker.datatype.boolean() ? faker.date.recent() : undefined
    };
    plannerProfiles.push(plannerProfileData);
  }

  const createdPlannerProfiles = await WeddingPlannerProfile.insertMany(plannerProfiles);
  console.log(`✅ Created ${createdPlannerProfiles.length} wedding planner profiles`);
  return createdPlannerProfiles;
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting WeddingLK Database Seeding...');
    console.log('==========================================');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (optional - uncomment if you want fresh data)
    // console.log('🗑️ Clearing existing data...');
    // await Promise.all([
    //   User.deleteMany({}),
    //   Vendor.deleteMany({}),
    //   Venue.deleteMany({}),
    //   // ... other collections
    // ]);
    
    // Seed data in order (respecting dependencies)
    await seedAdmins();
    const users = await seedUsers();
    const vendors = await seedVendors(users);
    const venues = await seedVenues(users);
    const services = await seedServices(vendors);
    const bookings = await seedBookings(users, vendors, venues);
    const payments = await seedPayments(users, vendors, venues, bookings);
    const reviews = await seedReviews(vendors, users);
    const tasks = await seedTasks(users);
    const clients = await seedClients(users);
    const conversations = await seedConversations(users, bookings, venues, vendors);
    const messages = await seedMessages(users, conversations);
    const notifications = await seedNotifications(users);
    const documents = await seedDocuments(users);
    const venueBoosts = await seedVenueBoosts(venues, users);
    const vendorProfiles = await seedVendorProfiles(vendors, users);
    const plannerProfiles = await seedWeddingPlannerProfiles(users);
    
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
    console.log(`   💬 Conversations: ${conversations.length}`);
    console.log(`   💌 Messages: ${messages.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log(`   📄 Documents: ${documents.length}`);
    console.log(`   🚀 Venue Boosts: ${venueBoosts.length}`);
    console.log(`   🏢 Vendor Profiles: ${vendorProfiles.length}`);
    console.log(`   👰 Planner Profiles: ${plannerProfiles.length}`);
    console.log('');
    console.log('🎓 Your WeddingLK database is ready for the university presentation!');
    console.log('🌐 Access your app at: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
