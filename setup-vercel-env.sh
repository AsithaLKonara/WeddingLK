#!/bin/bash

# Vercel Environment Setup Script for WeddingLK
echo "🔧 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
    exit 1
fi

echo "✅ Vercel CLI is ready!"

# Generate new secrets for Vercel
echo "🔐 Generating new secrets for Vercel..."
NEXTAUTH_SECRET=$(openssl rand -base64 64)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

echo "📝 Generated secrets:"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "JWT_SECRET: ${JWT_SECRET:0:20}..."
echo "ENCRYPTION_KEY: ${ENCRYPTION_KEY:0:20}..."
echo "SESSION_SECRET: ${SESSION_SECRET:0:20}..."
echo "COOKIE_SECRET: ${COOKIE_SECRET:0:20}..."

# Create .env.vercel with generated secrets
cat > .env.vercel << EOF
# Vercel Environment Configuration for WeddingLK
NODE_ENV=production

# Database Configuration (Use MongoDB Atlas for Vercel)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk?retryWrites=true&w=majority
REDIS_URL=redis://username:password@redis-server:6379

# Authentication - SECURE SECRETS (Generated)
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# External Services (Configure these for production)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# Email Configuration (Use external SMTP service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload (Use external storage service)
UPLOAD_API_KEY=your_upload_api_key

# Application Settings
PORT=3000
HOSTNAME=0.0.0.0

# Additional Security Settings
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_SECRET=${SESSION_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}
EOF

echo "✅ Created .env.vercel with generated secrets"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Edit .env.vercel with your actual values:"
echo "   - MongoDB Atlas connection string"
echo "   - Redis connection string"
echo "   - OAuth credentials (Google, Facebook)"
echo "   - SMTP settings"
echo "   - File upload API key"
echo "   - Update NEXTAUTH_URL to your actual Vercel domain"
echo ""
echo "2. Set environment variables in Vercel:"
echo "   ./deploy-vercel.sh"
echo ""
echo "3. Or set them manually:"
echo "   vercel env add MONGODB_URI"
echo "   vercel env add NEXTAUTH_SECRET"
echo "   # ... add all other variables"
echo ""
echo "🔐 IMPORTANT: Never commit .env.vercel to version control!"
