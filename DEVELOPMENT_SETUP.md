# WeddingLK Development Setup Guide

## Quick Fix for Current Issues

### 1. MongoDB Connection Issues
The application is failing to connect to MongoDB. You have two options:

#### Option A: Use Local MongoDB (Recommended for Development)
```bash
# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh --eval "db.runCommand('ping')"
```

#### Option B: Use Docker MongoDB
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Start Redis container (optional)
docker run -d -p 6379:6379 --name redis redis:7.2-alpine
```

### 2. Environment Configuration
The application now uses `env.local` for local development. Make sure this file exists and contains:

```bash
# Copy the development environment file
cp env.local .env.local

# Or manually create .env.local with:
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/weddinglk
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
# Use the development startup script
./start-dev.sh

# Or manually:
npm install
npm run build
npm run dev
```

## What Was Fixed

1. **MongoDB Connection**: Added fallback connection string and better error handling
2. **Duplicate Indexes**: Removed conflicting index definitions in models
3. **Static Assets**: Updated Next.js configuration for better asset handling
4. **Environment Variables**: Created proper local development configuration
5. **Connection Pooling**: Improved database connection management

## Troubleshooting

### If you still see 404 errors for static assets:
1. Clear the Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Restart: `npm run dev`

### If MongoDB still won't connect:
1. Check if MongoDB is running: `brew services list | grep mongodb`
2. Verify connection: `mongosh mongodb://localhost:27017/weddinglk`
3. Check logs: `tail -f /usr/local/var/log/mongodb/mongo.log`

### If you see CSP violations:
The Content Security Policy is configured in nginx. For local development, this shouldn't affect you unless you're using nginx locally.

## Development Workflow

1. **Start Services**: MongoDB, Redis (if needed)
2. **Set Environment**: Use `env.local` or `.env.local`
3. **Install Dependencies**: `npm install`
4. **Build**: `npm run build`
5. **Develop**: `npm run dev`
6. **Test**: `npm run test`

## Next Steps

Once the basic setup is working:
1. Run database seeding: `npm run seed:basic`
2. Test the application at `http://localhost:3000`
3. Check the API endpoints at `http://localhost:3000/api/health`

## Support

If you continue to have issues:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB and Redis are running and accessible
4. Try clearing all caches and rebuilding from scratch 