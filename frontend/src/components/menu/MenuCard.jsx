import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

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

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900">{item.name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-amber-800">{item.country}</span>
          {item.spicyLevel > 0 && (
            <div className="ml-2 flex items-center">
              {[...Array(item.spicyLevel)].map((_, i) => (
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
          )}
        </div>
        <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-amber-900">${item.price.toFixed(2)}</span>
          <div className="flex space-x-2">
            <Link 
              to={`/menu/${item._id}`}
              className="px-3 py-1 bg-amber-100 text-amber-900 rounded hover:bg-amber-200 transition-colors"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;