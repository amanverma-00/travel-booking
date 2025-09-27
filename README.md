# 🧳 Wanderlust - Travel Booking Platform

A full-stack travel booking platform built with React, Node.js, and MongoDB. Book unique accommodations, manage listings, and explore the world with Wanderlust!

![Wanderlust Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop)

## ✨ Features

### 🔐 Authentication & User Management
- **OTP-based Registration**: Secure email verification with 6-digit OTP
- **JWT Authentication**: Secure login/logout with token management
- **User Profiles**: Complete profile management with image uploads
- **Role-based Access**: Guest and Host user roles

### 🏠 Property Management
- **Property Listings**: Create detailed property listings with multiple images
- **Advanced Search**: Filter by location, dates, price, and amenities
- **Interactive Maps**: Location-based property discovery
- **Booking System**: Complete booking workflow with payment integration

### 📊 Analytics & Dashboard
- **Host Dashboard**: Earnings analytics, booking management
- **Advanced Analytics**: Revenue trends, occupancy rates
- **Performance Metrics**: Real-time insights for hosts

### 🌍 Multilingual Support
- **i18n Integration**: Support for 8 languages
- **RTL Support**: Right-to-left language compatibility
- **Dynamic Translation**: Real-time language switching

### 💳 Payment & Booking
- **Secure Payments**: Integrated payment processing
- **Booking Management**: Complete booking lifecycle
- **Calendar Integration**: Availability management

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Redis (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amanverma-00/travel-booking.git
   cd travel-booking
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/wanderlust
   REDIS_URL=redis://localhost:6379
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Email Configuration (for OTP)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@wanderlust.com
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

5. **Start the application**
   
   **Terminal 1 - Start Server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Start Client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/api/health

## 🏗️ Project Structure

```
wanderlust/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   │   └── locales/           # Translation files
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Redux store
│   │   ├── contexts/         # React contexts
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   ├── validations/      # Input validation
│   │   ├── config/           # Configuration files
│   │   └── utils/            # Utility functions
│   ├── uploads/              # File uploads
│   ├── package.json
│   └── .env
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React i18next** - Internationalization
- **Heroicons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Zod** - Input validation
- **Nodemailer** - Email service
- **Cloudinary** - Image storage

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **PostCSS** - CSS processing

## 📱 API Endpoints

### Authentication
```
POST   /api/auth/send-signup-otp     # Send OTP for registration
POST   /api/auth/verify-signup-otp   # Verify OTP and create user
POST   /api/auth/resend-signup-otp   # Resend OTP
POST   /api/auth/login               # User login
POST   /api/auth/logout              # User logout
GET    /api/auth/profile             # Get user profile
PUT    /api/auth/profile             # Update user profile
```

### Properties
```
GET    /api/properties               # Get all properties
GET    /api/properties/:id           # Get property by ID
POST   /api/properties               # Create new property
PUT    /api/properties/:id           # Update property
DELETE /api/properties/:id           # Delete property
GET    /api/search                   # Search properties
```

### Bookings
```
GET    /api/bookings                 # Get user bookings
POST   /api/bookings                 # Create booking
PUT    /api/bookings/:id            # Update booking
DELETE /api/bookings/:id            # Cancel booking
```

### Analytics
```
GET    /api/analytics/dashboard      # Host dashboard data
GET    /api/analytics/earnings       # Earnings analytics
GET    /api/analytics/occupancy      # Occupancy rates
```

## 🔧 Configuration

### Database Setup
1. Install MongoDB and Redis
2. Start MongoDB: `mongod`
3. Start Redis: `redis-server`
4. Database will be created automatically on first run

### Email Configuration
1. Create Gmail app password
2. Add credentials to `.env` file
3. Test email functionality with OTP registration

### Image Upload Setup
1. Create Cloudinary account
2. Get API credentials
3. Add to `.env` file

## 🌍 Internationalization

Supported languages:
- English (en)
- Hindi (hi)
- Spanish (es)
- Gujarati (gu)
- Bengali (bn)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)

Add new translations in `client/public/locales/[language]/translation.json`

## 📝 Environment Variables

Required environment variables for production:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderlust
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=super-secure-random-string
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=noreply@wanderlust.com

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
NODE_ENV=production
```

## 🚀 Deployment

### Local Development
```bash
# Server
cd server && npm run dev

# Client
cd client && npm run dev
```

### Production Build
```bash
# Build client
cd client && npm run build

# Start server
cd server && npm start
```

### Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🧪 Testing

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Run E2E tests
npm run test:e2e
```

## 📊 Performance Features

- **Image Optimization**: Automatic image compression and resizing
- **Lazy Loading**: Components and images load on demand
- **Caching**: Redis caching for frequently accessed data
- **Code Splitting**: Automatic code splitting with Vite
- **CDN Integration**: Cloudinary for global image delivery

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation with Zod
- **CORS Protection**: Configured CORS policies
- **Rate Limiting**: API rate limiting middleware
- **Password Hashing**: bcrypt for password security
- **XSS Protection**: Input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

## 📋 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time chat system
- [ ] Advanced recommendation engine
- [ ] Social media integration
- [ ] Loyalty program
- [ ] Multi-currency support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aman Verma**
- GitHub: [@amanverma-00](https://github.com/amanverma-00)
- LinkedIn: [Aman Verma](https://linkedin.com/in/amanverma-00)

## 🙏 Acknowledgments

- UI inspiration from Airbnb
- Icons from Heroicons
- Images from Unsplash
- Community support from Stack Overflow

## 📞 Support

For support, email: support@wanderlust.com or create an issue on GitHub.

---

**⭐ Star this repository if you found it helpful!**

## 🔗 Live Demo

Visit the live application: [Wanderlust Travel Booking](https://wanderlust-travel.vercel.app)

---

*Made with ❤️ by Aman Verma*