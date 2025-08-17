# WeddingLK - Wedding Planning Platform

A comprehensive wedding planning platform built with Next.js, TypeScript, and MongoDB. This is a final year university project that demonstrates modern web development practices.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Vendor Directory**: Browse and connect with wedding service providers
- **Venue Booking**: Find and book wedding venues
- **Planning Tools**: Wedding checklist, timeline, and budget tracker
- **AI-Powered Search**: Intelligent vendor and venue recommendations
- **Mobile Responsive**: Works seamlessly on all devices
- **Real-time Chat**: Communication between users and vendors
- **Payment Integration**: Support for Sri Lankan payment gateways

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: React Hooks, TanStack Query
- **Deployment**: Docker, Vercel-ready
- **Testing**: Jest, React Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/asithalakmal/weddinglk-next.git
cd weddinglk-next
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/weddinglk

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Add other services as needed
```

### 4. Database Setup

Start MongoDB locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run seed:basic
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Run System Tests

Visit `/test` page to run comprehensive system tests:

- Component rendering tests
- API health checks
- Database connection tests
- Vendor and venue API tests

### Run Individual Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format checking
npm run format:check
```

## 📁 Project Structure

```
weddinglk-next/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── vendors/           # Vendor pages
│   ├── venues/            # Venue pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── atoms/            # Basic UI components
│   ├── molecules/        # Compound components
│   ├── organisms/        # Complex components
│   └── ui/               # Radix UI components
├── lib/                  # Utility libraries
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── hooks/                # Custom React hooks
├── scripts/              # Build and deployment scripts
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing & Quality
npm run type-check       # TypeScript type checking
npm run lint             # ESLint code analysis
npm run format:check     # Prettier formatting check
npm run format           # Auto-format code

# Database
npm run seed:basic       # Seed basic test data
npm run seed:comprehensive # Seed comprehensive data

# Docker
npm run docker:build     # Build Docker image
npm run docker:start     # Start Docker container
npm run docker:stop      # Stop Docker container

# Performance
npm run analyze          # Bundle analysis
npm run performance      # Performance monitoring
```

## 🌐 API Endpoints

### Core APIs
- `GET /api/health` - System health check
- `GET /api/users/avatars` - User avatar data
- `GET /api/vendors/with-avatars` - Vendors with owner data
- `GET /api/venues/with-avatars` - Venues with data

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Session information

## 🗄️ Database Models

### User
- Basic profile information
- Role-based access (user, vendor, admin)
- Authentication and verification status

### Vendor
- Business information and services
- Location and contact details
- Rating and review system

### Venue
- Venue details and capacity
- Pricing and availability
- Amenities and images

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:start
```

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍🎓 Academic Project

This is a final year university project demonstrating:
- Full-stack web development
- Modern JavaScript/TypeScript practices
- Database design and management
- API development and testing
- Responsive UI/UX design
- Deployment and DevOps practices

## 🆘 Support

For questions or issues:
- Create an issue on GitHub
- Check the `/test` page for system diagnostics
- Review the API documentation

## 🔮 Future Enhancements

- [ ] Advanced AI recommendations
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social media integration
- [ ] Virtual venue tours
- [ ] Wedding timeline automation

---

**Built with ❤️ for the wedding industry in Sri Lanka** 