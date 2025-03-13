import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/constants';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/reviews/admin`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${id}/approve`);
      
      // Update review status in the state
      setReviews(reviews.map(review => 
        review._id === id ? { ...review, approved: true } : review
      ));
      
      setMessage({ type: 'success', text: 'Review approved successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to approve review' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/reviews/${id}`);
      
      // Remove review from the state
      setReviews(reviews.filter(review => review._id !== id));
      
      setMessage({ type: 'success', text: 'Review deleted successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete review' 
      });
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'approved') return review.approved;
    if (filter === 'pending') return !review.approved;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Reviews</h1>

        {message.text && (
          <div className={`mt-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <label htmlFor="filter" className="sr-only">Filter reviews</label>
            <select
              id="filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
          
          <button
            onClick={fetchReviews}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <div key={review._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
                            <span className="font-medium text-amber-800">
                              {review.name.charAt(0).toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">{review.name}</h3>
                          <p className="text-sm text-gray-500">{review.email}</p>
                        </div>
                      </div>
                      <div>
                        {review.approved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      {/* Star Rating */}
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                      
                      {/* Review Comment */}
                      <p className="text-sm text-gray-800">{review.comment}</p>
                      
                      {/* Review Date */}
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* If review is for a specific menu item */}
                      {review.menuItem && (
                        <div className="mt-2 text-xs text-amber-600">
                          For: {review.menuItem.name || review.menuItem}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-4">
                      {!review.approved && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-red-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No reviews found matching your criteria.</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Show All Reviews
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;