import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Loading from './components/ui/Loading';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy-loaded pages
const Menu = lazy(() => import('./pages/Menu'));
const MenuItem = lazy(() => import('./pages/MenuItem'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:id" element={<MenuItem />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute element={<Dashboard />} />} />
            <Route path="/admin/menu" element={<AdminRoute element={<AdminMenu />} />} />
            <Route path="/admin/orders" element={<AdminRoute element={<AdminOrders />} />} />
            <Route path="/admin/reviews" element={<AdminRoute element={<AdminReviews />} />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;