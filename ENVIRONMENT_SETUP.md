# 🔧 ENVIRONMENT VARIABLES SETUP GUIDE

## 📋 Overview

This guide explains how to configure environment variables for different deployment scenarios.

## 🚀 Production Environment (.env.production)

### **Quick Setup**
```bash
# Copy the template
cp env.production.template .env.production

# Edit with your values
nano .env.production
```

### **Required Variables**

#### **🔐 Authentication & Security**
```env
NEXTAUTH_SECRET=/ubT40MPHTsuxijlmcpUADyVU9pTXPmG9b7OrjOSFQ4SYSbEG6q51/JVbZlSrXu/diwkdyc5KYiTyj8U5Krn5A==
JWT_SECRET=GrhD6VyIYt6hbibSCgE6ffNEFatOqIry6XEauesKCCQ=
ENCRYPTION_KEY=GrhD6VyIYt6hbibSCgE6ffNEFatOqIry6XEauesKCCQ=
SESSION_SECRET=GrhD6VyIYt6hbibSCgE6ffNEFatOqIry6XEauesKCCQ=
COOKIE_SECRET=GrhD6VyIYt6hbibSCgE6ffNEFatOqIry6XEauesKCCQ=
```

#### **🗄️ Database Configuration**
```env
MONGODB_URI=mongodb://admin:WeddingLK2024!@mongodb:27017/weddinglk?authSource=admin
REDIS_URL=redis://redis:6379
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=WeddingLK2024!
MONGO_DATABASE=weddinglk
```

#### **🌐 Application Settings**
```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
PORT=3000
HOSTNAME=0.0.0.0
```

#### **📧 Email Configuration**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### **🔑 External Services**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

## 🛠️ Development Environment (.env.local)

### **Quick Setup**
```bash
# Copy the development template
cp .env.local .env.local.backup

# Edit with your development values
nano .env.local
```

### **Development Variables**
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/weddinglk_dev
REDIS_URL=redis://localhost:6379
NEXTAUTH_URL=http://localhost:3000
DEBUG=true
LOG_LEVEL=debug
ENABLE_MOCK_DATA=true
```

## 🔒 Security Best Practices

### **1. Secret Generation**
```bash
# Generate secure secrets
openssl rand -base64 64    # For NEXTAUTH_SECRET
openssl rand -base64 32    # For other secrets
```

### **2. Password Requirements**
- **MongoDB**: Use strong passwords (12+ characters, mixed case, numbers, symbols)
- **Redis**: Use strong passwords if exposed to internet
- **OAuth**: Use official client IDs and secrets from service providers

### **3. Environment Isolation**
- Never commit `.env.production` to version control
- Use different credentials for development, staging, and production
- Rotate secrets regularly

## 📱 OAuth Setup Guide

### **Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### **Facebook OAuth**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Get App ID and App Secret

## 📧 SMTP Configuration

### **Gmail Setup**
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in SMTP_PASS

### **Other Providers**
- **SendGrid**: Use API key in SMTP_PASS
- **Mailgun**: Use API key in SMTP_PASS
- **AWS SES**: Use AWS credentials

## 🚀 Deployment Checklist

### **Before Deployment**
- [ ] All secrets are properly set
- [ ] OAuth redirect URIs are configured
- [ ] SMTP credentials are working
- [ ] Database credentials are secure
- [ ] Environment-specific URLs are set

### **After Deployment**
- [ ] Test authentication flows
- [ ] Verify email sending
- [ ] Check database connections
- [ ] Monitor application logs
- [ ] Test OAuth integrations

## 🔍 Troubleshooting

### **Common Issues**
1. **Authentication fails**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
2. **Database connection**: Verify MONGODB_URI format and credentials
3. **Email not sending**: Check SMTP credentials and port
4. **OAuth errors**: Verify redirect URIs and client secrets

### **Debug Commands**
```bash
# Check environment variables
node -e "console.log(process.env.NODE_ENV)"

# Test MongoDB connection
mongosh "mongodb://admin:password@localhost:27017/weddinglk?authSource=admin"

# Test Redis connection
redis-cli ping
```

## 📚 Additional Resources

- [NextAuth.js Configuration](https://next-auth.js.org/configuration)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [Redis Configuration](https://redis.io/topics/config)
- [SMTP Configuration](https://nodemailer.com/smtp/)

---

**⚠️ IMPORTANT: Never share or commit your production environment files!**
