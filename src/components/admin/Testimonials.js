import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    comment: '',
    rating: 5,
    featured: false
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials.php`);
      const result = await response.json();
      if (result.success) {
        setTestimonials(result.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = `${API_BASE_URL}/testimonials.php`;
      const method = editingTestimonial ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        id: editingTestimonial?.id
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchTestimonials();
        setIsModalOpen(false);
        setEditingTestimonial(null);
        setFormData({
          name: '',
          location: '',
          comment: '',
          rating: 5,
          featured: false
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location || '',
      comment: testimonial.comment,
      rating: testimonial.rating,
      featured: Boolean(testimonial.featured)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchTestimonials();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display font-bold text-primary dark:text-secondary">Customer Testimonials</h2>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            setFormData({ name: '', location: '', comment: '', rating: 5, featured: false });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary dark:bg-secondary text-white dark:text-primary px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-body font-semibold"
        >
          <span className="material-symbols-outlined">add</span>
          Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-text-light/60 dark:text-text-dark/60">
          <span className="material-symbols-outlined text-6xl mb-4 block text-gray-300">format_quote</span>
          <p className="font-body">No testimonials added yet. Click "Add Testimonial" to showcase customer feedback.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 relative">
              {testimonial.featured && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-body px-2 py-0.5 rounded font-semibold">
                  Featured
                </span>
              )}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => {
                  const rating = parseInt(testimonial.rating);
                  const effectiveRating = !rating || rating === 0 ? 5 : rating;
                  return (
                    <span key={i} className={`material-symbols-outlined text-sm ${i < effectiveRating ? 'text-yellow-500' : 'text-gray-300'}`} style={{fontVariationSettings: '"FILL" 1'}}>
                      star
                    </span>
                  );
                })}
              </div>
              <p className="font-body text-xs italic text-text-light dark:text-text-dark mb-4">"{testimonial.comment}"</p>
              <div className="font-display text-xs font-bold text-primary dark:text-secondary">
                {testimonial.name}
                {testimonial.location && <span className="text-[10px] font-body font-normal text-gray-500 block">{testimonial.location}</span>}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-body"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-body"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-2xl font-display font-bold text-primary dark:text-secondary">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-text-light dark:text-text-dark">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-text-light dark:text-text-dark">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Mumbai, India"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-text-light dark:text-text-dark">
                    Testimonial *
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-text-light dark:text-text-dark">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-text-light dark:text-text-dark">
                    Featured on Homepage
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-4 flex-shrink-0">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary dark:bg-secondary text-white dark:text-primary px-6 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors font-semibold"
              >
                {editingTestimonial ? 'Update' : 'Add'} Testimonial
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTestimonial(null);
                  setFormData({ name: '', location: '', comment: '', rating: 5, featured: false });
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
