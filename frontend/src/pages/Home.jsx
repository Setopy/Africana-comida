import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#8B4513', 
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            Experience Authentic Nigerian Cuisine in Tijuana
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            A culinary journey through Nigeria's rich food heritage, bringing traditional flavors and recipes to your table.
          </p>
          <div>
            <Link to="/menu" style={{ 
              backgroundColor: '#FFD700', 
              color: '#8B4513',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginRight: '10px'
            }}>
              Explore Our Menu
            </Link>
            <Link to="/contact" style={{ 
              backgroundColor: 'white', 
              color: '#8B4513',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              Find Us
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div style={{ padding: '60px 20px', backgroundColor: '#FFF8E1' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Our Featured Dishes</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            {/* Featured Dish 1 - Jollof Rice */}
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://via.placeholder.com/300x200?text=Jollof+Rice" 
                alt="Jollof Rice" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3>Jollof Rice</h3>
                <p>Traditional Nigerian spiced rice cooked in rich tomato sauce with vegetables and choice of protein.</p>
                <Link to="/menu" style={{ 
                  color: '#8B4513', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '10px'
                }}>
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Featured Dish 2 - Fried Rice */}
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://via.placeholder.com/300x200?text=Fried+Rice" 
                alt="Fried Rice" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3>Fried Rice</h3>
                <p>Nigerian-style fried rice with mixed vegetables, spices, and tender chicken pieces.</p>
                <Link to="/menu" style={{ 
                  color: '#8B4513', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '10px'
                }}>
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Featured Dish 3 - Egusi */}
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://via.placeholder.com/300x200?text=Egusi+Soup" 
                alt="Egusi Soup" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3>Egusi</h3>
                <p>Traditional Nigerian soup made from ground calabash seeds, leafy vegetables, and assorted meats.</p>
                <Link to="/menu" style={{ 
                  color: '#8B4513', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '10px'
                }}>
                  View Details
                </Link>
              </div>
            </div>

            {/* Featured Dish 4 - Wheat */}
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://via.placeholder.com/300x200?text=Wheat" 
                alt="Wheat" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3>Wheat</h3>
                <p>Nigerian wheat meal served as a swallow with your choice of soup. A nutritious and filling staple.</p>
                <Link to="/menu" style={{ 
                  color: '#8B4513', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '10px'
                }}>
                  View Details
                </Link>
              </div>
            </div>

            {/* Featured Dish 5 - Akara */}
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://via.placeholder.com/300x200?text=Akara" 
                alt="Akara" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3>Akara</h3>
                <p>Deep-fried bean cakes made from beans. A popular breakfast and snack item with chicken.</p>
                <Link to="/menu" style={{ 
                  color: '#8B4513', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '10px'
                }}>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Make sure to use this exact export syntax
export default Home;
