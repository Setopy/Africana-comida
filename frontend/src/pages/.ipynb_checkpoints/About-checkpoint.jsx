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
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Comida Africana began as a dream to introduce the rich and vibrant flavors of Nigerian cuisine to Tijuana. 
            Our founder, Chef Ade, moved to Mexico in 2020 and noticed the lack of authentic African dining options in the area.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Having grown up cooking traditional Nigerian dishes alongside his grandmother, Chef Ade decided to share his 
            culinary heritage with his new community. What started as small pop-up events quickly gained popularity, leading 
            to the establishment of our restaurant in 2023.
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
            while building bridges between communities and introducing the rich culinary traditions of Nigeria to Tijuana."
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>Our Commitment to Authenticity</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            At Comida Africana, we are dedicated to preserving the authentic flavors of Nigerian cuisine. 
            We import special spices and ingredients directly from Nigeria, while also sourcing fresh local produce 
            to ensure the highest quality in every dish we serve.
          </p>
          <p style={{ lineHeight: '1.6' }}>
            Our recipes have been passed down through generations, and our chefs have been trained in traditional 
            Nigerian cooking techniques. We take pride in sharing these culinary traditions with our community in Tijuana.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#8B4513' }}>Community Involvement</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            We believe in giving back to the community that has embraced us. Comida Africana regularly hosts 
            cultural events, cooking classes, and fundraisers for local causes. We strive to be more than just 
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