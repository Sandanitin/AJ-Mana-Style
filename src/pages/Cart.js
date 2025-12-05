import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { shippingService } from '../services/shippingService';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, addToWishlist } = useCart();
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
  };

  const handleCalculateShipping = async () => {
    if (!pincode || pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      setCalculatingShipping(true);
      const shipping = await shippingService.calculateShipping(pincode, subtotal);
      setShippingInfo(shipping);
    } catch (error) {
      console.error('Error calculating shipping:', error);
      alert('Failed to calculate shipping. Please try again.');
    } finally {
      setCalculatingShipping(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = shippingInfo ? shippingInfo.charge : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="material-symbols-outlined text-8xl text-primary/30 dark:text-secondary/30 mb-4">
            shopping_cart
          </span>
          <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-text-light/70 dark:text-text-dark/70 font-body mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-white dark:bg-secondary dark:text-primary px-6 py-3 rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary dark:text-secondary mb-4 sm:mb-8">
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 md:p-6"
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
                    <img
                      src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-base sm:text-lg font-semibold font-display text-primary dark:text-secondary hover:underline block mb-1 sm:mb-2 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    
                    {item.category && (
                      <p className="text-xs sm:text-sm text-text-light/60 dark:text-text-dark/60 font-body mb-1 sm:mb-2">
                        {item.category}
                      </p>
                    )}

                    <p className="text-lg sm:text-xl font-bold text-primary dark:text-secondary mb-2 sm:mb-4">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center border border-secondary/30 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 sm:px-3 py-1 hover:bg-primary/10 dark:hover:bg-secondary/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base sm:text-lg">remove</span>
                        </button>
                        <span className="px-3 sm:px-4 py-1 font-semibold font-body min-w-[36px] sm:min-w-[40px] text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 sm:px-3 py-1 hover:bg-primary/10 dark:hover:bg-secondary/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base sm:text-lg">add</span>
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-text-light/60 dark:text-text-dark/60 font-body">
                        Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-4">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-xs sm:text-sm font-body text-primary dark:text-secondary hover:underline flex items-center gap-1 justify-center xs:justify-start"
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">favorite</span>
                        Move to Wishlist
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs sm:text-sm font-body text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 justify-center xs:justify-start"
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold font-display text-primary dark:text-secondary mb-6">
                Order Summary
              </h2>

              {/* Pincode Input */}
              <div className="mb-6 p-4 bg-primary/5 dark:bg-secondary/5 rounded-lg">
                <label className="block text-sm font-body font-semibold text-text-light dark:text-text-dark mb-2">
                  Enter Pincode for Shipping
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark text-sm"
                  />
                  <button
                    onClick={handleCalculateShipping}
                    disabled={calculatingShipping || pincode.length !== 6}
                    className="px-4 py-2 bg-primary text-white dark:bg-secondary dark:text-primary rounded-lg font-semibold text-sm hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {calculatingShipping ? 'Checking...' : 'Check'}
                  </button>
                </div>
                {shippingInfo && shippingInfo.charge > 0 && (
                  <div className="mt-3 text-xs font-body text-text-light/60 dark:text-text-dark/60">
                    <p>Free shipping on orders above ₹{shippingInfo.freeAbove.toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-body text-text-light dark:text-text-dark">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body text-text-light dark:text-text-dark">
                  <span>Shipping</span>
                  <span>
                    {!shippingInfo ? (
                      <span className="text-xs text-text-light/60 dark:text-text-dark/60">Enter pincode</span>
                    ) : shipping === 0 ? (
                      'FREE'
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="border-t border-secondary/20 pt-4">
                  <div className="flex justify-between font-bold font-display text-lg text-primary dark:text-secondary">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  // Check if user is logged in
                  const user = localStorage.getItem('user');
                  if (!user) {
                    alert('Please login to proceed to checkout');
                    navigate('/login');
                    return;
                  }
                  
                  if (!shippingInfo) {
                    alert('Please enter your pincode to calculate shipping charges');
                    return;
                  }
                  navigate('/checkout', { state: { shippingInfo, pincode } });
                }}
                className="w-full bg-gradient-to-r from-secondary to-secondary/90 text-primary py-3 sm:py-4 rounded-lg font-bold font-display text-base hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-3"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block w-full text-center py-3 border border-primary dark:border-secondary text-primary dark:text-secondary rounded-lg font-semibold font-body hover:bg-primary/5 dark:hover:bg-secondary/5 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-secondary/20">
                <div className="space-y-3 text-sm font-body text-text-light/70 dark:text-text-dark/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">verified</span>
                    <span>100% Authentic Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">local_shipping</span>
                    <span>Fast & Secure Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">support_agent</span>
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
