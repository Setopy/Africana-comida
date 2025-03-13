import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import OptimizedImage from '../ui/OptimizedImage';
import { formatCurrency } from '../../config/constants';

/**
 * MenuCard component displays a menu item card with image, details and actions
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - Menu item data
 * @returns {JSX.Element} - MenuCard component
 */
const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  };
  
  // Function to render spicy level indicators
  const renderSpicyLevel = (level) => {
    return (
      <div className="flex items-center">
        {[...Array(level)].map((_, i) => (
          <svg 
            key={i}
            className="w-4 h-4 text-red-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z" clipRule="evenodd" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative">
        <OptimizedImage
          src={item.image}
          alt={item.name}
          className="w-full h-48"
          width="100%"
          height="192px"
        />
        
        {item.featured && (
          <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">{item.name}</h3>
        
        <div className="flex items-center justify-between mt-1 mb-2">
          <span className="text-amber-800 text-sm">{item.country}</span>
          {item.spicyLevel > 0 && (
            <div className="ml-2 flex items-center">
              {renderSpicyLevel(item.spicyLevel)}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{item.description}</p>
        
        {!item.isAvailable && (
          <div className="mb-3 py-1 px-2 bg-red-100 text-red-800 text-xs font-medium rounded flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-                      3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Currently Unavailable
          </div>
        )}
        
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-amber-900">{formatCurrency(item.price)}</span>
            <div className="flex space-x-2">
              <Link 
                to={`/menu/${item._id}`}
                className="px-3 py-1 bg-amber-100 text-amber-900 rounded hover:bg-amber-200 transition-colors"
              >
                Details
              </Link>
              {item.isAvailable && (
                <button
                  onClick={handleAddToCart}
                  className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                  aria-label={`Add ${item.name} to cart`}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;