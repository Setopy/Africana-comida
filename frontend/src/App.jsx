import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';
import Loading from './components/ui/Loading';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Menu = React.lazy(() => import('./pages/Menu'));
const MenuItem = React.lazy(() => import('./pages/MenuItem'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const OrderConfirmation = React.lazy(() => import('./pages/OrderConfirmation'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Reviews = React.lazy(() => import('./pages/Reviews'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminMenu = React.lazy(() => import('./pages/admin/AdminMenu'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminReviews = React.lazy(() => import('./pages/admin/AdminReviews'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading size="lg" />
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<PageLoadingFallback />}>
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/menu/:id" element={<MenuItem />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/reviews" element={<Reviews />} />
                        <Route path="/cart" element={<Cart />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected Routes */}
                        <Route path="/checkout" element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } />
                        <Route path="/order-confirmation/:orderId" element={
                          <ProtectedRoute>
                            <OrderConfirmation />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="/orders" element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        } />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } />
                        <Route path="/admin/menu" element={
                          <AdminRoute>
                            <AdminMenu />
                          </AdminRoute>
                        } />
                        <Route path="/admin/orders" element={
                          <AdminRoute>
                            <AdminOrders />
                          </AdminRoute>
                        } />
                        <Route path="/admin/reviews" element={
                          <AdminRoute>
                            <AdminReviews />
                          </AdminRoute>
                        } />
                        
                        {/* 404 Route */}
                        <Route path="*" element={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                              <p className="text-gray-600 mb-6">Page not found</p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.history.back()}
                                className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
                              >
                                Go Back
                              </motion.button>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </motion.div>
                  </Suspense>
                </AnimatePresence>
              </main>
              
              <Footer />
            </div>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#374151',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;