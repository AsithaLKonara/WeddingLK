import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables')
  process.exit(1)
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  avatar: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Vendor Schema
const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Venue Schema
const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true }
  },
  capacity: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'LKR' }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema)
const Venue = mongoose.models.Venue || mongoose.model('Venue', VenueSchema)

// Seed data
async function seedData() {
  try {
    console.log('🌱 Starting data seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Vendor.deleteMany({})
    await Venue.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Create test users
    const adminUser = await User.create({
      email: 'admin@weddinglk.com',
      name: 'Admin User',
      role: 'admin',
      isVerified: true,
      isActive: true
    })

    const vendorUser = await User.create({
      email: 'vendor@weddinglk.com',
      name: 'John Vendor',
      role: 'vendor',
      isVerified: true,
      isActive: true
    })

    const regularUser = await User.create({
      email: 'user@weddinglk.com',
      name: 'Jane User',
      role: 'user',
      isVerified: true,
      isActive: true
    })

    console.log('👥 Created test users')

    // Create test vendors
    const vendors = await Vendor.create([
      {
        name: 'John Vendor',
        businessName: 'Perfect Photography',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western'
        },
        contact: {
          phone: '+94 11 123 4567',
          email: 'john@perfectphoto.com'
        },
        rating: { average: 4.8, count: 25 },
        owner: vendorUser._id,
        isVerified: true,
        isActive: true
      },
      {
        name: 'Sarah Caterer',
        businessName: 'Elegant Catering',
        category: 'catering',
        description: 'Delicious wedding catering services',
        location: {
          address: '456 Oak Ave',
          city: 'Kandy',
          province: 'Central'
        },
        contact: {
          phone: '+94 81 234 5678',
          email: 'sarah@elegantcatering.com'
        },
        rating: { average: 4.6, count: 18 },
        owner: vendorUser._id,
        isVerified: true,
        isActive: true
      }
    ])

    console.log('🏢 Created test vendors')

    // Create test venues
    const venues = await Venue.create([
      {
        name: 'Grand Hotel Ballroom',
        description: 'Elegant ballroom for your special day',
        location: {
          address: '789 Luxury Blvd',
          city: 'Colombo',
          province: 'Western'
        },
        capacity: { min: 100, max: 300 },
        pricing: { basePrice: 50000, currency: 'LKR' },
        rating: { average: 4.7, count: 32 },
        owner: adminUser._id,
        isActive: true
      },
      {
        name: 'Garden Palace',
        description: 'Beautiful outdoor garden venue',
        location: {
          address: '321 Garden Rd',
          city: 'Galle',
          province: 'Southern'
        },
        capacity: { min: 50, max: 150 },
        pricing: { basePrice: 35000, currency: 'LKR' },
        rating: { average: 4.5, count: 15 },
        owner: adminUser._id,
        isActive: true
      }
    ])

    console.log('🏰 Created test venues')

    console.log('✅ Data seeding completed successfully!')
    console.log(`📊 Created: ${await User.countDocuments()} users, ${await Vendor.countDocuments()} vendors, ${await Venue.countDocuments()} venues`)

  } catch (error) {
    console.error('❌ Error seeding data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

// Run seeding
connectDB().then(seedData) 