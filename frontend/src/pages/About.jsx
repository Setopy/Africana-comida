import React from 'react';

function About() {
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
            Our Story
          </h1>
          <p style={{ fontSize: '1.2rem' }}>
            Bringing authentic Nigerian cuisine to Tijuana
          </p>
        </div>
      </div>

      {/* About Content */}
      <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>How It All Began</h2>
          
          {/* CEO Photo - Centered with Fixed Cropping */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src="/ceo.jpg" 
              alt="Mrs. Adebimpe Ogunji, CEO of Comida Africana"
              style={{
                width: '300px',
                height: '400px',
                borderRadius: '20px', // Rounded rectangle instead of circle
                objectFit: 'cover',
                objectPosition: 'center center', // Centered both ways
                border: '4px solid #8B4513',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            />
            {/* Aesthetic Name Frame */}
            <div style={{
              marginTop: '20px',
              padding: '15px 25px',
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
              borderRadius: '15px',
              border: '2px solid #D4AF37',
              boxShadow: '0 6px 15px rgba(139, 69, 19, 0.3)',
              maxWidth: '320px',
              margin: '20px auto 0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative corner elements */}
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                width: '20px',
                height: '20px',
                border: '2px solid #D4AF37',
                borderRight: 'none',
                borderBottom: 'none',
                borderRadius: '3px 0 0 0'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '20px',
                height: '20px',
                border: '2px solid #D4AF37',
                borderLeft: 'none',
                borderBottom: 'none',
                borderRadius: '0 3px 0 0'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '5px',
                left: '5px',
                width: '20px',
                height: '20px',
                border: '2px solid #D4AF37',
                borderRight: 'none',
                borderTop: 'none',
                borderRadius: '0 0 0 3px'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '20px',
                height: '20px',
                border: '2px solid #D4AF37',
                borderLeft: 'none',
                borderTop: 'none',
                borderRadius: '0 0 3px 0'
              }}></div>
              
              {/* Name and Title */}
              <div style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Mrs. Adebimpe Ogunji
                </h3>
                <div style={{
                  width: '60px',
                  height: '2px',
                  background: '#D4AF37',
                  margin: '8px auto',
                  borderRadius: '1px'
                }}></div>
                <p style={{
                  margin: '0',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  opacity: '0.95',
                  letterSpacing: '0.3px'
                }}>
                  Founder & CEO
                </p>
              </div>
            </div>
          </div>

          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Comida Africana began as a dream to introduce the rich and vibrant flavors of Nigerian cuisine to Tijuana. 
            Our CEO, Mrs Adebimpe Ogunji, moved to Mexico in 2024 and noticed the lack of authentic African dining options in the area.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Having grown up cooking traditional Nigerian dishes with great flare for various ingredients combinations, CEO Adebimpe decided to share her
            culinary heritage with her new community. We implore you on a mouth-watering journey as you explore and order for our delicious dishes. Thank you
          </p>
        </div>

        <div style={{ 
          padding: '30px', 
          backgroundColor: '#FFF8E1', 
          borderRadius: '8px',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513', textAlign: 'center' }}>Our Mission</h2>
          <p style={{ lineHeight: '1.6', textAlign: 'center', fontStyle: 'italic' }}>
            "To create an authentic dining experience that celebrates Nigerian culture through its cuisine, 
            while building bridges between communities and introducing the rich culinary traditions of Nigeria to Tijuana and Mexico in general."
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>Our Commitment to Authenticity</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            At Comida Africana, we are dedicated to preserving the authentic flavors of Nigerian cuisine. 
            We dextrously use spices and ingredients that deliciuosly bring out the fragrance of Nigeria dishes, and ensure quality in every dish we serve.
          </p>
          <p style={{ lineHeight: '1.6' }}>
            Our recipes are well curated and prepared with years of deep experience from real touches with Nigeria meals. We take pride in sharing these culinary traditions with our community in Tijuana.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>Community Involvement</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            We believe in giving back to the community that has embraced us. We strive to be more than just 
            a restaurant – we aim to be a cultural hub that brings people together through the love of good food.
          </p>
          <p style={{ lineHeight: '1.6' }}>
            We invite you to join us on this culinary journey and experience the rich flavors and traditions of Nigerian cuisine.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
