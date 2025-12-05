import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    tracking_number: '',
    delivery_notes: ''
  });

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/admin-orders.php`);
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status || 'created',
      tracking_number: order.tracking_number || '',
      delivery_notes: order.delivery_notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/admin-orders.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedOrder.id,
          ...updateData
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Order updated successfully!');
        setShowUpdateModal(false);
        fetchOrders();
      } else {
        alert('Failed to update order: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  const statusColors = {
    created: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
          Orders Management
        </h2>
        <button
          onClick={fetchOrders}
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
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Order ID</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Customer</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Date</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Items</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Total</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Status</th>
              <th className="px-3 py-2 text-right text-xs font-body font-bold text-primary dark:text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-text-light/60 dark:text-text-dark/60">
                  No orders found
                </td>
              </tr>
            ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-primary/5 dark:hover:bg-secondary/5">
                <td className="px-3 py-2 font-body text-xs font-semibold text-text-light dark:text-text-dark">{order.razorpay_order_id}</td>
                <td className="px-3 py-2">
                  <div className="font-body text-xs font-semibold text-text-light dark:text-text-dark">{order.customer_name}</div>
                  <div className="text-[10px] text-text-light/60 dark:text-text-dark/60">{order.customer_email}</div>
                  <div className="text-[10px] text-text-light/60 dark:text-text-dark/60">{order.customer_phone}</div>
                </td>
                <td className="px-3 py-2 font-body text-[10px] text-text-light dark:text-text-dark">{order.created_at_formatted}</td>
                <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{order.items_count}</td>
                <td className="px-3 py-2 font-body text-xs font-semibold text-text-light dark:text-text-dark">{order.amount_formatted}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-primary dark:text-secondary hover:text-primary/70 dark:hover:text-secondary/70"
                    title="View Details"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    title="Update Status"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && !showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-primary/10 dark:bg-secondary/10 border-b border-primary/20 dark:border-secondary/20 p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Order Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">Order Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-light/60 dark:text-text-dark/60">Order ID:</span>
                    <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.razorpay_order_id}</span>
                  </div>
                  <div>
                    <span className="text-text-light/60 dark:text-text-dark/60">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-light/60 dark:text-text-dark/60">Date:</span>
                    <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.created_at_formatted}</span>
                  </div>
                  <div>
                    <span className="text-text-light/60 dark:text-text-dark/60">Total:</span>
                    <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.amount_formatted}</span>
                  </div>
                  {selectedOrder.tracking_number && (
                    <div className="col-span-2">
                      <span className="text-text-light/60 dark:text-text-dark/60">Tracking Number:</span>
                      <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.tracking_number}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shiprocket Shipment Info */}
              {(selectedOrder.shiprocket_shipment_id || selectedOrder.shiprocket_awb_code) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark flex items-center">
                    <span className="material-symbols-outlined mr-2">local_shipping</span>
                    Shiprocket Shipment
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedOrder.shiprocket_shipment_id && (
                      <div>
                        <span className="text-text-light/60 dark:text-text-dark/60">Shipment ID:</span>
                        <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.shiprocket_shipment_id}</span>
                      </div>
                    )}
                    {selectedOrder.shiprocket_awb_code && (
                      <div>
                        <span className="text-text-light/60 dark:text-text-dark/60">AWB Code:</span>
                        <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.shiprocket_awb_code}</span>
                      </div>
                    )}
                    {selectedOrder.shiprocket_courier_name && (
                      <div>
                        <span className="text-text-light/60 dark:text-text-dark/60">Courier:</span>
                        <span className="ml-2 font-semibold text-text-light dark:text-text-dark">{selectedOrder.shiprocket_courier_name}</span>
                      </div>
                    )}
                    {selectedOrder.shiprocket_status && (
                      <div>
                        <span className="text-text-light/60 dark:text-text-dark/60">Shipment Status:</span>
                        <span className="ml-2 font-semibold text-text-light dark:text-text-dark capitalize">{selectedOrder.shiprocket_status.replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>
                  {selectedOrder.shiprocket_awb_code && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                      <a 
                        href={`https://seashell-yak-534067.hostingersite.com/track-order?id=${selectedOrder.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                      >
                        <span className="material-symbols-outlined text-sm mr-1">open_in_new</span>
                        View Live Tracking
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">Customer Information</h3>
                <div className="text-sm space-y-1">
                  <p className="text-text-light dark:text-text-dark"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p className="text-text-light dark:text-text-dark"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p className="text-text-light dark:text-text-dark"><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">Shipping Address</h3>
                  <div className="text-sm text-text-light dark:text-text-dark space-y-1">
                    <p>{selectedOrder.shipping_address.streetAddress}</p>
                    <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              {selectedOrder.cart_items && selectedOrder.cart_items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.cart_items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <img 
                          src={
                            item.image || 
                            item.thumbnail || 
                            (item.images && item.images.length > 0 ? item.images.find(img => img.is_primary)?.url || item.images[0].url : null) ||
                            '/images/products/placeholder.jpg'
                          } 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/products/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-text-light dark:text-text-dark">{item.name}</p>
                          <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                            Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <p className="font-semibold text-text-light dark:text-text-dark">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedOrder.special_instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">Special Instructions</h3>
                  <p className="text-sm text-text-light dark:text-text-dark">{selectedOrder.special_instructions}</p>
                </div>
              )}

              {/* Delivery Notes */}
              {selectedOrder.delivery_notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">Delivery Notes</h3>
                  <p className="text-sm text-text-light dark:text-text-dark">{selectedOrder.delivery_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Order Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-primary/10 dark:bg-secondary/10 border-b border-primary/20 dark:border-secondary/20 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                  Update Order Status
                </h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                  Order Status *
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  required
                >
                  <option value="created">Created</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={updateData.tracking_number}
                  onChange={(e) => setUpdateData({ ...updateData, tracking_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                  Delivery Notes
                </label>
                <textarea
                  value={updateData.delivery_notes}
                  onChange={(e) => setUpdateData({ ...updateData, delivery_notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  placeholder="Add any delivery notes"
                  rows="3"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-text-light dark:text-text-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary dark:bg-secondary text-white rounded-lg hover:opacity-90"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
