import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';
import MenuCard from '../components/menu/MenuCard';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/menu/featured`);
        setFeaturedItems(res.data);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800 opacity-90"></div>
        <div className="relative h-[70vh] flex items-center justify-center">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Experience Authentic African Cuisine in Tijuana
            </h1>
            <p className="text-xl text-amber-100 mb-8">
              A culinary journey across Africa's diverse flavors and traditions,
              bringing the continent's rich food heritage to your table.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/menu"
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg transition-colors"
              >
                Explore Our Menu
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-lg shadow-lg transition-colors"
              >
                Find Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900">Our Featured Dishes</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Discover our chef's selection of traditional African dishes, prepared with
              authentic recipes and the freshest ingredients.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Comida Africana was born from a passion to share the diverse and vibrant 
                flavors of African cuisine with the people of Tijuana. Our journey began 
                with a simple mission: to create an authentic dining experience that 
                celebrates Africa's rich culinary traditions.
              </p>
              <p className="text-gray-600 mb-6">
                Every dish at Comida Africana tells a story - of tradition, of family, 
                of culture. Our chefs combine time-honored recipes with locally-sourced 
                ingredients to bring the true taste of Africa to your plate.
              </p>
              <Link
                to="/about"
                className="text-amber-700 hover:text-amber-800 font-semibold"
              >
                Read more about our journey →
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/restaurant.jpg"
                alt="Comida Africana restaurant"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="mt-4 text-amber-200 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-amber-100 mb-4">
                "The jollof rice was absolutely delicious! It reminded me of my grandmother's cooking. 
                Authentic flavors and wonderful service."
              </p>
              <p className="font-semibold">- Maria Garcia</p>
            </div>

            <div className="bg-amber-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-amber-100 mb-4">
                "I never tried African food before, but this place has made me a fan! 
                The spices and flavors are amazing, and the staff is so friendly and helpful."
              </p>
              <p className="font-semibold">- Carlos Rodriguez</p>
            </div>

            <div className="bg-amber-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-amber-100 mb-4">
                "The Ethiopian platter is perfect for sharing and trying different flavors. 
                Everything was so fresh and well-prepared. Can't wait to come back!"
              </p>
              <p className="font-semibold">- Ana Morales</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/reviews"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg transition-colors"
            >
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-100 rounded-lg shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">
              Ready to Experience African Cuisine?
            </h2>
            <p className="text-lg text-amber-800 mb-8 max-w-3xl mx-auto">
              Join us for a culinary journey across Africa. Whether you're dining in or taking out,
              we're ready to serve you authentic flavors that will transport you across the continent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/menu"
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow transition-colors"
              >
                Order Online
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-lg shadow transition-colors"
              >
                Make a Reservation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;