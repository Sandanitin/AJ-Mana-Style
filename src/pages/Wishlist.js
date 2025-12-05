import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="material-symbols-outlined text-8xl text-primary/30 dark:text-secondary/30 mb-4">
            favorite
          </span>
          <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-text-light/70 dark:text-text-dark/70 font-body mb-8">
            Save your favorite items here for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-white dark:bg-secondary dark:text-primary px-6 py-3 rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary">
            My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
          </h1>
          <Link
            to="/products"
            className="text-sm font-body text-primary dark:text-secondary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative">
                <Link to={`/product/${item.id}`} className="block">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  title="Remove from wishlist"
                >
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg">
                    close
                  </span>
                </button>
              </div>

              {/* Product Details */}
              <div className="p-3">
                <Link
                  to={`/product/${item.id}`}
                  className="block mb-1.5"
                >
                  <h3 className="font-semibold font-display text-sm text-primary dark:text-secondary hover:underline line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <p className="text-base font-bold text-primary dark:text-secondary mb-3">
                  ₹{item.price.toLocaleString('en-IN')}
                </p>

                {/* Actions */}
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary text-white dark:bg-secondary dark:text-primary py-1.5 rounded font-semibold font-body text-xs hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    Add to Cart
                  </button>
                  
                  <Link
                    to={`/product/${item.id}`}
                    className="block w-full text-center py-1.5 border border-primary dark:border-secondary text-primary dark:text-secondary rounded font-semibold font-body text-xs hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-white dark:bg-secondary dark:text-primary px-8 py-3 rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors"
            >
              Explore More Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
