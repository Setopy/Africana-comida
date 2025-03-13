import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  // Categories for Nigerian cuisine
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'starters', name: 'Starters & Appetizers' },
    { id: 'main', name: 'Main Dishes' },
    { id: 'soups', name: 'Traditional Soups' },
    { id: 'sides', name: 'Side Dishes' },
    { id: 'desserts', name: 'Desserts & Sweets' },
    { id: 'drinks', name: 'Drinks' }
  ];

  // Sample Nigerian menu items with detailed descriptions
  const menuItems = [
    {
      id: 1,
      name: "Jollof Rice",
      description: "A flavorful rice dish cooked in a rich tomato and pepper sauce with traditional Nigerian spices. Served with your choice of protein.",
      price: 12.99,
      category: "main",
      spicyLevel: 2,
      image: "https://via.placeholder.com/300x200?text=Jollof+Rice"
    },
    {
      id: 2,
      name: "Egusi Soup",
      description: "Traditional Nigerian soup made with ground melon seeds, leafy vegetables, and choice of protein. Served with pounded yam, fufu, or rice.",
      price: 14.99,
      category: "soups",
      spicyLevel: 3,
      image: "https://via.placeholder.com/300x200?text=Egusi+Soup"
    },
    {
      id: 3,
      name: "Suya",
      description: "Spicy grilled beef skewers seasoned with a unique blend of ground peanuts and spices. A popular Nigerian street food.",
      price: 10.99,
      category: "starters",
      spicyLevel: 4,
      image: "https://via.placeholder.com/300x200?text=Suya"
    },
    {
      id: 4,
      name: "Pounded Yam with Efo Riro",
      description: "Smooth, stretchy pounded yam served with a rich vegetable stew cooked with assorted meats and fish.",
      price: 15.99,
      category: "main",
      spicyLevel: 2,
      image: "https://via.placeholder.com/300x200?text=Pounded+Yam"
    },
    {
      id: 5,
      name: "Moin Moin",
      description: "Steamed bean pudding made from peeled blended beans, onions, and peppers. Can be served plain or with boiled eggs inside.",
      price: 8.99,
      category: "sides",
      spicyLevel: 1,
      image: "https://via.placeholder.com/300x200?text=Moin+Moin"
    },
    {
      id: 6,
      name: "Akara",
      description: "Deep-fried bean cakes made from black-eyed peas, similar to hush puppies but with a Nigerian twist. A popular breakfast item.",
      price: 7.99,
      category: "starters",
      spicyLevel: 1,
      image: "https://via.placeholder.com/300x200?text=Akara"
    },
    {
      id: 7,
      name: "Pepper Soup",
      description: "A light, spicy soup made with a variety of meats or fish and a unique blend of Nigerian spices. Known for its medicinal properties.",
      price: 13.99,
      category: "soups",
      spicyLevel: 5,
      image: "https://via.placeholder.com/300x200?text=Pepper+Soup"
    },
    {
      id: 8,
      name: "Chin Chin",
      description: "Sweet, crunchy fried pastry snack made from flour, sugar, and other ingredients. Perfect for dessert or as a quick snack.",
      price: 5.99,
      category: "desserts",
      spicyLevel: 0,
      image: "https://via.placeholder.com/300x200?text=Chin+Chin"
    },
    {
      id: 9,
      name: "Zobo Drink",
      description: "A refreshing hibiscus-based drink infused with ginger and other spices. Served cold and slightly sweetened.",
      price: 4.99,
      category: "drinks",
      spicyLevel: 0,
      image: "https://via.placeholder.com/300x200?text=Zobo+Drink"
    },
    {
      id: 10,
      name: "Ofada Stew",
      description: "A spicy stew made with red bell peppers, scotch bonnet peppers, and locust beans. Traditionally served with ofada rice.",
      price: 13.99,
      category: "main",
      spicyLevel: 4,
      image: "https://via.placeholder.com/300x200?text=Ofada+Stew"
    },
    {
      id: 11,
      name: "Dodo (Fried Plantain)",
      description: "Sweet, ripe plantains, sliced and deep-fried until golden brown. A popular side dish that complements many Nigerian meals.",
      price: 6.99,
      category: "sides",
      spicyLevel: 0,
      image: "https://via.placeholder.com/300x200?text=Dodo"
    },
    {
      id: 12,
      name: "Chapman",
      description: "A non-alcoholic cocktail made with a blend of Fanta, Sprite, grenadine, cucumber, lemon, and a hint of Angostura bitters.",
      price: 5.99,
      category: "drinks",
      spicyLevel: 0,
      image: "https://via.placeholder.com/300x200?text=Chapman"
    }
  ];

  // State for active category filter
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter menu items based on active category
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Function to render spicy level indicators
  const renderSpicyLevel = (level) => {
    const peppers = [];
    for (let i = 0; i < level; i++) {
      peppers.push(
        <span key={i} style={{ color: 'red' }}>🌶️</span>
      );
    }
    return peppers;
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
            Nigerian Cuisine
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Explore our authentic Nigerian dishes prepared with traditional recipes and techniques.
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Category Filter */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{ 
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: activeCategory === category.id ? '#8B4513' : '#F5F5DC',
                color: activeCategory === category.id ? 'white' : '#8B4513',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{item.name}</h3>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${item.price.toFixed(2)}</span>
                  </div>
                  {item.spicyLevel > 0 && (
                    <div style={{ marginTop: '5px' }}>
                      {renderSpicyLevel(item.spicyLevel)}
                    </div>
                  )}
                </div>
                <p style={{ color: '#666', marginBottom: '15px', flexGrow: 1 }}>{item.description}</p>
                <button 
                  style={{ 
                    backgroundColor: '#8B4513', 
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    alignSelf: 'flex-end'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;