import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { useCart } from '../context/CartContext';

const MenuItem = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/menu/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error('Error fetching menu item:', error);
        setError('Failed to load menu item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: quantity
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold text-amber-900 mb-4">Error Loading Menu Item</h1>
        <p className="text-gray-600 mb-6">{error || 'Item not found'}</p>
        <Link
          to="/menu"
          className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="lg:w-1/2">
            <div className="mb-2 flex items-center">
              <span className="text-sm font-medium px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                {item.category}
              </span>
              <span className="ml-2 text-sm font-medium px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                {item.country}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-amber-900 mt-2">{item.name}</h1>
            
            <div className="mt-2 flex items-center">
              {item.spicyLevel > 0 && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Spicy Level:</span>
                  {[...Array(item.spicyLevel)].map((_, i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5 text-red-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <p className="text-2xl font-bold text-amber-700">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-700">{item.description}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-amber-900">Ingredients:</h3>
              <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                {item.ingredients && item.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-                               7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden mr-4">
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-100 border-r border-gray-300"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-100 border-l border-gray-300"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="text-sm text-gray-600">Preparation Time:</p>
                  <p className="font-medium">{item.prepTime || 'N/A'} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available:</p>
                  <p className="font-medium">{item.isAvailable ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Link
            to="/menu"
            className="text-amber-700 hover:text-amber-800 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;