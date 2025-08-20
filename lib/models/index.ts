// Import all models
import { User } from './user';
import { Vendor } from './vendor';
import { Venue } from './venue';
import { Booking } from './booking';
import { Payment } from './Payment';
import { Review } from './review';
import { Service } from './service';
import { Message } from './message';
import { Notification } from './notification';
import { Task } from './task';
import VenueBoost from './venueBoost';
import { Client } from './client';
import { Conversation } from './conversation';
import { VendorProfile } from './vendorProfile';
import { WeddingPlannerProfile } from './weddingPlannerProfile';
import Document from './document';

// Export all models
export {
  User,
  Vendor,
  Venue,
  Booking,
  Payment,
  Review,
  Service,
  Message,
  Notification,
  Task,
  Client,
  Conversation,
  VendorProfile,
  WeddingPlannerProfile,
  Document,
};

// Export VenueBoost as default
export { default as VenueBoost } from './venueBoost';

// Export User as default as well (for backward compatibility)
export { User as default } from './user';

// Performance optimization: Create compound indexes for common queries
export const createPerformanceIndexes = async () => {
  try {
    // User indexes for faster authentication and role-based queries
    await User.collection.createIndex({ email: 1, role: 1 });
    await User.collection.createIndex({ role: 1, status: 1 });
    
    // Vendor indexes for faster search and filtering
    await Vendor.collection.createIndex({ businessType: 1, isVerified: 1 });
    await Vendor.collection.createIndex({ 'location.city': 1, rating: -1 });
    
    // Venue indexes for faster search and availability queries
    await Venue.collection.createIndex({ type: 1, capacity: 1 });
    await Venue.collection.createIndex({ 'location.city': 1, isAvailable: 1 });
    
    // Booking indexes for faster date-based queries
    await Booking.collection.createIndex({ eventDate: 1, status: 1 });
    await Booking.collection.createIndex({ clientId: 1, eventDate: -1 });
    
    console.log('✅ Performance indexes created successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('⚠️ Some performance indexes may already exist:', errorMessage);
  }
};

console.log('✅ All models registered successfully') 