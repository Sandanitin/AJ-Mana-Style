import React, { useState, useEffect } from 'react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  useEffect(() => {
    fetchCustomers();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchCustomers, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCustomers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/customers.php`);
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerEmail) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/get-orders.php?email=${encodeURIComponent(customerEmail)}`);
      const result = await response.json();
      
      if (result.success) {
        setCustomerOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.customer_email);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Customer Management
          </h2>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 mt-1">
            Total Customers: {customers.length}
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="px-4 py-2 bg-primary dark:bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/10 dark:bg-secondary/10">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Customer</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Contact</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Orders</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Total Spent</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Last Order</th>
              <th className="px-3 py-2 text-right text-xs font-body font-bold text-primary dark:text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-text-light/60 dark:text-text-dark/60">
                  No customers found
                </td>
              </tr>
            ) : (
            customers.map((customer, index) => (
              <tr key={index} className="hover:bg-primary/5 dark:hover:bg-secondary/5">
                <td className="px-3 py-2 font-body text-xs font-semibold text-text-light dark:text-text-dark">
                  {customer.customer_name}
                </td>
                <td className="px-3 py-2">
                  <div className="text-xs text-text-light dark:text-text-dark">{customer.customer_email}</div>
                  <div className="text-[10px] text-text-light/60 dark:text-text-dark/60">{customer.customer_phone}</div>
                </td>
                <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">
                  {customer.total_orders}
                </td>
                <td className="px-3 py-2 font-body text-xs font-semibold text-text-light dark:text-text-dark">
                  {customer.total_spent_formatted}
                </td>
                <td className="px-3 py-2 font-body text-[10px] text-text-light dark:text-text-dark">
                  {customer.last_order_formatted}
                </td>
                <td className="px-3 py-2 text-right">
                  <button 
                    onClick={() => handleViewCustomer(customer)}
                    className="text-primary dark:text-secondary hover:text-primary/70 dark:hover:text-secondary/70"
                    title="View Customer Details"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => {
          setSelectedCustomer(null);
          setCustomerOrders([]);
        }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header - Fixed */}
            <div className="bg-primary/10 dark:bg-secondary/10 border-b border-primary/20 dark:border-secondary/20 p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                  Customer Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCustomerOrders([]);
                  }}
                  className="text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">Name</span>
                      <span className="font-semibold text-text-light dark:text-text-dark break-words">
                        {selectedCustomer.customer_name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">Email</span>
                      <span className="text-text-light dark:text-text-dark break-all">
                        {selectedCustomer.customer_email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">Phone</span>
                      <span className="text-text-light dark:text-text-dark">
                        {selectedCustomer.customer_phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">
                    Purchase Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">Total Orders</span>
                      <span className="font-semibold text-text-light dark:text-text-dark">
                        {selectedCustomer.total_orders}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">Total Spent</span>
                      <span className="font-semibold text-text-light dark:text-text-dark">
                        {selectedCustomer.total_spent_formatted}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">First Order</span>
                      <span className="text-text-light dark:text-text-dark">
                        {selectedCustomer.first_order_formatted}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-light/60 dark:text-text-dark/60 text-xs mb-1">Last Order</span>
                      <span className="text-text-light dark:text-text-dark">
                        {selectedCustomer.last_order_formatted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">
                  Order History
                </h3>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                    Loading orders...
                  </p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-text-light dark:text-text-dark">
                              {order.razorpay_order_id}
                            </p>
                            <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                              {order.created_at_formatted}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-text-light dark:text-text-dark">
                              {order.amount_formatted}
                            </p>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        {order.cart_items && order.cart_items.length > 0 && (
                          <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                            Items: {order.cart_items.map(item => item.name).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
