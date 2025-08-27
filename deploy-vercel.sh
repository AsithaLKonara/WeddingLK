#!/bin/bash

# Vercel Deployment Script for WeddingLK
echo "🚀 Deploying WeddingLK to Vercel..."

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

# Check if .env.vercel exists
if [ ! -f .env.vercel ]; then
    echo "📝 Creating .env.vercel from template..."
    cp env.vercel.template .env.vercel
    echo "⚠️  Please edit .env.vercel with your production values"
    echo "💡 Then run: ./deploy-vercel.sh"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo "📝 Don't forget to set environment variables in Vercel dashboard"
echo "🔗 Check your Vercel dashboard for the deployment URL"
