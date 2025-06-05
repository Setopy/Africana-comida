# 🚀 Comida Africana - Full-Stack Deployment Guide

## 📋 Overview
Complete full-stack React + Node.js application with backend serving frontend static files for single-domain deployment.

## 🏗️ Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS + PWA
- **Backend**: Node.js + Express + MongoDB + Winston
- **Deployment**: Single server serving both frontend and API

## 🛠️ Build Process

### Local Development
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Production Build
```bash
# Complete production build
npm run build:production

# Or just frontend build
npm run build:frontend
```

### Production Deployment
```bash
# Start production server
npm start
# Serves frontend + API on same port
```

## 📁 Project Structure
```
/
├── backend/                 # Node.js API server
│   ├── server.js           # Main server file
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utilities
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── config/         # Frontend config
│   │   └── services/       # API services
│   ├── dist/              # Built assets (generated)
│   └── package.json
└── package.json           # Root package file
```

## 🌐 Environment Configuration

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-32-character-secret-key
CORS_ORIGIN=*
FRONTEND_URL=https://your-domain.com
```

### Frontend Environment Variables
```bash
# .env.production
VITE_NODE_ENV=production
VITE_API_URL=/api
```

## 📡 API Endpoints

### Health Checks
- `GET /health` - Server health status
- `GET /api/health` - API health status  
- `GET /api` - API information

### Application Routes
- `GET /` - Frontend application
- `GET /menu` - Menu page (client-side routing)
- `GET /login` - Login page (client-side routing)
- `GET /api/*` - API routes

## 🔧 Render.com Deployment

### Build Settings
```
Build Command: npm run build:production
Start Command: npm start
```

### Environment Variables (in Render dashboard)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-atlas-uri
JWT_SECRET=your-32-char-secret-key
CORS_ORIGIN=*
```

### Health Check
```
Health Check Path: /health
```

## 📦 Static Asset Handling
- **Frontend assets**: `/frontend/dist/` served by Express
- **Cache headers**: Optimized for production performance
- **Client routing**: SPA routing handled by Express catch-all
- **API separation**: `/api/*` routes handled separately

## 🧪 Testing

### Local Testing
```bash
# Test build process
npm run build:frontend

# Test production server
NODE_ENV=production npm start
```

### Verify Endpoints
```bash
# Health checks
curl http://localhost:5000/health
curl http://localhost:5000/api/health

# Frontend serving
curl http://localhost:5000/
curl http://localhost:5000/menu
```

## 🚨 Troubleshooting

### Missing dist folder
```bash
cd frontend && npm run build
```

### Port conflicts
```bash
PORT=5001 npm start
```

### CORS issues
- Check `CORS_ORIGIN` environment variable
- Verify frontend `VITE_API_URL` configuration

### Static files not loading
- Verify `/frontend/dist/` exists and contains built assets
- Check Express static file serving configuration

## 📈 Performance Features
- ✅ Code splitting (vendor, router chunks)
- ✅ Asset optimization and compression  
- ✅ PWA with service worker
- ✅ Optimized cache headers
- ✅ Gzip compression enabled
- ✅ Non-blocking MongoDB connection

## 🔐 Security Features
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ Request rate limiting
- ✅ Input validation

---

**Ready for Production Deployment** ✅