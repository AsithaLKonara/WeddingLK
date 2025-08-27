#!/bin/bash

# 🚀 Initial Vercel Deployment Script for WeddingLK
# This script deploys the app to get your Vercel domain first

echo "🚀 Starting initial Vercel deployment for WeddingLK..."
echo "📋 This deployment will get your domain so you can configure external services"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "✅ Vercel CLI ready"
echo ""

# Build the project first
echo "🔨 Building project..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo "📝 Follow the prompts:"
echo "   - Link to existing project: No"
echo "   - Project name: weddinglk-asitha"
echo "   - Framework: Next.js"
echo "   - Root directory: ./"
echo "   - Override settings: No"
echo ""

# Deploy to Vercel
vercel

echo ""
echo "🎉 Initial deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Note your Vercel domain from the output above"
echo "2. Update OAuth redirect URIs in Google/Facebook consoles"
echo "3. Set up MongoDB Atlas and get connection string"
echo "4. Set up Upstash Redis and get connection string"
echo "5. Configure environment variables in Vercel"
echo "6. Run: vercel --prod (for production deployment)"
echo ""
echo "📚 See DEPLOYMENT_STRATEGY.md for detailed configuration steps"
