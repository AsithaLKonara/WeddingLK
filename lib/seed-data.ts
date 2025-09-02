// Data Seeder for WeddingLK Local Database
// Generates 50 rows of realistic sample data for each table

import { localDb } from './db-local';
import {
  User,
  Venue,
  Vendor,
  Booking,
  Payment,
  Message,
  Task,
  UserPreferences,
} from './types';

// Sample data generators
const generateUsers = (): User[] => {
  const users: User[] = [];

  for (let i = 1; i <= 50; i++) {
    const user: User = {
      id: `user_${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      role: i <= 5 ? 'admin' : i <= 15 ? 'vendor' : 'user',
      isVerified: Math.random() > 0.2,
      authProvider: 'credentials',
      preferences: {
        weddingDate: new Date(
          Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000
        ),
        budget: Math.floor(Math.random() * 50000) + 10000,
        guestCount: Math.floor(Math.random() * 200) + 50,
        location: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura'][
          Math.floor(Math.random() * 5)
        ] || 'Colombo',
        style: ['Traditional', 'Modern', 'Rustic', 'Elegant', 'Bohemian'][
          Math.floor(Math.random() * 5)
        ] || 'Traditional',
        theme: ['Romantic', 'Classic', 'Vintage', 'Contemporary', 'Cultural'][
          Math.floor(Math.random() * 5)
        ] || 'Romantic',
      },
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    users.push(user);
  }

  return users;
};

const generateVenues = (): Venue[] => {
  const venues: Venue[] = [];
  const locations = [
    'Colombo',
    'Kandy',
    'Galle',
    'Jaffna',
    'Anuradhapura',
    'Kurunegala',
    'Ratnapura',
    'Badulla',
  ];
  const venueTypes = [
    'Hotel',
    'Garden',
    'Beach Resort',
    'Historic Building',
    'Country Club',
    'Restaurant',
    'Banquet Hall',
    'Outdoor Venue',
  ];

  for (let i = 1; i <= 50; i++) {
    const venue: Venue = {
      id: `venue_${i}`,
      name: `${venueTypes[Math.floor(Math.random() * venueTypes.length)]} ${i}`,
      location: locations[Math.floor(Math.random() * locations.length)] || 'Colombo',
      capacity: Math.floor(Math.random() * 500) + 100,
      price: Math.floor(Math.random() * 100000) + 20000,
      isAvailable: Math.random() > 0.3,
      isVerified: Math.random() > 0.1,
      rating: Math.floor(Math.random() * 5) + 1,
      images: [`/images/venue-${i}-1.jpg`, `/images/venue-${i}-2.jpg`],
      amenities: [
        'Parking',
        'Catering',
        'Decoration',
        'Music System',
        'Photography Area',
      ].slice(0, Math.floor(Math.random() * 5) + 1),
      description: `Beautiful ${(venueTypes[Math.floor(Math.random() * venueTypes.length)] || 'Venue').toLowerCase()} perfect for your special day.`,
      ownerId: `user_${Math.floor(Math.random() * 15) + 1}`,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    venues.push(venue);
  }

  return venues;
};

const generateVendors = (): Vendor[] => {
  const vendors: Vendor[] = [];
  const categories = [
    'Photography',
    'Videography',
    'Catering',
    'Decoration',
    'Music',
    'Transport',
    'Beauty',
    'Flowers',
    'Cake',
    'DJ',
  ];
  const locations = [
    'Colombo',
    'Kandy',
    'Galle',
    'Jaffna',
    'Anuradhapura',
    'Kurunegala',
    'Ratnapura',
    'Badulla',
  ];

  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const vendor: Vendor = {
      id: `vendor_${i}`,
      name: `${category} Pro ${i}`,
      category: category || 'photographer',
      location: locations[Math.floor(Math.random() * locations.length)] || 'Colombo',
      price: Math.floor(Math.random() * 50000) + 5000,
      isActive: Math.random() > 0.2,
      isVerified: Math.random() > 0.1,
      rating: Math.floor(Math.random() * 5) + 1,
      portfolio: [`/images/vendor-${i}-1.jpg`, `/images/vendor-${i}-2.jpg`],
      description: `Professional ${(category || 'photographer').toLowerCase()} services for your wedding.`,
      ownerId: `user_${Math.floor(Math.random() * 15) + 1}`,
      services: [(category || 'photographer'), 'Consultation', 'Custom Packages'],
      availability: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '18:00',
          isAvailable: true,
        },
        {
          day: 'Tuesday',
          startTime: '09:00',
          endTime: '18:00',
          isAvailable: true,
        },
        {
          day: 'Wednesday',
          startTime: '09:00',
          endTime: '18:00',
          isAvailable: true,
        },
        {
          day: 'Thursday',
          startTime: '09:00',
          endTime: '18:00',
          isAvailable: true,
        },
        {
          day: 'Friday',
          startTime: '09:00',
          endTime: '18:00',
          isAvailable: true,
        },
        {
          day: 'Saturday',
          startTime: '10:00',
          endTime: '16:00',
          isAvailable: true,
        },
        {
          day: 'Sunday',
          startTime: '10:00',
          endTime: '16:00',
          isAvailable: false,
        },
      ],
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    vendors.push(vendor);
  }

  return vendors;
};

const generateBookings = (): Booking[] => {
  const bookings: Booking[] = [];

  for (let i = 1; i <= 50; i++) {
    const booking: Booking = {
      id: `booking_${i}`,
      userId: `user_${Math.floor(Math.random() * 50) + 1}`,
      venueId: `venue_${Math.floor(Math.random() * 50) + 1}`,
      vendorIds: [
        `vendor_${Math.floor(Math.random() * 50) + 1}`,
        `vendor_${Math.floor(Math.random() * 50) + 1}`,
      ],
      date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      startTime: '18:00',
      endTime: '23:00',
      guestCount: Math.floor(Math.random() * 200) + 50,
      status: ['pending', 'confirmed', 'cancelled', 'completed'][
        Math.floor(Math.random() * 4)
      ] as 'pending' | 'confirmed' | 'cancelled' | 'completed',
      totalAmount: Math.floor(Math.random() * 100000) + 20000,
      depositAmount: Math.floor(Math.random() * 20000) + 5000,
      notes: `Special requests for booking ${i}`,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    bookings.push(booking);
  }

  return bookings;
};

const generatePayments = (): Payment[] => {
  const payments: Payment[] = [];

  for (let i = 1; i <= 50; i++) {
    const payment: Payment = {
      id: `payment_${i}`,
      bookingId: `booking_${Math.floor(Math.random() * 50) + 1}`,
      userId: `user_${Math.floor(Math.random() * 50) + 1}`,
      amount: Math.floor(Math.random() * 100000) + 20000,
      currency: 'LKR',
      status: ['pending', 'processing', 'completed', 'failed', 'refunded'][
        Math.floor(Math.random() * 5)
      ] as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
      gateway: ['stripe', 'payhere', 'bank_transfer'][
        Math.floor(Math.random() * 3)
      ] as 'stripe' | 'payhere' | 'bank_transfer',
      gatewayResponse: { transactionId: `txn_${i}` },
      metadata: { bookingId: `booking_${i}` },
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    payments.push(payment);
  }

  return payments;
};

const generateReviews = (): any[] => {
  const _reviews: any[] = [];

  for (let i = 1; i <= 50; i++) {
    const review: any = {
      id: `review_${i}`,
      userId: `user_${Math.floor(Math.random() * 50) + 1}`,
      targetId:
        Math.random() > 0.5
          ? `venue_${Math.floor(Math.random() * 50) + 1}`
          : `vendor_${Math.floor(Math.random() * 50) + 1}`,
      targetType: Math.random() > 0.5 ? 'venue' : 'vendor',
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Great experience! Would definitely recommend.`,
      images: [`/images/review-${i}-1.jpg`],
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    reviews.push(review);
  }

  return reviews;
};

const generateMessages = (): Message[] => {
  const messages: Message[] = [];

  for (let i = 1; i <= 50; i++) {
    const message: Message = {
      id: `message_${i}`,
      senderId: `user_${Math.floor(Math.random() * 50) + 1}`,
      receiverId: `user_${Math.floor(Math.random() * 50) + 1}`,
      content: `This is message ${i} content.`,
      type: 'text',
      isRead: Math.random() > 0.3,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
    };
    messages.push(message);
  }

  return messages;
};

const generateTasks = (): Task[] => {
  const tasks: Task[] = [];

  for (let i = 1; i <= 50; i++) {
    const task: Task = {
      id: `task_${i}`,
      userId: `user_${Math.floor(Math.random() * 50) + 1}`,
      title: `Task ${i}`,
      description: `Description for task ${i}`,
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      status: ['pending', 'in_progress', 'completed', 'cancelled'][
        Math.floor(Math.random() * 4)
      ] as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      category: [
        'Planning',
        'Decoration',
        'Catering',
        'Photography',
        'Music',
        'Transport',
        'Beauty',
        'Administrative',
      ][Math.floor(Math.random() * 8)],
      assignedTo:
        Math.random() > 0.5
          ? `user_${Math.floor(Math.random() * 50) + 1}`
          : undefined,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      updatedAt: new Date(),
    };
    tasks.push(task);
  }

  return tasks;
};

// Main seeding function
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Generate sample data
    const users = generateUsers();
    const venues = generateVenues();
    const vendors = generateVendors();
    const bookings = generateBookings();
    const payments = generatePayments();
    const reviews = generateReviews();
    const messages = generateMessages();
    const tasks = generateTasks();

    // Clear existing data
    localDb.reset();

    // Insert sample data
    for (const user of users) {
      await localDb.create('users', user);
    }

    for (const venue of venues) {
      await localDb.create('venues', venue);
    }

    for (const vendor of vendors) {
      await localDb.create('vendors', vendor);
    }

    for (const booking of bookings) {
      await localDb.create('bookings', booking);
    }

    for (const payment of payments) {
      await localDb.create('payments', payment);
    }

    for (const review of reviews) {
      await localDb.create('reviews', review);
    }

    for (const message of messages) {
      await localDb.create('messages', message);
    }

    for (const task of tasks) {
      await localDb.create('tasks', task);
    }

    console.log('✅ Database seeded successfully!');
    console.log(
      `📊 Inserted ${users.length} users, ${venues.length} venues, ${vendors.length} vendors, ${bookings.length} bookings, ${payments.length} payments, ${reviews.length} reviews, ${messages.length} messages, ${tasks.length} tasks`
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Export individual generators for testing
export {
  generateUsers,
  generateVenues,
  generateVendors,
  generateBookings,
  generatePayments,
  generateReviews,
  generateMessages,
  generateTasks,
};
