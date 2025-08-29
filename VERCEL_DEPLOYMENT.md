# 🚀 VERCEL DEPLOYMENT GUIDE FOR WEDDINGLK

## 📋 Overview

This guide will help you deploy your WeddingLK Next.js application to Vercel, the optimal platform for Next.js applications.

## 🔧 Pre-Deployment Setup

### **1. Install Vercel CLI**

```bash
npm install -g vercel
```

### **2. Login to Vercel**

```bash
vercel login
```

### **3. Generate New Secrets for Vercel**

```bash
# Generate new NEXTAUTH_SECRET
openssl rand -base64 64

# Generate other secrets
openssl rand -base64 32
```

## 🌐 Database Setup for Vercel

### **MongoDB Atlas (Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Update `MONGODB_URI` in Vercel environment variables

### **Redis Setup**

- Use [Upstash Redis](https://upstash.com/) (Vercel integration)
- Or [Redis Cloud](https://redis.com/try-free/)
- Update `REDIS_URL` in Vercel environment variables

## 🔐 Environment Variables Configuration

### **1. Copy Vercel Template**

```bash
cp env.vercel.template .env.vercel
```

### **2. Configure Environment Variables**

Edit `.env.vercel` with your production values:

```env
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk?retryWrites=true&w=majority

# Redis (Upstash or Redis Cloud)
REDIS_URL=redis://username:password@redis-server:6379

# Authentication
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# OAuth Services
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Storage
UPLOAD_API_KEY=your_upload_api_key
```

## 🚀 Deployment Steps

### **1. Initial Deployment**

```bash
# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: weddinglk-nextjs
# - Directory: ./
# - Override settings: No
```

### **2. Set Environment Variables**

```bash
# Set all environment variables
vercel env add MONGODB_URI
vercel env add REDIS_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add FACEBOOK_CLIENT_ID
vercel env add FACEBOOK_CLIENT_SECRET
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add UPLOAD_API_KEY
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
vercel env add SESSION_SECRET
vercel env add COOKIE_SECRET
```

### **3. Deploy to Production**

```bash
# Deploy to production
vercel --prod
```

## 🔍 Post-Deployment Verification

### **1. Check Application Health**

- Visit your Vercel domain
- Test the homepage
- Check API endpoints: `/api/health`

### **2. Test Authentication**

- Test user registration
- Test login functionality
- Verify OAuth integrations

### **3. Test Database Operations**

- Create a test user
- Verify data persistence
- Check Redis caching

## 🚨 Troubleshooting

### **Common Issues**

1. **Build Failures**: Check Node.js version compatibility
2. **Environment Variables**: Verify all required variables are set
3. **Database Connection**: Check MongoDB Atlas network access
4. **OAuth Errors**: Verify redirect URIs and credentials

### **Debug Commands**

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy with debug info
vercel --debug
```

---

**🎉 Your WeddingLK application is now optimized for Vercel deployment!**
