import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingInput, setTrackingInput] = useState(orderId || '');

  useEffect(() => {
    if (orderId) {
      fetchOrderTracking(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderTracking = async (id) => {
    try {
      setLoading(true);
      setError('');

      // Fetch tracking data from track-order API
      const trackingResponse = await fetch(
        `${API_BASE_URL}/track-order.php?order_id=${id}`
      );
      
      if (!trackingResponse.ok) {
        throw new Error('Failed to fetch tracking');
      }

      const trackingResult = await trackingResponse.json();

      if (trackingResult.error) {
        setError(trackingResult.error);
        setLoading(false);
        return;
      }

      // Set order and tracking data
      if (trackingResult.order) {
        setOrder(trackingResult.order);
      }

      if (trackingResult.tracking) {
        setTracking(trackingResult.tracking);
      } else if (trackingResult.message) {
        setError(trackingResult.message);
      }

      setLoading(false);
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to fetch tracking information');
      setLoading(false);
    }
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      navigate(`/track/${trackingInput.trim()}`);
      fetchOrderTracking(trackingInput.trim());
    }
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'check_circle',
      'processing': 'sync',
      'shipped': 'local_shipping',
      'out_for_delivery': 'delivery_dining',
      'delivered': 'done_all',
      'cancelled': 'cancel',
      'returned': 'keyboard_return'
    };
    return statusMap[status] || 'info';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'text-yellow-600',
      'confirmed': 'text-blue-600',
      'processing': 'text-purple-600',
      'shipped': 'text-indigo-600',
      'out_for_delivery': 'text-orange-600',
      'delivered': 'text-green-600',
      'cancelled': 'text-red-600',
      'returned': 'text-gray-600'
    };
    return colorMap[status] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary dark:border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your order ID to track your shipment
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrackOrder} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD-12345)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="bg-primary dark:bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined">search</span>
              Track
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-primary dark:bg-secondary text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Order #{order.id}</h2>
                  <p className="text-white/80">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/20`}>
                  <span className="material-symbols-outlined text-white">{getStatusIcon(order.order_status || 'pending')}</span>
                  <span className="font-semibold text-white capitalize">{(order.order_status || 'pending').replace('_', ' ')}</span>
                </div>
              </div>

              {order.awb_code && (
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/80 text-sm mb-1">Tracking Number (AWB)</p>
                  <p className="text-xl font-mono font-bold">{order.awb_code}</p>
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            {tracking && tracking.shipment_track && tracking.shipment_track.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">timeline</span>
                  Shipment Status
                </h3>
                <div className="space-y-4">
                  {tracking.shipment_track.map((shipment, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary dark:text-secondary">local_shipping</span>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{shipment.current_status}</p>
                      </div>
                      {shipment.destination && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Destination: {shipment.destination}</p>
                      )}
                      {shipment.courier_name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Courier: {shipment.courier_name}</p>
                      )}
                      {shipment.edd && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expected Delivery: {formatDate(shipment.edd)}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {tracking.shipment_track_activities && tracking.shipment_track_activities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Tracking Activities</h4>
                    <div className="space-y-3">
                      {tracking.shipment_track_activities.map((activity, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-primary dark:bg-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                              <span className="material-symbols-outlined text-sm text-white">check</span>
                            </div>
                            {index < tracking.shipment_track_activities.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-300 dark:bg-gray-600 my-1"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-sm text-gray-900 dark:text-gray-100">{activity.activity}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.location}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Details */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customer Name</p>
                  <p className="font-semibold">{order.customer_name}</p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                    <p className="font-semibold">{order.customer_phone}</p>
                  </div>
                )}
                {order.customer_email && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <p className="font-semibold">{order.customer_email}</p>
                  </div>
                )}
                {order.amount && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Total</p>
                    <p className="font-semibold text-lg text-primary dark:text-secondary">
                      ₹{parseFloat(order.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Courier Info */}
            {tracking && tracking.shipment_track && tracking.shipment_track.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-lg font-bold mb-4">Courier Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tracking.shipment_track[0].courier_name && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Courier Partner</p>
                      <p className="font-semibold">{tracking.shipment_track[0].courier_name}</p>
                    </div>
                  )}
                  {tracking.shipment_track[0].awb_code && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AWB Code</p>
                      <p className="font-semibold font-mono">{tracking.shipment_track[0].awb_code}</p>
                    </div>
                  )}
                  {tracking.shipment_track[0].current_status && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Status</p>
                      <p className="font-semibold">{tracking.shipment_track[0].current_status}</p>
                    </div>
                  )}
                </div>
                {tracking.track_url && (
                  <div className="mt-4">
                    <a 
                      href={tracking.track_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary dark:text-secondary hover:underline"
                    >
                      <span className="material-symbols-outlined">open_in_new</span>
                      Track on Shiprocket
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Need help with your order?</p>
          <button
            onClick={() => navigate('/contact')}
            className="text-primary dark:text-secondary font-semibold hover:underline"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
