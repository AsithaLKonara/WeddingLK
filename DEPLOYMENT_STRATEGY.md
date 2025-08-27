# 🚀 Vercel Deployment Strategy for WeddingLK

## 🎯 **Deployment Approach: Deploy First, Configure Later**

### **Why This Approach?**
- OAuth services require the actual production domain
- We need the Vercel domain before configuring external services
- Local database integrations won't work on Vercel

## 📋 **Phase 1: Initial Deployment (Get Domain)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
vercel login
```

### **Step 2: Deploy with Minimal Configuration**
```bash
# Deploy to get your domain
vercel

# Follow prompts:
# - Link to existing project: No
# - Project name: weddinglk-asitha
# - Framework: Next.js
# - Root directory: ./
# - Override settings: No
```

### **Step 3: Note Your Domain**
After deployment, you'll get a URL like:
```
https://weddinglk-asitha-abc123.vercel.app
```

## 🔧 **Phase 2: Configure External Services**

### **Step 1: MongoDB Atlas Setup**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free cluster
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in Vercel environment

### **Step 2: Redis Setup (Upstash)**
1. Go to [Upstash](https://upstash.com/)
2. Create Redis database
3. Get connection string
4. Update `REDIS_URL` in Vercel environment

### **Step 3: OAuth Configuration**
1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Update redirect URIs with your Vercel domain
   - Get client ID and secret

2. **Facebook OAuth:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Update redirect URIs with your Vercel domain
   - Get client ID and secret

### **Step 4: Email Service**
1. **Gmail SMTP:**
   - Enable 2-factor authentication
   - Generate app password
   - Update SMTP settings

2. **Or SendGrid:**
   - Create account
   - Get API key
   - Update SMTP settings

## 🔐 **Phase 3: Environment Variables**

### **Step 1: Generate New Secrets**
```bash
# Generate new secrets for Vercel (don't reuse local ones)
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # ENCRYPTION_KEY
openssl rand -base64 32  # SESSION_SECRET
openssl rand -base64 32  # COOKIE_SECRET
```

### **Step 2: Update Vercel Environment**
```bash
# Set environment variables in Vercel
vercel env add MONGODB_URI
vercel env add REDIS_URL
vercel env add NEXTAUTH_SECRET
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
vercel env add SESSION_SECRET
vercel env add COOKIE_SECRET
vercel env add NEXTAUTH_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add FACEBOOK_CLIENT_ID
vercel env add FACEBOOK_CLIENT_SECRET
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
```

## 🚀 **Phase 4: Production Deployment**

### **Step 1: Deploy to Production**
```bash
vercel --prod
```

### **Step 2: Verify Deployment**
1. Visit your Vercel domain
2. Test homepage loading
3. Check `/api/health` endpoint
4. Test basic functionality

## 🔄 **Phase 5: Continuous Deployment**

### **Step 1: Connect GitHub**
1. Go to Vercel dashboard
2. Connect your GitHub repository
3. Enable automatic deployments

### **Step 2: Set Up Preview Deployments**
- Enable preview deployments for pull requests
- Test changes before merging to main

## 🛠️ **Current Status & Next Steps**

### **✅ What's Ready:**
- All TypeScript errors fixed
- Vercel configuration files created
- Environment templates prepared
- Deployment scripts ready

### **🎯 Immediate Action Required:**
1. **Deploy to Vercel** to get your domain
2. **Remove local database dependencies** from code
3. **Configure external services** with real domain
4. **Set environment variables** in Vercel

### **⚠️ Critical Notes:**
- **Don't configure OAuth until you have the domain**
- **Use external MongoDB/Redis, not local services**
- **Generate new secrets for Vercel**
- **Test build locally before deploying**

## 🚀 **Ready to Deploy?**

Run this command to start:
```bash
vercel
```

After getting your domain, follow the configuration steps above.
