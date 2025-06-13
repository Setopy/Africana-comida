# Netlify Functions Migration Guide

## ✅ What's Been Completed

### 1. Netlify Functions Setup
- Created `netlify.toml` configuration
- Set up functions directory structure at `netlify/functions/`
- Configured build settings and redirects

### 2. Backend Functions Migration
- **Menu API**: `netlify/functions/menu.js`
- **Orders API**: `netlify/functions/orders.js` 
- **Users API**: `netlify/functions/users.js`
- **Reviews API**: `netlify/functions/reviews.js`

### 3. Shared Dependencies
- **Database**: MongoDB connection with caching
- **Models**: All Mongoose models (User, Order, MenuItem, Review, RefreshToken)
- **Authentication**: JWT auth middleware and token generation
- **Package management**: Separate package.json for function dependencies

### 4. Frontend Updates
- Updated API configuration to use Netlify Functions
- Flexible development/production API URL handling
- Added new npm scripts for functions development

## 🔧 Required Environment Variables

Set these in your Netlify dashboard under Site Settings > Environment Variables:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
CORS_ORIGIN=https://your-site.netlify.app
FRONTEND_URL=https://your-site.netlify.app
LOG_LEVEL=info
```

## 🚀 Deployment Steps

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Deploy to Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `frontend/dist`
4. Set functions directory: `netlify/functions`
5. Add environment variables in Netlify dashboard

### 3. Test the Migration
```bash
# For local testing with Netlify Functions
npm run dev:functions

# Or continue using Express backend in development
npm run dev
```

## 📊 API Endpoints Migration

| Original Express Route | Netlify Function | Status |
|----------------------|------------------|---------|
| `/api/menu` | `/.netlify/functions/menu` | ✅ |
| `/api/orders` | `/.netlify/functions/orders` | ✅ |
| `/api/users` | `/.netlify/functions/users` | ✅ |
| `/api/reviews` | `/.netlify/functions/reviews` | ✅ |

## 🔄 Development Workflow

### Option 1: Continue with Express (Recommended for development)
```bash
npm run dev
```

### Option 2: Test with Netlify Functions locally
```bash
npm run dev:functions
```

## ⚡ Benefits Achieved

1. **No Cold Starts**: Netlify Functions are serverless with instant wake-up
2. **Simplified Deployment**: Single platform for frontend + backend
3. **Better Performance**: Functions run on Netlify's global CDN
4. **Cost Effective**: Pay only for actual function invocations
5. **Auto-scaling**: Handles traffic spikes automatically

## 🔧 What Changed

### Frontend Changes
- API URL now points to `/.netlify/functions` in production
- Added environment variable `VITE_USE_FUNCTIONS` for development flexibility

### Backend Changes
- Express server routes converted to individual serverless functions
- Shared MongoDB connection with connection pooling
- Authentication middleware adapted for serverless context
- Error handling adapted for function responses

## 📝 Next Steps

1. Set up environment variables in Netlify
2. Deploy and test all endpoints
3. Monitor function performance
4. Consider removing the Express backend after successful migration

## 🛠️ Troubleshooting

### Function Cold Starts
- Netlify Functions have minimal cold start times
- Database connections are cached between invocations

### CORS Issues
- Ensure `CORS_ORIGIN` environment variable matches your domain
- Functions include proper CORS headers

### Database Connections
- MongoDB connections are pooled and reused
- Connection timeouts optimized for serverless environment