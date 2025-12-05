import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/get-orders.php?email=${encodeURIComponent(user.email)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    // Check if user is logged in
    if (!user.email) {
      navigate('/login');
      return;
    }

    fetchOrders();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [user.email, navigate, fetchOrders]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'processing':
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'pending':
      case 'created':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'created':
        return 'Order Created';
      case 'paid':
        return 'Payment Completed';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Payment Failed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary mx-auto mb-4"></div>
          <p className="text-text-light/60 dark:text-text-dark/60">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">My Orders</h1>
          <p className="text-text-light/60 dark:text-text-dark/60">
            View and track all your orders
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <span className="material-icons text-6xl text-text-light/30 dark:text-text-dark/30">shopping_bag</span>
            </div>
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">No orders yet</h3>
            <p className="text-text-light/60 dark:text-text-dark/60 mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary dark:bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-secondary-dark transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                      <div>
                        <p className="text-sm text-text-light/60 dark:text-text-dark/60">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-text-light dark:text-text-dark">
                          {order.razorpay_order_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-light/60 dark:text-text-dark/60">Date</p>
                        <p className="text-sm font-medium text-text-light dark:text-text-dark">
                          {order.created_at_formatted}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-light/60 dark:text-text-dark/60">Total</p>
                        <p className="text-lg font-bold text-text-light dark:text-text-dark">
                          {order.amount_formatted}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.cart_items && order.cart_items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.image || 
                              item.thumbnail || 
                              (item.images && item.images.length > 0 ? item.images.find(img => img.is_primary)?.url || item.images[0].url : null) ||
                              '/images/products/placeholder.jpg'
                            }
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/products/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-text-light dark:text-text-dark truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-text-light dark:text-text-dark">
                              ₹{item.price?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h5 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                        Shipping Address
                      </h5>
                      <div className="text-sm text-text-light/80 dark:text-text-dark/80">
                        <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                        <p>{order.shipping_address.streetAddress}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {order.special_instructions && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                        Special Instructions
                      </h5>
                      <p className="text-sm text-text-light/80 dark:text-text-dark/80">
                        {order.special_instructions}
                      </p>
                    </div>
                  )}

                  {/* Track Order Button */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/track/${order.id}`}
                      className="flex-1 bg-primary dark:bg-secondary text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">local_shipping</span>
                      Track Order
                    </Link>
                    {order.awb_code && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.awb_code);
                          alert('Tracking number copied!');
                        }}
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        title="Copy tracking number"
                      >
                        <span className="material-symbols-outlined text-xl">content_copy</span>
                        Copy AWB
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;