import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/analytics.php`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Format change percentage for display
  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  // Get color based on change value
  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'cancelled': 'bg-red-100 text-red-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-light dark:text-text-dark">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p className="font-body">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const stats = [
    { 
      label: 'Total Revenue', 
      value: analytics.total_revenue_formatted, 
      icon: 'payments', 
      change: formatChange(analytics.revenue_change), 
      color: getChangeColor(analytics.revenue_change) 
    },
    { 
      label: 'Total Orders', 
      value: analytics.total_orders.toString(), 
      icon: 'shopping_bag', 
      change: formatChange(analytics.orders_change), 
      color: getChangeColor(analytics.orders_change) 
    },
    { 
      label: 'Total Customers', 
      value: analytics.total_customers.toString(), 
      icon: 'group', 
      change: formatChange(analytics.customers_change), 
      color: getChangeColor(analytics.customers_change) 
    },
    { 
      label: 'Avg Order Value', 
      value: analytics.avg_order_value_formatted, 
      icon: 'trending_up', 
      change: 'Last 30 days', 
      color: 'text-blue-600' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-secondary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary dark:text-secondary text-2xl">{stat.icon}</span>
              </div>
              <span className={`text-sm font-body font-semibold ${stat.color}`}>{stat.change}</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-text-light dark:text-text-dark mb-1">{stat.value}</h3>
            <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-primary dark:text-secondary">Recent Orders</h3>
          <button 
            onClick={fetchAnalytics}
            className="text-sm text-primary dark:text-secondary hover:underline font-body"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-3">
          {analytics.recent_orders && analytics.recent_orders.length > 0 ? (
            analytics.recent_orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-primary/5 dark:bg-secondary/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-body font-semibold text-text-light dark:text-text-dark">
                    Order #{order.razorpay_order_id || order.id}
                  </p>
                  <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                    {order.customer_name} - {order.amount_formatted}
                  </p>
                  <p className="text-xs text-text-light/40 dark:text-text-dark/40 mt-1">
                    {order.created_at_formatted}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold whitespace-nowrap ml-4 ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-light/60 dark:text-text-dark/60">
              No recent orders found
            </div>
          )}
        </div>
      </div>

      {/* Orders by Status */}
      {analytics.orders_by_status && analytics.orders_by_status.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-display font-bold text-primary dark:text-secondary mb-4">Orders by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {analytics.orders_by_status.map((statusData, index) => (
              <div key={index} className="text-center p-4 bg-primary/5 dark:bg-secondary/5 rounded-lg">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-body font-semibold mb-2 ${getStatusColor(statusData.status)}`}>
                  {statusData.status.charAt(0).toUpperCase() + statusData.status.slice(1)}
                </div>
                <p className="text-2xl font-display font-bold text-text-light dark:text-text-dark">
                  {statusData.count}
                </p>
                <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body">
                  ₹{Number(statusData.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
