import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

const ShiprocketManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders.php`);
      const result = await response.json();
      if (result.success) {
        // Filter orders without shipment
        const unshippedOrders = result.data.filter(order => !order.shipment_id);
        setOrders(unshippedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (order) => {
    setProcessing(order.id);
    setMessage('');

    try {
      // Prepare order data for Shiprocket
      const shipmentData = {
        order_id: order.id,
        created_at: order.created_at,
        customer_name: order.customer_name || order.shipping_name,
        address: order.shipping_address,
        city: order.shipping_city,
        pincode: order.shipping_pincode,
        state: order.shipping_state,
        email: order.customer_email || 'customer@vastranilooms.com',
        phone: order.shipping_phone,
        items: JSON.parse(order.items || '[]').map(item => ({
          product_id: item.id,
          name: item.name,
          sku: `SKU-${item.id}`,
          quantity: item.quantity,
          price: item.price
        })),
        payment_method: order.payment_method,
        subtotal: parseFloat(order.total_amount),
        shipping_charges: parseFloat(order.shipping_cost || 0),
        discount: 0
      };

      const response = await fetch(`${API_BASE_URL}/shiprocket.php?action=create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipmentData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✅ Shipment created successfully! Order ID: ${result.data.order_id}, Shipment ID: ${result.data.shipment_id}`);
        fetchOrders(); // Refresh list
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error creating shipment: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const calculateShipping = async (pincode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shiprocket.php?action=calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_pincode: pincode,
          weight: 0.5,
          cod: false
        })
      });

      const result = await response.json();
      if (result.success) {
        return `₹${result.shipping_charge}`;
      }
      return 'N/A';
    } catch (error) {
      return 'Error';
    }
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-6">
        Shiprocket Management
      </h1>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Delivery Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No orders pending shipment
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>{order.customer_name || order.shipping_name}</div>
                      <div className="text-xs text-gray-500">{order.shipping_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{order.shipping_address}</div>
                      <div className="text-xs text-gray-500">
                        {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ₹{parseFloat(order.total_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded ${order.payment_method === 'cod' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {order.payment_method?.toUpperCase() || 'COD'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => createShipment(order)}
                        disabled={processing === order.id}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === order.id ? 'Creating...' : 'Create Shipment'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">📋 Order Flow:</h2>
        <ol className="space-y-2 text-sm">
          <li><strong>1. Create Shipment</strong> - Click button to send order to Shiprocket</li>
          <li><strong>2. Check Shiprocket Dashboard</strong> - Order will appear in Shiprocket</li>
          <li><strong>3. Select Courier</strong> - Choose courier in Shiprocket panel</li>
          <li><strong>4. Generate AWB & Label</strong> - Get tracking number and print label</li>
          <li><strong>5. Schedule Pickup</strong> - Request courier pickup</li>
          <li><strong>6. Track Order</strong> - Customer can track via website</li>
        </ol>
      </div>
    </div>
  );
};

export default ShiprocketManagement;
