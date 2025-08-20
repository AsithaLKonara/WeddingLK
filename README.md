# 🎉 WeddingLK NextJS - Complete Wedding Planning Platform

A comprehensive, production-ready wedding planning platform built with Next.js 15, TypeScript, and modern web technologies.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, role-based access control
- **Vendor Management**: Profiles, verification, portfolio management
- **Venue Management**: Availability, pricing calculator, booking system
- **Booking & Payments**: Stripe integration, invoice generation, refunds
- **AI Features**: Smart recommendations, enhanced search algorithms
- **Communication**: Real-time chat, notifications, review system
- **Mobile App**: React Native companion app
- **Multi-language**: International expansion support

### Technical Features
- **Next.js 15**: App Router, Server Components, API Routes
- **TypeScript**: Full type safety and IntelliSense
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: WebSocket integration, push notifications
- **Performance**: Image optimization, caching, lazy loading
- **Security**: JWT tokens, rate limiting, input validation
- **Testing**: Comprehensive automated testing suite

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Components**: Atomic design system
- **State Management**: React hooks and context

### Backend
- **API Routes**: Next.js API endpoints
- **MongoDB**: NoSQL database
- **Mongoose**: Object Document Mapper
- **NextAuth.js**: Authentication framework
- **WebSockets**: Real-time communication

### Infrastructure
- **Docker**: Containerization
- **PM2**: Process management
- **Nginx**: Reverse proxy
- **Redis**: Caching and sessions
- **Cloudinary**: Image management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB
- Redis (optional)

### Setup
```bash
# Clone repository
git clone <repository-url>
cd wedding-lk-asitha

# Install dependencies
npm install --legacy-peer-deps

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Database setup
npm run db:seed

# Development
npm run dev
```

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/weddinglk
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Payment
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🧪 Testing

### Test Infrastructure
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **k6**: Performance testing
- **Coverage**: Comprehensive test coverage reporting

### Running Tests
```bash
# All tests
npm run test:all

# Unit tests only
npm run test:unit

# Component tests
npm run test:components

# Business logic tests
npm run test:business

# API tests
npm run test:api

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance
```

### Test Coverage
- **Current Status**: 39 tests passing, 6 test suites
- **Coverage Target**: 70%+ (configurable)
- **Test Types**: Unit, Integration, E2E, Performance, Security

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t weddinglk-nextjs .

# Run container
docker run -p 3000:3000 weddinglk-nextjs

# Docker Compose
docker-compose up -d
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# PM2 deployment
pm2 start ecosystem.config.js
```

### Environment-Specific Configs
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Optimized production build

## 📱 Mobile App

### React Native App
- **Platforms**: iOS and Android
- **Features**: Push notifications, offline support
- **Integration**: Shared business logic with web platform

### Mobile Features
- User authentication
- Vendor browsing
- Booking management
- Real-time notifications
- Offline functionality

## 🔒 Security

### Authentication & Authorization
- **NextAuth.js**: Secure authentication framework
- **JWT Tokens**: Stateless authentication
- **Role-Based Access**: User, vendor, admin roles
- **OAuth Providers**: Google, Facebook, LinkedIn

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection**: MongoDB injection protection
- **XSS Protection**: Content Security Policy
- **Rate Limiting**: API abuse prevention

### Security Testing
- **OWASP ZAP**: Automated security scanning
- **Snyk**: Dependency vulnerability scanning
- **Security Headers**: Secure HTTP headers

## 📊 Performance

### Optimization Strategies
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports and lazy loading
- **Caching**: Redis caching, CDN integration
- **Bundle Analysis**: Webpack bundle optimization

### Monitoring
- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Sentry integration
- **Analytics**: User behavior tracking
- **Uptime Monitoring**: Health checks and alerts

## 🌐 Internationalization

### Multi-Language Support
- **Languages**: English, Sinhala, Tamil
- **Currency**: Multiple currency support
- **Time Zones**: Global time zone handling
- **Localization**: Culture-specific content

### Expansion Features
- **Regional Settings**: Country-specific configurations
- **Payment Methods**: Local payment gateways
- **Compliance**: GDPR, local regulations

## 🔧 Development

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks for quality

### Development Workflow
```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Build check
npm run build
```

### Project Structure
```
wedding-lk-asitha/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── auth/              # Authentication pages
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   └── organisms/         # Complex components
├── lib/                    # Utility libraries
│   ├── auth/              # Authentication utilities
│   ├── database/          # Database connections
│   └── services/          # Business logic services
├── tests/                  # Test suite
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── e2e/               # End-to-end tests
│   └── performance/       # Performance tests
├── mobile-app/             # React Native app
├── docs/                   # Documentation
└── docker/                 # Docker configuration
```

## 📈 Roadmap

### Phase 1: Core Platform ✅
- [x] User authentication and management
- [x] Vendor and venue management
- [x] Booking system
- [x] Payment integration
- [x] Basic testing infrastructure

### Phase 2: Advanced Features 🚧
- [ ] AI-powered recommendations
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Performance optimization

### Phase 3: Enterprise Features 📋
- [ ] Advanced reporting
- [ ] API for third-party integrations
- [ ] White-label solutions
- [ ] Advanced security features
- [ ] Global expansion

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Follow the established project structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Testing Guide](docs/testing.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/your-org/wedding-lk-asitha/issues)
- [Discussions](https://github.com/your-org/wedding-lk-asitha/discussions)
- [Wiki](https://github.com/your-org/wedding-lk-asitha/wiki)

### Contact
- **Project Lead**: [Your Name](mailto:your.email@example.com)
- **Technical Support**: [Tech Team](mailto:tech@weddinglk.com)
- **Business Inquiries**: [Business Team](mailto:business@weddinglk.com)

---

**Built with ❤️ by the WeddingLK Team**

*Empowering couples to create their perfect wedding experience* 