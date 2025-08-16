# Database Seeding & Testing Guide

This guide covers how to seed the WeddingLK database with comprehensive test data and test the AI search functionality.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/weddinglk
# or your production MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk
```

### 3. Run Comprehensive Database Seeding

```bash
npm run seed:comprehensive
```

This will seed your database with:
- **2 Admin users** (admin@weddinglk.com / admin123)
- **50 Regular users** (user@weddinglk.com / user123)
- **50 Vendors** (photographers, decorators, catering, etc.)
- **25 Venues** (wedding venues across Sri Lanka)
- **50 Bookings** (realistic wedding bookings)
- **100 Reviews** (vendor and venue reviews)
- **50 Tasks** (wedding planning tasks)
- **30 Conversations** (user-vendor communications)
- **100+ Messages** (conversation messages)
- **100 Notifications** (system and user notifications)
- **50 Payments** (payment records)
- **50+ Services** (vendor services)

## 🧪 Testing AI Search Functionality

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Run AI Search Tests

```bash
npm run test:ai-search
```

This will test:
- ✅ Basic search functionality
- ✅ Special character handling
- ✅ XSS prevention
- ✅ Input validation
- ✅ POST method support

## 📊 Database Schema Coverage

The seeding script covers all major models and features:

### Users & Authentication
- **User Model**: Regular users, vendors, admins
- **Roles**: user, vendor, admin
- **Preferences**: Wedding date, budget, guest count, location, style
- **Security**: Hashed passwords, verification status

### Vendors & Services
- **Vendor Model**: Business details, categories, locations
- **Services**: Individual service offerings with pricing
- **Portfolio**: Sample images and work examples
- **Ratings**: Realistic rating system

### Venues & Bookings
- **Venue Model**: Location, capacity, pricing, amenities
- **Booking Model**: Complete booking lifecycle
- **Payment Tracking**: Payment status and history
- **Timeline Management**: Event scheduling

### Communication & Planning
- **Conversation Model**: User-vendor communications
- **Message Model**: Individual messages with attachments
- **Task Model**: Wedding planning tasks
- **Notification Model**: System and user notifications

### Reviews & Analytics
- **Review Model**: Vendor and venue reviews
- **Rating System**: Average ratings and counts
- **Payment Model**: Transaction tracking

## 🔧 Customization

### Modify Seeding Data

Edit `scripts/comprehensive-seed.mjs` to customize:
- Number of records generated
- Data patterns and distributions
- Geographic locations
- Price ranges
- Categories and services

### Add New Models

To seed additional models:

1. Import the model in the seeding script
2. Create a generation function
3. Add to the main seeding function
4. Update the summary output

## 🚨 Important Notes

### Security
- **Default passwords** are set for testing only
- **Production environments** should use strong, unique passwords
- **API keys** should be properly secured

### Data Volume
- **Large datasets** may take several minutes to generate
- **Memory usage** increases with data volume
- **Index creation** happens automatically

### Environment
- **Development**: Use local MongoDB for testing
- **Production**: Use MongoDB Atlas or production cluster
- **Backup**: Always backup production data before seeding

## 🐛 Troubleshooting

### Common Issues

#### 1. Connection Errors
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally or update MONGODB_URI

#### 2. Import Errors
```bash
Error: Cannot find module '../lib/models/user.js'
```
**Solution**: Check file paths and ensure models exist

#### 3. Memory Issues
```bash
Error: JavaScript heap out of memory
```
**Solution**: Increase Node.js memory limit:
```bash
node --max-old-space-size=4096 scripts/comprehensive-seed.mjs
```

#### 4. AI Search Tests Fail
```bash
Error: fetch failed
```
**Solution**: Ensure development server is running on port 3000

### Performance Optimization

For large datasets:
```bash
# Use Node.js with increased memory
NODE_OPTIONS="--max-old-space-size=4096" npm run seed:comprehensive

# Run in production mode
NODE_ENV=production npm run seed:comprehensive
```

## 📈 Monitoring & Verification

### Check Seeded Data

```bash
# Connect to MongoDB shell
mongosh weddinglk

# Check collection counts
db.users.countDocuments()
db.vendors.countDocuments()
db.venues.countDocuments()
db.bookings.countDocuments()
```

### Verify AI Search

1. Visit `/api/ai-search?q=wedding%20venue%20colombo`
2. Check response format and data
3. Verify search results match seeded data

## 🔄 Reset & Re-seed

### Clear Database
```bash
# Drop all collections
mongosh weddinglk --eval "db.dropDatabase()"

# Or clear specific collections
mongosh weddinglk --eval "db.users.deleteMany({}); db.vendors.deleteMany({})"
```

### Re-run Seeding
```bash
npm run seed:comprehensive
```

## 📚 Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Mongoose Documentation**: https://mongoosejs.com/
- **Faker.js Documentation**: https://fakerjs.dev/
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify environment configuration
4. Test with smaller datasets first

---

**Happy Seeding! 🎉** 