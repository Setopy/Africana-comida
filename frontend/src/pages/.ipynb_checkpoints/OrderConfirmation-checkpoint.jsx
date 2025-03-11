import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ORDER_STATUS } from '../config/constants';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Unable to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-amber-50 min-h-screen py-16 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-amber-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Order Error</h1>
            <p className="text-gray-600 mb-8">{error || 'Order not found'}</p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
            >
              Return to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS[order.status] || {
    color: 'gray',
    text: order.status
  };

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-amber-900">Order Confirmation</h1>
              <span 
                className={`inline-block px-3 py-1 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800 text-sm font-medium`}
              >
                {statusInfo.text}
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Thank you for your order! We've received your order and it's being processed.
            </p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">Order Details</h2>
            <p className="text-gray-600">Order ID: {order._id}</p>
            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
            {order.estimatedDelivery && (
              <p className="text-gray-600">
                Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleString()}
              </p>
            )}
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">Items</h2>
            {order.items.map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between pt-4 font-bold">
              <p>Total</p>
              <p>${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">Delivery Information</h2>
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.email}</p>
            <p className="text-gray-600">{order.customer.phone}</p>
            <p className="text-gray-600 mt-2">{order.customer.address}</p>
            {order.deliveryInstructions && (
              <div className="mt-2">
                <p className="font-medium">Delivery Instructions:</p>
                <p className="text-gray-600">{order.deliveryInstructions}</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="text-center">
              <Link 
                to="/menu" 
                className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700"
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

export default OrderConfirmation;