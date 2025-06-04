# 🍽️ Comida Africana - Authentic Nigerian Cuisine

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-18.x-green.svg)
![React Version](https://img.shields.io/badge/react-18.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0+-green.svg)

A modern, full-stack progressive web application for a Nigerian restaurant located in Tijuana, Mexico. Built with React, Node.js, and MongoDB, featuring authentic Nigerian cuisine ordering, user management, and administrative capabilities.

## 🌟 Features

### Customer Features
- 🍛 Browse authentic Nigerian dishes with advanced filtering
- 🛒 Full shopping cart functionality with real-time updates
- 👤 User authentication and profile management
- 📱 Progressive Web App (PWA) support
- 💳 Secure checkout process
- 📋 Order history and tracking
- ⭐ Review and rating system
- 📞 Contact form and restaurant information
- 🌐 Responsive design for all devices
- 🔄 Offline functionality with service workers

### Admin Features
- 📊 Comprehensive admin dashboard
- 🍽️ Menu management (CRUD operations)
- 📦 Order management and status updates
- 👥 User management
- 💬 Review moderation
- 📈 Analytics and reporting

### Technical Features
- 🔒 JWT-based authentication with refresh tokens
- 🛡️ Advanced security measures and rate limiting
- 🚀 Optimized performance and caching
- 📱 Mobile-first responsive design
- 🎨 Modern UI with Tailwind CSS and Framer Motion
- 🧪 Comprehensive testing suite
- 🔄 CI/CD pipeline with GitHub Actions
- 🐳 Docker containerization ready

## 🛠️ Technologies Used

### Frontend
- **React 18.2** - UI framework with hooks and context
- **React Router 6** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Winston** - Logging
- **Express Rate Limit** - Rate limiting
- **Jest** - Testing framework

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB 6.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/africana-comida.git
   cd africana-comida
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (backend + frontend)
   npm run install:all
   
   # Or install individually
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/comida-africana
   JWT_SECRET=your-super-secret-jwt-key
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   # Start both backend and frontend concurrently
   npm run dev
   
   # Or start individually
   npm run dev:backend    # Backend on http://localhost:5000
   npm run dev:frontend   # Frontend on http://localhost:3000
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
africana-comida/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Input validation
│   ├── tests/              # Backend tests
│   ├── logs/               # Application logs
│   └── server.js           # Entry point
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utility functions
│   └── tests/              # Frontend tests
├── .github/                # GitHub Actions workflows
├── docs/                   # Documentation
└── docker/                 # Docker configuration
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run with coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run with coverage report
```

### End-to-End Tests
```bash
npm run test:e2e           # Run E2E tests
```

## 🚀 Deployment

### Development
```bash
npm run dev                # Start development servers
```

### Production Build
```bash
npm run build              # Build both backend and frontend
npm start                  # Start production server
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-Specific Deployments
- **Staging**: Deployed automatically on push to `develop` branch
- **Production**: Deployed automatically on push to `main` branch

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/comida-africana

# Authentication
JWT_SECRET=your-jwt-secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Server
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_NODE_ENV=development
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `POST /api/users/refresh-token` - Refresh access token

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status (Admin)

For complete API documentation, visit `/api/docs` when running the server.

## 🛡️ Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting and request throttling
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- MongoDB injection prevention
- XSS protection

## 🎨 UI/UX Features

- Modern, responsive design
- Dark/light mode support
- Smooth animations and transitions
- Progressive Web App (PWA)
- Offline functionality
- Accessibility compliance (WCAG 2.1)
- Mobile-first approach
- Touch-friendly interface

## 📱 PWA Features

- Installable on mobile and desktop
- Offline menu browsing
- Background sync for orders
- Push notifications
- App-like experience
- Automatic updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer** - Full-stack development
- **UI/UX Designer** - Design and user experience
- **DevOps Engineer** - Deployment and infrastructure

## 🙏 Acknowledgments

- Nigerian culinary traditions and recipes
- Open source community
- Contributors and testers
- Tijuana local business community

## 📞 Support

For support, email support@comida-africana.com or join our Slack channel.

## 🗺️ Roadmap

### Version 2.0
- [ ] Multi-language support (Spanish, English, Yoruba)
- [ ] Advanced analytics dashboard
- [ ] Loyalty program integration
- [ ] Social media integration
- [ ] Advanced search and filtering
- [ ] Nutritional information
- [ ] Allergen tracking

### Version 2.1
- [ ] Mobile app (React Native)
- [ ] Reservation system
- [ ] Live chat support
- [ ] Integration with delivery services
- [ ] Recipe sharing feature
- [ ] Community forum

---

**Made with ❤️ for authentic Nigerian cuisine lovers in Tijuana, Mexico**
