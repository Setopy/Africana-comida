import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ORDER_STATUS } from '../config/constants';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/orders/customer/${encodeURIComponent(localStorage.getItem('email') || '')}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post(`${API_URL}/api/orders/${orderId}/cancel`);
      
      // Update the order status in the state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. ' + (error.response?.data?.message || 'Please try again later.'));
    }
  };

  if (loading) {
    return (
      <div className="bg-amber-50 min-h-screen py-16 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Your Orders</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link 
              to="/menu" 
              className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
            >
              Browse Our Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = ORDER_STATUS[order.status] || {
                color: 'gray',
                text: order.status
              };
              
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <div className="flex items-center mb-2">
                          <h2 className="text-lg font-semibold text-amber-900 mr-3">
                            Order #{order._id.slice(-6)}
                          </h2>
                          <span 
                            className={`inline-block px-3 py-1 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800 text-sm font-medium`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <div className="mt-3 sm:mt-0">
                        <Link 
                          to={`/order-confirmation/${order._id}`}
                          className="text-amber-600 hover:text-amber-700 font-medium mr-4"
                        >
                          View Details
                        </Link>
                        
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <p className="font-medium mb-2">Order Summary:</p>
                    <ul className="space-y-1 mb-4">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-gray-600">
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between border-t border-gray-100 pt-3">
                      <p className="font-medium">Total:</p>
                      <p className="font-bold text-amber-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;