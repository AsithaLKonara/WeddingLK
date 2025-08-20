#!/usr/bin/env node

import seedDatabase from './comprehensive-seed.mjs'

console.log('Starting WeddingLK database seeding...')
console.log('This will populate the database with sample data for testing.')

seedDatabase()
  .then(() => {
    console.log('✅ Database seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }) 