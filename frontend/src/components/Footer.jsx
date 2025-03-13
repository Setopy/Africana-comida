import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ 
      backgroundColor: '#8B4513', 
      color: 'white',
      padding: '40px 20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Comida Africana</h3>
            <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
              Authentic Nigerian cuisine in the heart of Tijuana. Experience the rich flavors and culinary traditions of Nigeria.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'block' }}>Home</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/menu" style={{ color: 'white', textDecoration: 'none', display: 'block' }}>Menu</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/about" style={{ color: 'white', textDecoration: 'none', display: 'block' }}>About Us</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/contact" style={{ color: 'white', textDecoration: 'none', display: 'block' }}>Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Contact Us</h3>
            <address style={{ fontStyle: 'normal', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '10px' }}>123 Avenida Principal</p>
              <p style={{ marginBottom: '10px' }}>Tijuana, Baja California</p>
              <p style={{ marginBottom: '10px' }}>Mexico</p>
              <p style={{ marginBottom: '10px' }}>Phone: (123) 456-7890</p>
              <p>Email: info@comida-africana.com</p>
            </address>
          </div>
          
          {/* Hours */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Opening Hours</h3>
            <p style={{ marginBottom: '10px' }}>Monday - Thursday: 11:00 AM - 9:00 PM</p>
            <p style={{ marginBottom: '10px' }}>Friday - Saturday: 11:00 AM - 10:00 PM</p>
            <p>Sunday: 12:00 PM - 8:00 PM</p>
          </div>
        </div>
        
        {/* Copyright */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.2)', 
          paddingTop: '20px',
          textAlign: 'center' 
        }}>
          <p>&copy; {currentYear} Comida Africana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;