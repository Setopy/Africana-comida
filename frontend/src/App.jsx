import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';

// Import page components
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Footer from './components/Footer';

// Navbar component with cart functionality
const Navbar = () => {
  const { totalItems } = useCart();
  
  return (
    <nav style={{ background: '#8B4513', padding: '15px 20px' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Comida Africana</Link>
        </div>
        <ul style={{ 
          display: 'flex', 
          listStyle: 'none', 
          gap: '20px', 
          margin: 0, 
          padding: 0,
          alignItems: 'center'
        }}>
          <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
          <li><Link to="/menu" style={{ color: 'white', textDecoration: 'none' }}>Menu</Link></li>
          <li><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link></li>
          <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li>
          <li>
            <Link to="/cart" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span>Cart</span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-12px',
                  backgroundColor: '#FFD700',
                  color: '#8B4513',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Main App component
function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: '1 0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;