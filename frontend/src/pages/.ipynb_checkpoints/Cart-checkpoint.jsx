import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <div className="bg-amber-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0                   11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h1 className="mt-4 text-2xl font-bold text-amber-900">Your cart is empty</h1>
            <p className="mt-2 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-block px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
            >
              Explore Our Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Your Cart</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center py-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-medium text-amber-900">{item.name}</h2>
                  <p className="text-amber-700">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-500"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-2 w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-500"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    className="ml-4 p-1 text-red-400 hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-                            1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>or</p>
              <Link
                to="/menu"
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;