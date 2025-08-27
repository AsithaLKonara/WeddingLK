# WeddingLK - Wedding Platform

A modern, scalable wedding platform built with Next.js 15, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Production Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weddinglk-nextjs.git
   cd weddinglk-nextjs
   ```

2. **Configure environment**
   ```bash
   cp env.production.template .env.production
   # Edit .env.production with your production values
   ```

3. **Deploy**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

4. **Access the application**
   - Web: http://localhost:3000
   - API: http://localhost:3000/api
   - MongoDB: localhost:27017
   - Redis: localhost:6379

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: 125+ API routes
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: NextAuth v5
- **Containerization**: Docker with health checks
- **Reverse Proxy**: Nginx

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🚀 Vercel Deployment (Recommended)

### **Quick Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy using our script
./deploy-vercel.sh

# Or deploy manually
vercel --prod
```

### **Environment Setup for Vercel**
```bash
# Copy Vercel environment template
cp env.vercel.template .env.vercel

# Edit with your production values
nano .env.vercel

# Set environment variables in Vercel
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
# ... add all other variables
```

## 🐳 Docker Commands (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🚀 Production Features

- ✅ TypeScript compilation
- ✅ ESLint compliance
- ✅ Comprehensive testing
- ✅ Docker containerization
- ✅ Health checks
- ✅ Performance monitoring
- ✅ Security headers
- ✅ SEO optimization

---

**Built with ❤️ using Next.js 15, TypeScript, and modern web technologies**
