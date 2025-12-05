import React, { useState, useEffect } from 'react';
import { offerBannerService } from '../../services/offerBannerService';

const OfferBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    type: 'percentage',
    title: '',
    discount_value: '',
    coupon_code: '',
    min_order_amount: '',
    bg_color: '#D4AF37',
    text_color: '#FFFFFF',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await offerBannerService.getAllBanners();
      if (response.success) {
        setBanners(response.data);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setFormData({
      type: 'percentage',
      title: '',
      discount_value: '',
      coupon_code: '',
      min_order_amount: '',
      bg_color: '#D4AF37',
      text_color: '#FFFFFF',
      is_active: true,
      start_date: '',
      end_date: ''
    });
    setShowModal(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type,
      title: banner.title,
      discount_value: banner.discount_value,
      coupon_code: banner.coupon_code || '',
      min_order_amount: banner.min_order_amount || '',
      bg_color: banner.bg_color,
      text_color: banner.text_color,
      is_active: banner.is_active === 1 || banner.is_active === true,
      start_date: banner.start_date ? banner.start_date.split(' ')[0] : '',
      end_date: banner.end_date ? banner.end_date.split(' ')[0] : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        is_active: formData.is_active ? 1 : 0,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      if (editingBanner) {
        submitData.id = editingBanner.id;
        const response = await offerBannerService.updateBanner(submitData);
        if (response.success) {
          await loadBanners();
          setShowModal(false);
        }
      } else {
        const response = await offerBannerService.createBanner(submitData);
        if (response.success) {
          await loadBanners();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const response = await offerBannerService.deleteBanner(id);
        if (response.success) {
          await loadBanners();
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Failed to delete banner');
      }
    }
  };

  const toggleActive = async (banner) => {
    try {
      const response = await offerBannerService.updateBanner({
        ...banner,
        is_active: banner.is_active === 1 ? 0 : 1
      });
      if (response.success) {
        await loadBanners();
      }
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading banners...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Offer Banners</h2>
        <button
          onClick={handleAddNew}
          className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B89530] transition-colors"
        >
          Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No banners created yet</p>
          <button
            onClick={handleAddNew}
            className="text-[#D4AF37] hover:underline"
          >
            Create your first banner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                  Title
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Discount
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Min Order
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Coupon Code
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Colors
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Active
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[10px] font-body rounded ${
                      banner.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {banner.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs font-body text-gray-900">
                    {banner.title}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-body text-gray-900">
                    {banner.type === 'percentage' ? `${banner.discount_value}%` : `₹${banner.discount_value}`}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-body text-gray-900">
                    {banner.min_order_amount > 0 ? `₹${banner.min_order_amount}` : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-body text-gray-900">
                    {banner.coupon_code || '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-2 items-center">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: banner.bg_color }}
                        title={`Background: ${banner.bg_color}`}
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: banner.text_color }}
                        title={`Text: ${banner.text_color}`}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        banner.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          banner.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-body font-medium">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-[#D4AF37] hover:text-[#B89530] mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} id="offer-banner-form">
              {/* Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="percentage"
                      checked={formData.type === 'percentage'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Percentage Off
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="coupon"
                      checked={formData.type === 'coupon'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Coupon Code
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g., Summer Sale - 20% Off!"
                />
              </div>

              {/* Discount Value */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)'}
                </label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step={formData.type === 'percentage' ? '1' : '0.01'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                />
              </div>

              {/* Minimum Order Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount (₹) - Optional
                </label>
                <input
                  type="number"
                  name="min_order_amount"
                  value={formData.min_order_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g., 500 (Leave empty for no minimum)"
                />
                <p className="text-xs text-gray-500 mt-1">Offer will apply only if order total is above this amount</p>
              </div>

              {/* Coupon Code (for both percentage and coupon type) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="coupon_code"
                  value={formData.coupon_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g., SAVE50 or SUMMER20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'percentage' 
                    ? 'Users will need to enter this code to get the percentage discount' 
                    : 'Users will need to enter this code to get the discount'}
                </p>
              </div>

              {/* Colors */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="bg_color"
                      value={formData.bg_color}
                      onChange={handleInputChange}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.bg_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, bg_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="#D4AF37"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="text_color"
                      value={formData.text_color}
                      onChange={handleInputChange}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.text_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </form>
            </div>

            {/* Buttons */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="offer-banner-form"
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B89530]"
              >
                {editingBanner ? 'Update' : 'Create'} Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferBanner;
