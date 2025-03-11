import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, CATEGORIES, COUNTRIES } from '../config/constants';
import MenuCard from '../components/menu/MenuCard';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCountry, setActiveCountry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/api/menu`;
        const params = new URLSearchParams();
        
        if (activeCategory !== 'all') {
          params.append('category', activeCategory);
        }
        
        if (activeCountry !== 'all') {
          params.append('country', activeCountry);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const res = await axios.get(url);
        setMenuItems(res.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory, activeCountry]);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our diverse selection of authentic African dishes, crafted with 
            traditional recipes and fresh ingredients.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-amber-900 mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full ${
                activeCategory === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-800 hover:bg-amber-100'
              }`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-amber-800 hover:bg-amber-100'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Country Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-amber-900 mb-3">Countries</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full ${
                activeCountry === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-800 hover:bg-amber-100'
              }`}
              onClick={() => setActiveCountry('all')}
            >
              All Countries
            </button>
            {COUNTRIES.map((country) => (
              <button
                key={country.id}
                className={`px-4 py-2 rounded-full ${
                  activeCountry === country.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-amber-800 hover:bg-amber-100'
                }`}
                onClick={() => setActiveCountry(country.id)}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">No dishes found matching your criteria.</p>
            <button
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              onClick={() => {
                setActiveCategory('all');
                setActiveCountry('all');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;