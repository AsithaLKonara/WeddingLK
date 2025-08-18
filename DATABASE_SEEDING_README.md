# WeddingLK Database Seeding Guide

This guide explains how to populate the WeddingLK database with sample data for development and testing purposes.

## Prerequisites

1. **MongoDB running** - Make sure MongoDB is running locally or you have access to a MongoDB instance
2. **Environment variables** - Ensure your `.env.local` file has the correct `MONGODB_URI`
3. **Dependencies installed** - Run `npm install` to install all required packages

## Available Seeding Scripts

### 1. Comprehensive Seeding (Recommended)
Populates all collections with realistic sample data:

```bash
npm run seed:comprehensive
```

This script creates:
- Sample users (regular users, vendors, admins)
- Sample vendors with services and pricing
- Sample venues with amenities
- Sample reviews and ratings
- Sample tasks for wedding planning

### 2. Basic Seeding
Creates minimal sample data for quick testing:

```bash
npm run seed:basic
```

### 3. Legacy Seeding
Uses the older seeding script:

```bash
npm run seed
```

## What Gets Created

### Users
- **Regular Users**: john@example.com, jane@example.com (password: password123)
- **Admin User**: admin@weddinglk.com (password: admin123)
- **Vendor User**: vendor@example.com (password: vendor123)

### Vendors
- **Perfect Moments Photography** - Professional wedding photography
- **Elegant Catering Services** - Premium wedding catering
- **Dream Decorations** - Creative wedding decorations

### Venues
- **Grand Ballroom Hotel** - Luxury hotel ballroom in Colombo
- **Garden Palace Resort** - Beautiful garden resort in Kandy

### Sample Data
- Reviews and ratings for vendors and venues
- Wedding planning tasks
- Service packages and pricing
- Location and contact information

## Database Schema

The seeder creates data that follows the established MongoDB schemas:

- **Users**: Authentication, roles, profiles
- **Vendors**: Business information, services, pricing
- **Venues**: Location details, capacity, amenities
- **Reviews**: User feedback and ratings
- **Tasks**: Wedding planning checklist items

## Customization

To modify the sample data:

1. Edit `scripts/comprehensive-seed.mjs`
2. Modify the sample data arrays (sampleUsers, sampleVendors, etc.)
3. Run the seeder again

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify `MONGODB_URI` in `.env.local`
   - Ensure network access to MongoDB instance

2. **Permission Errors**
   - Make sure the MongoDB user has write permissions
   - Check if the database exists and is accessible

3. **Duplicate Key Errors**
   - The seeder checks for existing data and skips duplicates
   - If you need fresh data, drop the collections first

### Reset Database

To start fresh:

```bash
# Connect to MongoDB shell
mongosh

# Switch to weddinglk database
use weddinglk

# Drop all collections
db.dropDatabase()

# Exit MongoDB shell
exit

# Run seeder again
npm run seed:comprehensive
```

## Development Workflow

1. **Initial Setup**: Run `npm run seed:comprehensive` after first installation
2. **Testing**: Use the sample data to test all application features
3. **Development**: Modify sample data as needed for feature development
4. **Reset**: Clear and reseed when needed for clean testing

## Notes

- All passwords are hashed using bcrypt
- Sample images use Unsplash URLs for realistic appearance
- Data includes realistic Sri Lankan locations and pricing
- The seeder is idempotent - running it multiple times won't create duplicates

## Support

If you encounter issues with the database seeder:

1. Check the console output for error messages
2. Verify MongoDB connection and permissions
3. Ensure all required environment variables are set
4. Check that all dependencies are properly installed 