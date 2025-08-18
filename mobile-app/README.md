# WeddingLK Mobile App

A comprehensive wedding planning mobile application built with React Native and Expo.

## 🚀 Features

- **Authentication**: Login, Register, Password Reset
- **Home Dashboard**: Featured vendors, venues, and services
- **Vendor Management**: Browse, search, and book vendors
- **Venue Booking**: Find and reserve wedding venues
- **Planning Tools**: Wedding timeline, budget tracker, guest list
- **Real-time Chat**: Communicate with vendors and planners
- **Payment Integration**: Secure payment processing
- **Push Notifications**: Stay updated on bookings and messages
- **Offline Support**: Basic functionality without internet

## 🛠 Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper, React Native Elements
- **State Management**: React Hooks + Context
- **Icons**: Expo Vector Icons
- **Charts**: React Native Chart Kit
- **Calendar**: React Native Calendars
- **Notifications**: Expo Notifications
- **Storage**: AsyncStorage, SQLite
- **Authentication**: Custom JWT implementation

## 📱 Screens

### Authentication
- Splash Screen
- Login Screen
- Register Screen
- Forgot Password Screen

### Main App
- Home Screen
- Dashboard Screen
- Profile Screen
- Vendor Detail Screen
- Venue Detail Screen
- Planning Tools Screen

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weddinglk-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   └── ...            # Other screen categories
├── navigation/         # Navigation configuration
├── services/           # API and external services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # App constants
├── types/              # TypeScript type definitions
└── assets/             # Images, fonts, etc.
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
API_BASE_URL=https://your-api-domain.com
STRIPE_PUBLISHABLE_KEY=your_stripe_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### API Integration
The app integrates with the WeddingLK backend API for:
- User authentication
- Vendor and venue data
- Booking management
- Payment processing
- Real-time messaging

## 📱 Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

### Web
```bash
expo build:web
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### EAS Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for platforms
eas build --platform all
```

### App Store / Play Store
1. Build production app using EAS
2. Submit to respective app stores
3. Follow platform-specific guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Keep your app updated:
```bash
expo update
```

## 📊 Performance

- Lazy loading for images and components
- Optimized bundle size
- Efficient navigation
- Background task management
- Memory optimization

## 🔒 Security

- Secure API communication
- Token-based authentication
- Data encryption
- Secure storage
- Input validation

## 🌐 Internationalization

- Multi-language support
- RTL layout support
- Localized content
- Currency formatting
- Date/time localization 