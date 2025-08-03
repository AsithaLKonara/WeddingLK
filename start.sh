#!/bin/sh

# Start MongoDB in the background
echo "Starting MongoDB..."
mongod --config /etc/mongod.conf --fork --logpath /var/log/mongodb/mongod.log

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until mongo --eval "print('MongoDB is ready')" > /dev/null 2>&1; do
  echo "Waiting for MongoDB..."
  sleep 1
done

echo "MongoDB is ready!"

# Initialize database with seed data if it doesn't exist
echo "Checking if database needs seeding..."
if ! mongo weddinglk --eval "db.users.countDocuments()" | grep -q "[1-9]"; then
  echo "Seeding database..."
  node scripts/seed-database-production.mjs
  echo "Database seeded successfully!"
else
  echo "Database already contains data, skipping seed."
fi

# Start the Next.js application
echo "Starting Next.js application..."
exec node server.js 