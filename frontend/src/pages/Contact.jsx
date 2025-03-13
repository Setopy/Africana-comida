import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('success');
    // In a real application, you would send this data to your server
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

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
            Contact Us
          </h1>
          <p style={{ fontSize: '1.2rem' }}>
            We'd love to hear from you! Reach out for reservations, inquiries, or feedback.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '40px' 
        }}>
          {/* Contact Information */}
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>Visit Us</h2>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#8B4513' }}>Address</h3>
              <p style={{ marginBottom: '5px' }}>123 Avenida Principal</p>
              <p style={{ marginBottom: '5px' }}>Tijuana, Baja California</p>
              <p>Mexico</p>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#8B4513' }}>Opening Hours</h3>
              <p style={{ marginBottom: '5px' }}>Monday - Thursday: 11:00 AM - 9:00 PM</p>
              <p style={{ marginBottom: '5px' }}>Friday - Saturday: 11:00 AM - 10:00 PM</p>
              <p>Sunday: 12:00 PM - 8:00 PM</p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#8B4513' }}>Contact Information</h3>
              <p style={{ marginBottom: '5px' }}>Phone: (123) 456-7890</p>
              <p style={{ marginBottom: '5px' }}>Email: info@comida-africana.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>Send Us a Message</h2>
            
            {formStatus === 'success' && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#DFF0D8', 
                color: '#3C763D',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                Thank you for your message! We'll get back to you as soon as possible.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label 
                  htmlFor="name" 
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label 
                  htmlFor="email" 
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label 
                  htmlFor="phone" 
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px' 
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label 
                  htmlFor="message" 
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              
              <button
                type="submit"
                style={{ 
                  backgroundColor: '#8B4513', 
                  color: 'white',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513', textAlign: 'center' }}>Find Us</h2>
          <div style={{ 
            width: '100%',
            height: '400px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            <p>Map will be displayed here</p>
            {/* In a real application, you would integrate Google Maps or another map service here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;