# 🗄️ MongoDB Atlas Setup Guide (No Docker Required)

## 🚀 **Quick MongoDB Atlas Setup for University Presentation**

### **Why MongoDB Atlas?**
- ✅ **Free tier** available (512MB storage)
- ✅ **No local installation** required
- ✅ **Cloud-hosted** - accessible from anywhere
- ✅ **Perfect for demos** and presentations
- ✅ **Automatic backups** and security

## 📋 **Step-by-Step Setup:**

### **1. Create MongoDB Atlas Account**
1. Go to: https://www.mongodb.com/atlas/database
2. Click **"Try Free"** or **"Get Started Free"**
3. Fill in your details and create account

### **2. Create a New Cluster**
1. Click **"Build a Database"**
2. Choose **"FREE"** tier (M0)
3. Select **"AWS"** as cloud provider
4. Choose **"N. Virginia (us-east-1)"** (closest to you)
5. Click **"Create"**

### **3. Set Up Database Access**
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Username: `weddinglk_user`
4. Password: `weddinglk_password_2024`
5. Role: **"Read and write to any database"**
6. Click **"Add User"**

### **4. Set Up Network Access**
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for demo purposes)
4. Click **"Confirm"**

### **5. Get Connection String**
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual password

### **6. Update Environment File**
Update `env.local.no-docker`:
```bash
# Replace this line:
MONGODB_URI=mongodb://localhost:27017/weddinglk_dev

# With your Atlas connection string:
MONGODB_URI=mongodb+srv://weddinglk_user:weddinglk_password_2024@cluster0.xxxxx.mongodb.net/weddinglk_dev?retryWrites=true&w=majority
```

## 🎯 **Your Connection String Format:**
```
mongodb+srv://weddinglk_user:weddinglk_password_2024@cluster0.xxxxx.mongodb.net/weddinglk_dev?retryWrites=true&w=majority
```

## 🚀 **Start Your Application:**

### **Option 1: Use the Script**
```bash
chmod +x start-local-no-docker.sh
./start-local-no-docker.sh
```

### **Option 2: Manual Start**
```bash
# Copy environment file
cp env.local.no-docker .env.local

# Install dependencies
npm install

# Seed database (optional)
node seed-db.js

# Start application
npm run dev
```

## 🌐 **Access Your Application:**
- **Frontend**: http://localhost:3000
- **Database**: MongoDB Atlas (cloud)
- **Admin Login**: admin@weddinglk.com / admin123

## 🔧 **Troubleshooting:**

### **Connection Issues:**
- Check your connection string format
- Verify username/password
- Ensure network access allows your IP
- Check if cluster is running

### **Common Errors:**
- **"ECONNREFUSED"**: Check connection string
- **"Authentication failed"**: Check username/password
- **"Network timeout"**: Check internet connection

## 🎓 **Benefits for University Presentation:**

1. **Professional Setup** - Cloud database looks impressive
2. **No Installation Issues** - Works on any computer
3. **Scalable** - Can handle demo traffic
4. **Reliable** - No local service management
5. **Accessible** - Can show from any device

## 💡 **Pro Tips:**

- **Test connection** before presentation
- **Have backup screenshots** ready
- **Show database in Atlas** during demo
- **Highlight cloud architecture** as feature

**Your WeddingLK platform will be running locally with a professional cloud database - perfect for your university presentation!** 🎉
