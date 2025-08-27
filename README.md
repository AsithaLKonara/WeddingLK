# 🎉 WeddingLK - Next.js Wedding Planning Platform

A comprehensive, production-ready wedding planning platform built with Next.js 15, TypeScript, MongoDB, and Redis. Features AI-powered recommendations, real-time collaboration, and comprehensive vendor/venue management.

## ✨ Features

- **🔐 Authentication**: NextAuth v5 with Google OAuth and credentials
- **🏗️ Modern Architecture**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **🗄️ Database**: MongoDB with Mongoose ODM and Redis caching
- **🤖 AI Integration**: OpenAI-powered recommendations and search
- **📱 Responsive Design**: Mobile-first, accessible UI components
- **🧪 Testing**: Jest, React Testing Library, API testing
- **🐳 Docker**: Complete containerization for development and production
- **📊 Monitoring**: Performance monitoring and analytics
- **🔒 Security**: Rate limiting, input validation, security headers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB 7.0+
- Redis 7.2+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/asithalakmal/weddinglk-next.git
   cd weddinglk-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Development

### Using Docker Compose (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access services**
   - App: http://localhost:3000
   - MongoDB Express: http://localhost:8081 (admin/admin123)
   - Redis Commander: http://localhost:8082

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Manual Docker Commands

1. **Build development image**
   ```bash
   docker build -f Dockerfile.dev -t weddinglk:dev .
   ```

2. **Run development container**
   ```bash
   docker run -p 3000:3000 -v $(pwd):/app weddinglk:dev
   ```

## 🧪 Testing

### Run All Tests
```bash
npm run test
```

### Test Categories
```bash
npm run test:unit      # Unit tests
npm run test:api       # API tests
npm run test:coverage  # Coverage report
npm run test:watch     # Watch mode
```

### Docker Testing
```bash
# Run tests inside Docker
./scripts/docker-test.sh

# Or manually
docker run --rm weddinglk:dev npm run test
```

## 🚀 Production Deployment

### Docker Production

1. **Build production image**
   ```bash
   docker build -f Dockerfile -t weddinglk:prod .
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

### VPS/Cloud Deployment

1. **Set deployment variables**
   ```bash
   export DEPLOY_HOST="your-vps-ip"
   export DEPLOY_USER="deploy"
   ```

2. **Run deployment script**
   ```bash
   ./scripts/deploy-production.sh
   ```

### Manual Deployment

1. **Build and package**
   ```bash
   npm run build
   tar -czf deployment.tar.gz --exclude=node_modules --exclude=.next .
   ```

2. **Upload to server**
   ```bash
   scp deployment.tar.gz user@server:/opt/weddinglk/
   ```

3. **Deploy on server**
   ```bash
   ssh user@server
   cd /opt/weddinglk
   tar -xzf deployment.tar.gz
   docker-compose -f docker-compose.production.yml up -d
   ```

## 📁 Project Structure

```
weddinglk-next/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── vendors/           # Vendor pages
│   └── venues/            # Venue pages
├── components/             # React components
│   ├── ui/                # Shadcn UI components
│   ├── organisms/         # Complex components
│   └── dashboard/         # Dashboard components
├── lib/                    # Utility libraries
│   ├── models/            # Database models
│   ├── cache/             # Caching strategies
│   ├── ai/                # AI services
│   └── auth/              # Authentication utilities
├── __tests__/             # Test files
├── scripts/                # Build and deployment scripts
├── nginx/                  # Nginx configurations
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.yml      # Development services
└── docker-compose.production.yml  # Production services
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | NextAuth secret key | Required |
| `NEXTAUTH_URL` | Application URL | http://localhost:3000 |
| `MONGODB_URI` | MongoDB connection string | Required |
| `REDIS_URL` | Redis connection string | Required |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Required |

### Database Setup

1. **MongoDB Collections**
   - `users` - User accounts and profiles
   - `vendors` - Vendor services and information
   - `venues` - Venue details and availability
   - `bookings` - Booking records
   - `payments` - Payment transactions
   - `reviews` - User reviews and ratings

