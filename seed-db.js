const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/weddinglk_dev?authSource=admin';

// Simple seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting WeddingLK Database Seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create 3 admin users
    console.log('🌐 Creating admin users...');
    const adminUsers = [
      {
        email: 'admin@weddinglk.com',
        password: await bcrypt.hash('admin123', 12),
        name: 'System Administrator',
        role: 'admin',
        roleVerified: true,
        location: { country: 'Sri Lanka', state: 'Western Province', city: 'Colombo' },
        preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo' },
        isEmailVerified: true,
        status: 'active'
      },
      {
        email: 'superadmin@weddinglk.com',
        password: await bcrypt.hash('super123', 12),
        name: 'Super Administrator',
        role: 'admin',
        roleVerified: true,
        location: { country: 'Sri Lanka', state: 'Central Province', city: 'Kandy' },
        preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo' },
        isEmailVerified: true,
        status: 'active'
      },
      {
        email: 'maintainer@weddinglk.com',
        password: await bcrypt.hash('maintain123', 12),
        name: 'System Maintainer',
        role: 'maintainer',
        roleVerified: true,
        location: { country: 'Sri Lanka', state: 'Southern Province', city: 'Galle' },
        preferences: { language: 'en', currency: 'LKR', timezone: 'Asia/Colombo' },
        isEmailVerified: true,
        status: 'active'
      }
    ];

    // Create User model schema
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
      roleVerified: { type: Boolean, default: false },
      location: { type: Object, required: true },
      preferences: { type: Object, required: true },
      isEmailVerified: { type: Boolean, default: false },
      status: { type: String, default: 'active' }
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

    // Create 50 regular users
    console.log('👥 Creating regular users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const userData = {
        email: faker.internet.email(),
        password: await bcrypt.hash('password123', 12),
        name: faker.person.fullName(),
        role: faker.helpers.arrayElement(['user', 'vendor', 'wedding_planner']),
        roleVerified: faker.datatype.boolean(),
        location: { 
          country: 'Sri Lanka', 
          state: faker.helpers.arrayElement(['Western Province', 'Central Province', 'Southern Province']),
          city: faker.location.city()
        },
        preferences: {
          language: 'en',
          currency: 'LKR',
          timezone: 'Asia/Colombo'
        },
        isEmailVerified: faker.datatype.boolean(),
        status: 'active'
      };
      users.push(userData);
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} regular users`);

    // Create 50 vendors
    console.log('🏢 Creating vendors...');
    const VendorSchema = new mongoose.Schema({
      name: { type: String, required: true },
      businessName: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String, required: true },
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      isVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

    const vendors = [];
    for (let i = 0; i < 50; i++) {
      const vendorData = {
        name: faker.company.name(),
        businessName: faker.company.name(),
        category: faker.helpers.arrayElement(['photographer', 'decorator', 'catering', 'music', 'transport', 'makeup', 'jewelry', 'clothing']),
        description: faker.lorem.paragraph(),
        owner: createdUsers[i % createdUsers.length]._id,
        isVerified: faker.datatype.boolean(),
        isActive: true
      };
      vendors.push(vendorData);
    }

    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    // Create 50 venues
    console.log('🏰 Creating venues...');
    const VenueSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      capacity: { type: Object, required: true },
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const Venue = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);

    const venues = [];
    for (let i = 0; i < 50; i++) {
      const venueData = {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        capacity: {
          min: faker.number.int({ min: 50, max: 200 }),
          max: faker.number.int({ min: 200, max: 1000 })
        },
        owner: createdUsers[i % createdUsers.length]._id,
        isActive: true
      };
      venues.push(venueData);
    }

    const createdVenues = await Venue.insertMany(venues);
    console.log(`✅ Created ${createdVenues.length} venues`);

    // Create 50 bookings
    console.log('📅 Creating bookings...');
    const BookingSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
      date: { type: Date, required: true },
      status: { type: String, default: 'pending' },
      totalAmount: { type: Number, required: true },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

    const bookings = [];
    for (let i = 0; i < 50; i++) {
      const bookingData = {
        user: createdUsers[i % createdUsers.length]._id,
        vendor: faker.datatype.boolean() ? createdVendors[i % createdVendors.length]._id : undefined,
        venue: faker.datatype.boolean() ? createdVenues[i % createdVenues.length]._id : undefined,
        date: faker.date.future(),
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled', 'completed']),
        totalAmount: faker.number.int({ min: 100000, max: 2000000 }),
        isActive: true
      };
      bookings.push(bookingData);
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    // Create 50 payments
    console.log('💰 Creating payments...');
    const PaymentSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'LKR' },
      status: { type: String, default: 'pending' },
      paymentMethod: { type: String, required: true }
    }, { timestamps: true });

    const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

    const payments = [];
    for (let i = 0; i < 50; i++) {
      const paymentData = {
        user: createdUsers[i % createdUsers.length]._id,
        amount: faker.number.int({ min: 10000, max: 500000 }),
        currency: 'LKR',
        status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'failed', 'refunded']),
        paymentMethod: faker.helpers.arrayElement(['credit_card', 'debit_card', 'bank_transfer', 'mobile_payment', 'cash'])
      };
      payments.push(paymentData);
    }

    const createdPayments = await Payment.insertMany(payments);
    console.log(`✅ Created ${createdPayments.length} payments`);

    // Create 50 reviews
    console.log('⭐ Creating reviews...');
    const ReviewSchema = new mongoose.Schema({
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String }
    });

    const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

    const reviews = [];
    for (let i = 0; i < 50; i++) {
      const reviewData = {
        vendorId: createdVendors[i % createdVendors.length]._id,
        userId: createdUsers[i % createdUsers.length]._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph()
      };
      reviews.push(reviewData);
    }

    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    // Create 50 services
    console.log('🔧 Creating services...');
    const ServiceSchema = new mongoose.Schema({
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

    const services = [];
    for (let i = 0; i < 50; i++) {
      const serviceData = {
        vendor: createdVendors[i % createdVendors.length]._id,
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: faker.number.int({ min: 5000, max: 100000 }),
        isActive: true
      };
      services.push(serviceData);
    }

    const createdServices = await Service.insertMany(services);
    console.log(`✅ Created ${createdServices.length} services`);

    // Create 50 tasks
    console.log('✅ Creating tasks...');
    const TaskSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String },
      category: { type: String, required: true },
      priority: { type: String, default: 'medium' },
      status: { type: String, default: 'pending' },
      dueDate: { type: Date, required: true },
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
        createdBy: createdUsers[i % createdUsers.length]._id,
        isActive: true
      };
      tasks.push(taskData);
    }

    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Created ${createdTasks.length} tasks`);

    // Create 50 clients
    console.log('👥 Creating clients...');
    const ClientSchema = new mongoose.Schema({
      plannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
      weddingDate: { type: Date }
    });

    const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

    const clients = [];
    for (let i = 0; i < 50; i++) {
      const clientData = {
        plannerId: createdUsers[i % createdUsers.length]._id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number('+94 ## ### ####'),
        weddingDate: faker.date.future()
      };
      clients.push(clientData);
    }

    const createdClients = await Client.insertMany(clients);
    console.log(`✅ Created ${createdClients.length} clients`);

    // Create 50 notifications
    console.log('🔔 Creating notifications...');
    const NotificationSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      type: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

    const notifications = [];
    for (let i = 0; i < 50; i++) {
      const notificationData = {
        user: createdUsers[i % createdUsers.length]._id,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error', 'booking_request', 'payment_received', 'new_message']),
        isRead: faker.datatype.boolean(),
        isActive: true
      };
      notifications.push(notificationData);
    }

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Created ${createdNotifications.length} notifications`);

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('==========================================');
    console.log('📊 Summary of created records:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🏢 Vendors: ${createdVendors.length}`);
    console.log(`   🏰 Venues: ${createdVenues.length}`);
    console.log(`   🔧 Services: ${createdServices.length}`);
    console.log(`   📅 Bookings: ${createdBookings.length}`);
    console.log(`   💰 Payments: ${createdPayments.length}`);
    console.log(`   ⭐ Reviews: ${createdReviews.length}`);
    console.log(`   ✅ Tasks: ${createdTasks.length}`);
    console.log(`   👥 Clients: ${createdClients.length}`);
    console.log(`   🔔 Notifications: ${createdNotifications.length}`);
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
