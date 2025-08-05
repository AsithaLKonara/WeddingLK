#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script seeds the database with mock data for development and testing.
 * 
 * Usage:
 *   npm run seed
 *   node scripts/seed-database.js
 */

const { seedDatabase } = require('../lib/database-seeder')

async function main() {
  try {
    console.log('🚀 Starting WeddingLK Database Seeding...')
    console.log('==========================================')
    
    const result = await seedDatabase()
    
    console.log('==========================================')
    console.log('✅ Database seeding completed successfully!')
    console.log('📊 Final Summary:')
    console.log(`   👥 Users: ${result.users}`)
    console.log(`   🏛️ Venues: ${result.venues}`)
    console.log(`   👨‍💼 Vendors: ${result.vendors}`)
    console.log(`   📅 Bookings: ${result.bookings}`)
    console.log(`   💰 Payments: ${result.payments}`)
    console.log('')
    console.log('🎉 Your WeddingLK database is now ready!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Test the API endpoints')
    console.log('3. Explore the dashboard with the seeded data')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeder
main() 