2. **Indexes**
   - Email uniqueness for users
   - Location-based queries for vendors/venues
   - Text search indexes for search functionality
   - Performance indexes for common queries

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**
   - Component testing with React Testing Library
   - Utility function testing
   - Model validation testing

2. **API Tests**
   - Endpoint testing with Supertest
   - Authentication testing
   - Data validation testing

3. **Integration Tests**
   - Database integration testing
   - Service layer testing
   - End-to-end workflow testing

4. **Performance Tests**
   - Load testing with k6
   - Database query performance
   - API response time testing

### Test Coverage

- **Target**: 70% minimum coverage
- **Areas**: Components, API routes, utility functions
- **Reports**: HTML and console coverage reports

## 🐳 Docker Architecture

### Development Environment

- **Next.js App**: Hot reload with volume mounting
- **MongoDB**: Local development database
- **Redis**: Local caching service
- **Nginx**: Reverse proxy for production-like setup
- **Admin UIs**: MongoDB Express, Redis Commander

### Production Environment

- **Next.js App**: Optimized production build
- **MongoDB**: Production database with persistence
- **Redis**: Production cache with persistence
- **Nginx**: Production reverse proxy with SSL
- **Resource Limits**: CPU and memory constraints

## 📊 Monitoring & Performance

### Performance Metrics

- **Response Times**: API endpoint performance
- **Database Queries**: Query optimization and indexing
- **Cache Hit Rates**: Redis cache effectiveness
- **Memory Usage**: Application memory consumption
- **CPU Usage**: Processing efficiency

### Health Checks

- **Application Health**: `/health` endpoint
- **Database Health**: MongoDB connection status
- **Cache Health**: Redis connection status
- **Service Health**: Docker container status

## 🔒 Security Features

### Authentication & Authorization

- **NextAuth v5**: Secure session management
- **JWT Tokens**: Stateless authentication
- **Role-based Access**: User permission system
- **OAuth Integration**: Google authentication

### Security Headers

- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **XSS Protection**: Cross-site scripting prevention
- **Frame Options**: Clickjacking protection

### Rate Limiting

- **API Endpoints**: 20 requests/second
- **Authentication**: 5 requests/second
- **General Routes**: 30 requests/second

## 🚀 Performance Optimization

### Frontend Optimization

- **Code Splitting**: Dynamic imports and lazy loading
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle optimization
- **Caching**: Static asset caching strategies

### Backend Optimization

- **Database Indexing**: Optimized query performance
- **Redis Caching**: Frequently accessed data caching
- **Connection Pooling**: Database connection management
- **Query Optimization**: Efficient database queries

## 📈 Scaling Considerations

### Horizontal Scaling

- **Load Balancing**: Nginx upstream configuration
- **Stateless Design**: JWT-based authentication
- **Database Sharding**: MongoDB sharding strategies
- **Cache Distribution**: Redis cluster setup

### Vertical Scaling

- **Resource Limits**: Docker resource constraints
- **Memory Optimization**: Node.js memory management
- **Database Optimization**: MongoDB performance tuning
- **Cache Optimization**: Redis memory management

## 🐛 Troubleshooting

### Common Issues

1. **Docker Connection Issues**
   ```bash
   # Check Docker daemon
   docker info
   
   # Restart Docker
   sudo systemctl restart docker
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB status
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   
   # View MongoDB logs
   docker-compose logs mongodb
   ```

3. **Build Issues**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=app:* npm run dev

# View detailed logs
docker-compose logs -f --tail=100
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new functionality**
5. **Ensure all tests pass**
6. **Submit a pull request**

### Development Guidelines

- **Code Style**: Follow existing TypeScript/React patterns
- **Testing**: Maintain 70%+ test coverage
- **Documentation**: Update README for new features
- **Performance**: Consider performance impact of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Shadcn UI**: For beautiful component library
- **MongoDB**: For robust database solution
- **Redis**: For fast caching layer
- **OpenAI**: For AI-powered features

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/asithalakmal/weddinglk-next/issues)
- **Discussions**: [GitHub Discussions](https://github.com/asithalakmal/weddinglk-next/discussions)
- **Email**: asitha.lakmal@student.university.edu

---

**Built with ❤️ for the wedding planning community**

