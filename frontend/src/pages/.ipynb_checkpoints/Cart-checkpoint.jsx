// src/pages/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <div>
        {/* Hero Section */}
        <div style={{ 
          backgroundColor: '#8B4513', 
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
              Your Cart
            </h1>
            <p style={{ fontSize: '1.2rem' }}>
              Your cart is currently empty
            </p>
          </div>
        </div>
        
        <div style={{ 
          padding: '60px 20px', 
          maxWidth: '1200px', 
          margin: '0 auto',
          textAlign: 'center' 
        }}>
          <p style={{ marginBottom: '30px', fontSize: '1.2rem' }}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link 
            to="/menu" 
            style={{
              backgroundColor: '#8B4513',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Browse Our Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#8B4513', 
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            Your Cart
          </h1>
          <p style={{ fontSize: '1.2rem' }}>
            Review your items before checkout
          </p>
        </div>
      </div>
      
      {/* Cart Content */}
      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '40px'
        }}>
          {/* Cart Items */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Cart Items ({totalItems})</h2>
            <div style={{ marginBottom: '30px' }}>
              {cart.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    padding: '20px',
                    borderBottom: '1px solid #eee',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '100px', marginRight: '20px' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ marginBottom: '8px' }}>{item.name}</h3>
                    <p style={{ color: '#666', marginBottom: '8px' }}>${item.price.toFixed(2)} each</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#f2f2f2',
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        -
                      </button>
                      <span style={{ 
                        padding: '0 12px',
                        fontSize: '16px'
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#f2f2f2',
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearCart}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #8B4513',
                color: '#8B4513',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Clear Cart
            </button>
          </div>
          
          {/* Order Summary */}
          <div>
            <div style={{ 
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              padding: '24px',
              position: 'sticky',
              top: '20px'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Order Summary</h2>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px' 
              }}>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px' 
              }}>
                <span>Delivery Fee</span>
                <span>$5.00</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px' 
              }}>
                <span>Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                borderTop: '1px solid #ddd',
                marginTop: '16px',
                paddingTop: '16px',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                <span>Total</span>
                <span>${(totalPrice + 5 + (totalPrice * 0.1)).toFixed(2)}</span>
              </div>
              
              <button 
                style={{
                  backgroundColor: '#8B4513',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '4px',
                  border: 'none',
                  width: '100%',
                  marginTop: '24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Proceed to Checkout
              </button>
              
              <Link 
                to="/menu" 
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '16px',
                  color: '#8B4513',
                  textDecoration: 'none'
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;