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
          
          {/* CEO Photo - Centered */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src="/ceo.jpg" 
              alt="Mrs. Adebimpe Ogunji, CEO of Comida Africana"
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '55%',
                objectFit: 'cover',
                border: '4px solid #8B4513',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            />
            <p style={{ 
              marginTop: '10px', 
              fontStyle: 'italic', 
              color: '#8B4513',
              fontSize: '0.9rem'
            }}>
              Mrs. Adebimpe Ogunji, Founder & CEO
            </p>
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
