# 🎉 WeddingLK Manual Testing Guide

## 🚀 Project Status: **RUNNING SUCCESSFULLY**

Your WeddingLK Next.js wedding planning platform is now fully operational and ready for comprehensive manual testing!

---

## 🔐 **TEST USER CREDENTIALS**

### 👑 **Admin User**
- **Email:** `admin@weddinglk.test`
- **Password:** `admin123`
- **Role:** Administrator
- **Access:** Full system access, user management, analytics

### 👰 **Client User**
- **Email:** `client@weddinglk.test`
- **Password:** `client123`
- **Role:** Wedding Client
- **Access:** Browse vendors, book services, manage bookings

### 🏢 **Vendor User**
- **Email:** `vendor@weddinglk.test`
- **Password:** `vendor123`
- **Role:** Service Vendor
- **Access:** Manage portfolio, respond to inquiries, track bookings

### 📋 **Planner User**
- **Email:** `planner@weddinglk.test`
- **Password:** `planner123`
- **Role:** Wedding Planner
- **Access:** Client management, vendor coordination, planning tools

---

## 🌐 **ACCESS URLs**

### **Main Application**
- **Frontend:** http://localhost:3000
- **API Base:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

### **Database Management**
- **MongoDB Express:** http://localhost:8081
  - Username: `admin`
  - Password: `admin123`

### **Database Connections**
- **MongoDB:** mongodb://localhost:27017
- **Redis:** redis://localhost:6379

---

## ✨ **AVAILABLE FEATURES TO TEST**

### 🔐 **Authentication & User Management**
- [ ] User registration and login
- [ ] Role-based access control
- [ ] Password reset functionality
- [ ] Profile management
- [ ] Avatar uploads

### 👥 **User Roles & Permissions**
- [ ] Admin dashboard and user management
- [ ] Client booking and vendor browsing
- [ ] Vendor portfolio and service management
- [ ] Planner coordination tools

### 🏢 **Vendor Management**
- [ ] Vendor registration and verification
- [ ] Service portfolio creation
- [ ] Pricing and availability management
- [ ] Review and rating system

### 🏛️ **Venue Management**
- [ ] Venue listings and details
- [ ] Availability checking
- [ ] Pricing and booking
- [ ] Image galleries

### 📅 **Booking System**
- [ ] Service and venue booking
- [ ] Date and time selection
- [ ] Guest count management
- [ ] Booking confirmation

### 💬 **Communication**
- [ ] Messaging between users
- [ ] Notification system
- [ ] Email alerts
- [ ] SMS notifications

### 💳 **Payment Processing**
- [ ] Stripe integration
- [ ] Payment confirmation
- [ ] Invoice generation
- [ ] Refund processing

### 🤖 **AI Features**
- [ ] AI-powered search
- [ ] Smart recommendations
- [ ] Automated responses
- [ ] Content optimization

### 📱 **Mobile Experience**
- [ ] Responsive design
- [ ] Touch-friendly interface
- [ ] Mobile navigation
- [ ] Progressive Web App features

---

## 📊 **TEST DATA AVAILABLE**

The database has been seeded with comprehensive test data:
- **40+ Users** (including test accounts)
- **20+ Vendors** with services and portfolios
- **25+ Venues** with pricing and availability
- **30+ Bookings** for testing workflows
- **40+ Reviews** and ratings

---

## 🧪 **TESTING SCENARIOS**

### **1. User Journey Testing**
1. Register as a new client
2. Browse vendors and venues
3. Book a service
4. Make a payment
5. Leave a review

### **2. Vendor Experience**
1. Login as vendor
2. Update portfolio
3. Respond to inquiries
4. Manage bookings
5. Track earnings

### **3. Admin Functions**
1. Login as admin
2. Manage users
3. Monitor system
4. View analytics
5. Handle disputes

### **4. Cross-Platform Testing**
1. Test on desktop
2. Test on tablet
3. Test on mobile
4. Test different browsers

---

## 🛠️ **USEFUL COMMANDS**

### **Docker Management**
```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

### **Database Access**
```bash
# MongoDB shell
docker exec -it wedding-lk-asitha-mongodb-1 mongosh

# Redis shell
docker exec -it wedding-lk-asitha-redis-1 redis-cli
```

### **Monitoring**
```bash
# Run monitoring dashboard
node scripts/monitor-project.mjs

# Check application health
curl http://localhost:3000/api/health
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions**

1. **Application not loading**
   - Check Docker services: `docker-compose ps`
   - View logs: `docker-compose logs weddinglk-app`

2. **Database connection issues**
   - Verify MongoDB is running: `docker-compose logs mongodb`
   - Check Redis: `docker-compose logs redis`

3. **Port conflicts**
   - Ensure ports 3000, 27017, 6379, 8081 are available
   - Stop conflicting services if needed

4. **Build errors**
   - Rebuild container: `docker-compose build --no-cache`
   - Clear Next.js cache: `docker exec -it weddinglk-app-1 rm -rf .next`

---

## 📱 **TESTING CHECKLIST**

### **Functionality Testing**
- [ ] User registration and login
- [ ] Role-based navigation
- [ ] CRUD operations for all entities
- [ ] Search and filtering
- [ ] Booking workflows
- [ ] Payment processing
- [ ] Messaging system

### **UI/UX Testing**
- [ ] Responsive design
- [ ] Navigation flow
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Success messages

### **Performance Testing**
- [ ] Page load times
- [ ] Image optimization
- [ ] Database queries
- [ ] API response times
- [ ] Memory usage

### **Security Testing**
- [ ] Authentication
- [ ] Authorization
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

---

## 🎯 **NEXT STEPS**

1. **Start Testing:** Use the provided credentials to explore different user roles
2. **Report Issues:** Document any bugs or usability issues found
3. **Performance Testing:** Monitor application performance during testing
4. **User Feedback:** Gather feedback on user experience and interface
5. **Documentation:** Update this guide based on testing results

---

## 📞 **SUPPORT**

If you encounter any issues during testing:
1. Check the Docker logs first
2. Verify all services are running
3. Check the monitoring dashboard
4. Review this troubleshooting guide

---

**🎉 Happy Testing! Your WeddingLK platform is ready to impress! 🎉** 