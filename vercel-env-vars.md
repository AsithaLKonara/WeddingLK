# 🚀 Vercel Deployment - Environment Variables

## Required Environment Variables for Vercel Deployment

Copy these environment variables to your Vercel project settings:

### 🔧 **Core Configuration**
```
NODE_ENV=production
NEXT_PUBLIC_FRONTEND_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
```

### 🗄️ **Database**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk?retryWrites=true&w=majority
```

### 🤖 **AI Services**
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 🔐 **Authentication**
```
JWT_SECRET=your-jwt-secret-key-here
```

### 🔗 **Social Login (Optional)**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
INSTAGRAM_CLIENT_ID=your-instagram-app-id
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### 💳 **Payment Gateways (Optional)**
```
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
PAYHERE_MERCHANT_ID=your-payhere-merchant-id
PAYHERE_MERCHANT_SECRET=your-payhere-merchant-secret
```

### 📧 **Email Services (Optional)**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### ☁️ **Cloud Storage (Optional)**
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 📱 **SMS Services (Optional)**
```
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.sms-gateway.com
```

### 🚀 **Performance & Caching (Optional)**
```
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```

### 📊 **Analytics (Optional)**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=your-sentry-dsn
```

### 🗺️ **Maps & Location (Optional)**
```
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 🔔 **Notifications (Optional)**
```
FCM_SERVER_KEY=your-fcm-server-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### ⚙️ **Feature Flags**
```
ENABLE_AI_FEATURES=true
ENABLE_PAYMENT_PROCESSING=true
ENABLE_SOCIAL_LOGIN=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_ANALYTICS=true
```

### 🛡️ **Security Settings**
```
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
CORS_ORIGINS=https://your-app.vercel.app,https://www.your-domain.com
```

### 📁 **File Upload Limits**
```
MAX_FILE_SIZE=10485760
MAX_IMAGE_SIZE=5242880
```

---

## 🚀 **Quick Start for Vercel Deployment**

### **Minimum Required Variables:**
1. `MONGODB_URI` - Your MongoDB connection string
2. `NEXTAUTH_SECRET` - A random secret key
3. `NEXT_PUBLIC_FRONTEND_URL` - Your Vercel app URL

### **Recommended for Full Functionality:**
1. `OPENAI_API_KEY` - For AI features
2. `JWT_SECRET` - For authentication
3. `STRIPE_SECRET_KEY` - For payments
4. `SMTP_USER` & `SMTP_PASS` - For emails

### **How to Add Variables in Vercel:**
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its value
5. Make sure to set the environment (Production, Preview, Development)
6. Redeploy your application

### **Generate Secrets:**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ **Deployment Checklist**

- [ ] MongoDB Atlas database created and connected
- [ ] Environment variables added to Vercel
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Build successful
- [ ] Application accessible via Vercel URL

---

## 🔗 **Your Vercel Deployment URL:**
Once deployed, your app will be available at:
`https://your-app-name.vercel.app`

Replace `your-app-name` with your actual Vercel project name.
