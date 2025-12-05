import React, { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, reviews, avgRating, reviewCount, productId, onReviewSubmitted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 5,
    comment: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://seashell-yak-534067.hostingersite.com/backend/api/reviews.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          reviewer_name: formData.reviewer_name,
          rating: formData.rating,
          comment: formData.comment
        })
      });

      if (!response.ok) {
        setError('Review system is not available yet. Please contact the administrator.');
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Review submitted successfully!');
        setFormData({ reviewer_name: '', rating: 5, comment: '' });
        setShowForm(false);
        
        // Call callback to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Review system is not available yet. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`material-symbols-outlined text-2xl ${
            i <= rating ? 'text-yellow-500' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(i)}
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          star
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background-light dark:bg-background-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background-light dark:bg-background-dark border-b border-secondary/20 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary dark:text-secondary">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(avgRating))}
              </div>
              <span className="text-lg font-medium text-text-light dark:text-text-dark">
                {avgRating > 0 ? avgRating.toFixed(1) : 'No ratings yet'}
              </span>
              <span className="text-text-light/60 dark:text-text-dark/60">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-light dark:text-text-dark hover:text-secondary p-2"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Write Review Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mb-6 py-3 px-6 bg-primary dark:bg-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              {reviewCount === 0 ? 'Submit Review' : 'Write a Review'}
            </button>
          )}

          {/* Review Form */}
          {showForm && (
            <div className="mb-6 p-6 border border-secondary/20 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-primary dark:text-secondary">
                  Write Your Review
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="reviewer_name"
                    value={formData.reviewer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {renderStars(formData.rating, true, (rating) => setFormData(prev => ({ ...prev, rating })))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Your Review *
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-primary dark:bg-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="px-6 py-3 border border-secondary/20 rounded-lg text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviewCount === 0 && !showForm ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-text-light/30 dark:text-text-dark/30 mb-4">
                rate_review
              </span>
              <p className="text-lg text-text-light/60 dark:text-text-dark/60">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-primary dark:text-secondary mb-4">
                All Reviews ({reviewCount})
              </h3>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 border border-secondary/20 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-text-light dark:text-text-dark">
                        {review.reviewer_name}
                      </h4>
                      <p className="text-sm text-text-light/60 dark:text-text-dark/60">
                        {review.created_at}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-text-light dark:text-text-dark leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
