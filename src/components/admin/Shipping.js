import React, { useState, useEffect } from 'react';
import { shippingService } from '../../services/shippingService';

const Shipping = () => {
  const [shippingZones, setShippingZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({
    zone_name: '',
    pincodes: '',
    charge: '',
    free_above: '',
    delivery_time: ''
  });

  useEffect(() => {
    loadShippingZones();
  }, []);

  const loadShippingZones = async () => {
    try {
      setLoading(true);
      const response = await shippingService.getAllZones();
      if (response.success) {
        setShippingZones(response.data);
      } else {
        console.error('Failed to load shipping zones:', response.message);
        alert('Failed to load shipping zones: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading shipping zones:', error);
      alert('Error loading shipping zones. Please check if the backend API is running and the database is set up correctly.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNew = () => {
    setEditingZone(null);
    setFormData({
      zone_name: '',
      pincodes: '',
      charge: '',
      free_above: '',
      delivery_time: ''
    });
    setShowModal(true);
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      zone_name: zone.zone_name,
      pincodes: zone.pincodes,
      charge: zone.charge,
      free_above: zone.free_above,
      delivery_time: zone.delivery_time
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingZone) {
        // Update existing zone
        const response = await shippingService.updateZone({
          id: editingZone.id,
          ...formData
        });
        if (response.success) {
          await loadShippingZones();
          setShowModal(false);
        }
      } else {
        // Create new zone
        const response = await shippingService.createZone(formData);
        if (response.success) {
          await loadShippingZones();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving shipping zone:', error);
      alert('Failed to save shipping zone');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipping zone?')) {
      try {
        const response = await shippingService.deleteZone(id);
        if (response.success) {
          await loadShippingZones();
        }
      } catch (error) {
        console.error('Error deleting shipping zone:', error);
        alert('Failed to delete shipping zone');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading shipping zones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary dark:text-secondary">Delivery Zones & Charges</h2>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 mt-1">Click Edit to modify delivery settings</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-body font-semibold"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Zone
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Zone</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pincodes</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Charge</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Free Above</th>
              <th className="px-3 py-2 text-left text-xs font-body font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-3 py-2 text-right text-xs font-body font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {shippingZones.map((zone) => (
              <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 py-2 font-body text-xs font-semibold text-text-light dark:text-text-dark">{zone.zone_name}</td>
                <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{zone.pincodes}</td>
                <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">₹{zone.charge}</td>
                <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">₹{zone.free_above}</td>
                <td className="px-3 py-2 font-body text-[10px] text-text-light dark:text-text-dark">{zone.delivery_time}</td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button 
                    onClick={() => handleEdit(zone)}
                    className="inline-flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(zone.id)}
                    className="inline-flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-primary dark:text-secondary">
                  {editingZone ? 'Edit Shipping Zone' : 'Add New Shipping Zone'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-4" id="shipping-form">
                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    name="zone_name"
                    value={formData.zone_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Local, Regional, National"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Pincodes *
                  </label>
                  <input
                    type="text"
                    name="pincodes"
                    value={formData.pincodes}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500001-500099 or All India"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use ranges (e.g., 500001-500099) or "All India" for nationwide shipping
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                      Shipping Charge (₹) *
                    </label>
                    <input
                      type="number"
                      name="charge"
                      value={formData.charge}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="50"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                      Free Above (₹) *
                    </label>
                    <input
                      type="number"
                      name="free_above"
                      value={formData.free_above}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="500"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                    Delivery Time *
                  </label>
                  <input
                    type="text"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1-2 days"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shipping-form"
                className="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-primary rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-body font-semibold"
              >
                {editingZone ? 'Update Zone' : 'Add Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
