// Centralized data store for categories and collections
// Now connected to backend API for persistent storage

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

// State management
let categories = [];
let collections = [];
const listeners = [];
let initialized = false;

// Initialize data from API
const initializeData = async () => {
  if (initialized) return;
  
  try {
    const [categoriesRes, collectionsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/categories.php`),
      fetch(`${API_BASE_URL}/collections.php`)
    ]);
    
    const categoriesData = await categoriesRes.json();
    const collectionsData = await collectionsRes.json();
    
    if (categoriesData.success) {
      categories = categoriesData.data;
    }
    
    if (collectionsData.success) {
      collections = collectionsData.data;
    }
    
    initialized = true;
    dataStore.notifyListeners();
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
};

// Call initialize on module load
initializeData();

export const dataStore = {
  // Get all categories
  getCategories: () => categories.filter(c => c.enabled),
  
  // Get all collections
  getCollections: () => collections.filter(c => c.enabled),
  
  // Get all categories (including disabled for admin)
  getAllCategories: () => categories,
  
  // Get all collections (including disabled for admin)
  getAllCollections: () => collections,
  
  // Add category
  addCategory: async (name, imageUrl = null) => {
    try {
      const body = { name, enabled: true };
      if (imageUrl) {
        body.image_url = imageUrl;
      }
      
      const response = await fetch(`${API_BASE_URL}/categories.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      
      if (result.success) {
        categories = [...categories, result.data];
        dataStore.notifyListeners();
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },
  
  // Update category
  updateCategory: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      const result = await response.json();
      
      if (result.success) {
        categories = categories.map(c => c.id === id ? result.data : c);
        dataStore.notifyListeners();
      } else {
        throw new Error(result.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories.php?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        categories = categories.filter(c => c.id !== id);
        dataStore.notifyListeners();
      } else {
        throw new Error(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
  
  // Add collection
  addCollection: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, enabled: true })
      });
      
      const result = await response.json();
      
      if (result.success) {
        collections = [...collections, result.data];
        dataStore.notifyListeners();
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to add collection');
      }
    } catch (error) {
      console.error('Error adding collection:', error);
      throw error;
    }
  },
  
  // Update collection
  updateCollection: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      const result = await response.json();
      
      if (result.success) {
        collections = collections.map(c => c.id === id ? result.data : c);
        dataStore.notifyListeners();
      } else {
        throw new Error(result.message || 'Failed to update collection');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },
  
  // Delete collection
  deleteCollection: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections.php?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        collections = collections.filter(c => c.id !== id);
        dataStore.notifyListeners();
      } else {
        throw new Error(result.message || 'Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },
  
  // Subscribe to changes
  subscribe: (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
  
  // Notify all listeners
  notifyListeners: () => {
    listeners.forEach(listener => listener());
  },
  
  // Refresh data from API
  refresh: async () => {
    initialized = false;
    await initializeData();
  }
};

// Get product by ID with related products
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products.php?id=${id}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      const product = result.data;
      
      // Fetch related products from the same category
      let relatedProducts = [];
      if (product.category_name) {
        const relatedResponse = await fetch(`${API_BASE_URL}/products.php?category=${encodeURIComponent(product.category_name)}`);
        const relatedResult = await relatedResponse.json();
        
        if (relatedResult.success) {
          // Filter out the current product and limit to 4 items
          relatedProducts = relatedResult.data
            .filter(p => p.id !== parseInt(id))
            .slice(0, 4);
        }
      }
      
      return {
        product,
        relatedProducts
      };
    } else {
      throw new Error(result.message || 'Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get reviews for a product
export const getProductReviews = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews.php?product_id=${productId}`);
    
    // If server error (reviews table doesn't exist), return empty data
    if (!response.ok) {
      return {
        reviews: [],
        avgRating: 0,
        reviewCount: 0
      };
    }
    
    const result = await response.json();
    
    if (result.success) {
      return {
        reviews: result.reviews || [],
        avgRating: result.avg_rating || 0,
        reviewCount: result.review_count || 0
      };
    } else {
      return {
        reviews: [],
        avgRating: 0,
        reviewCount: 0
      };
    }
  } catch (error) {
    console.warn('Reviews API not available:', error.message);
    return {
      reviews: [],
      avgRating: 0,
      reviewCount: 0
    };
  }
};

// Submit a new review
export const submitReview = async (productId, reviewerName, rating, comment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        reviewer_name: reviewerName,
        rating: rating,
        comment: comment
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to submit review');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Get all reviews (for admin)
export const getAllReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews.php`);
    const result = await response.json();
    
    if (result.success) {
      return result.reviews || [];
    } else {
      throw new Error(result.message || 'Failed to fetch reviews');
    }
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

// Update a review (admin only)
export const updateReview = async (reviewId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reviewId,
        ...updates
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to update review');
    }
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review (admin only)
export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reviewId
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || 'Failed to delete review');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
