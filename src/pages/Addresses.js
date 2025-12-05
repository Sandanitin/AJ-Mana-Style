import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/addresses.php?email=${encodeURIComponent(user.email)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAddresses(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again later.');
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

    fetchAddresses();
  }, [user.email, navigate, fetchAddresses]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    });
    setEditingAddress(null);
  };

  const handleAddAddress = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditAddress = (address) => {
    setFormData({
      firstName: address.first_name,
      lastName: address.last_name,
      phone: address.phone,
      streetAddress: address.street_address,
      city: address.city,
      state: address.state,
      zipCode: address.zip_code,
      isDefault: address.is_default === 1
    });
    setEditingAddress(address);
    setShowAddModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const response = await fetch(`${apiUrl}/addresses.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: addressId,
          email: user.email
        })
      });

      const result = await response.json();

      if (result.success) {
        fetchAddresses();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
      const method = editingAddress ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        email: user.email
      };

      if (editingAddress) {
        payload.id = editingAddress.id;
      }

      const response = await fetch(`${apiUrl}/addresses.php`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setShowAddModal(false);
        resetForm();
        fetchAddresses();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary mx-auto mb-4"></div>
          <p className="text-text-light/60 dark:text-text-dark/60">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">My Addresses</h1>
            <p className="text-text-light/60 dark:text-text-dark/60">
              Manage your delivery addresses
            </p>
          </div>
          <button
            onClick={handleAddAddress}
            className="bg-primary dark:bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-secondary-dark transition-colors flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Add Address</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <span className="material-icons text-6xl text-text-light/30 dark:text-text-dark/30">location_on</span>
            </div>
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">No saved addresses</h3>
            <p className="text-text-light/60 dark:text-text-dark/60 mb-6">
              Add an address for faster checkout
            </p>
            <button
              onClick={handleAddAddress}
              className="bg-primary dark:bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-secondary-dark transition-colors"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 ${
                  address.is_default === 1
                    ? 'border-primary dark:border-secondary'
                    : 'border-gray-200 dark:border-gray-700'
                } p-4 relative`}
              >
                {address.is_default === 1 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-primary dark:bg-secondary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  </div>
                )}

                <div className="mb-3">
                  <h3 className="text-sm font-bold text-text-light dark:text-text-dark font-body">
                    {address.first_name} {address.last_name}
                  </h3>
                  <p className="text-[10px] text-text-light/60 dark:text-text-dark/60 mt-0.5 font-body">
                    {address.phone}
                  </p>
                </div>

                <div className="text-text-light/80 dark:text-text-dark/80 space-y-0.5 mb-4 font-body">
                  <p className="text-xs">{address.street_address}</p>
                  <p className="text-xs">{address.city}, {address.state} {address.zip_code}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="flex-1 px-3 py-1.5 border border-primary/30 dark:border-secondary/30 text-primary dark:text-secondary rounded-lg hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors font-semibold flex items-center justify-center space-x-1 text-xs font-body"
                  >
                    <span className="material-icons text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="flex-1 px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold flex items-center justify-center space-x-1 text-xs font-body"
                  >
                    <span className="material-icons text-sm">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Address Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-br from-primary/10 to-transparent dark:from-secondary/10 dark:to-transparent border-b border-primary/20 dark:border-secondary/20 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark"
                  >
                    <span className="material-icons">close</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                    Street Address *
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-2 border border-primary/30 dark:border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-primary dark:text-secondary border-gray-300 rounded focus:ring-primary dark:focus:ring-secondary"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-text-light dark:text-text-dark">
                    Set as default address
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary dark:bg-secondary text-white rounded-lg hover:bg-primary-dark dark:hover:bg-secondary-dark transition-colors font-semibold"
                  >
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;