import React, { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'main-course', name: 'Main Dishes' },
    { id: 'appetizer', name: 'Starters' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'beverage', name: 'Drinks' }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuAPI.getAll();
      console.log('API Response:', response.data);
      setMenuItems(response.data.data || []);
    } catch (err) {
      setError('Failed to load menu items. Please try again.');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMenuItems}
            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">Our Menu</h1>
        <p className="text-center text-gray-600 mb-8">
          Authentic Nigerian cuisine made with love • Live from our kitchen
        </p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-amber-100 hover:shadow-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-amber-800 text-lg font-semibold">
                  {item.name}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Ingredients: </span>
                    <span className="text-sm text-gray-700">{item.ingredients.join(', ')}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-amber-600">
                    ${item.price}
                  </span>
                  <button className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items in this category</h3>
            <p className="text-gray-500">Try selecting a different category or check back later!</p>
          </div>
        )}

        {/* Live Data Indicator */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <span className="inline-flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live data from API • {menuItems.length} items loaded
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
