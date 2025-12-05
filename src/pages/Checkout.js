import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { shippingService } from '../services/shippingService';
import { offerBannerService } from '../services/offerBannerService';
import { razorpayService } from '../services/razorpayService';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [contactInfo, setContactInfo] = useState({
    email: user.email || '',
    phone: user.phone || ''
  });
  
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(location.state?.shippingInfo || null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [offerBanners, setOfferBanners] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);

  const subtotal = getCartTotal();
  const shippingCharge = shippingInfo ? shippingInfo.charge : 0;
  const discount = appliedCoupon 
    ? (appliedCoupon.type === 'percentage' 
        ? (subtotal * appliedCoupon.discount) / 100 
        : appliedCoupon.discount)
    : 0;
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const total = subtotal - discount + shippingCharge + tax;

  // Fetch active offer banners
  useEffect(() => {
    const fetchOfferBanners = async () => {
      try {
        const banners = await offerBannerService.getActiveBanner();
        console.log('Fetched offer banners:', banners);
        setOfferBanners(banners || []);
      } catch (error) {
        console.error('Error fetching offer banners:', error);
      }
    };
    fetchOfferBanners();
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user.email) return;
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
        const response = await fetch(`${apiUrl}/addresses.php?email=${encodeURIComponent(user.email)}`);
        const result = await response.json();
        
        if (result.success) {
          setSavedAddresses(result.data);
          // If there's a default address, select it
          const defaultAddress = result.data.find(addr => addr.is_default === 1);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setUseNewAddress(false);
            loadAddress(defaultAddress);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.email]);

  const loadAddress = (address) => {
    setShippingAddress({
      firstName: address.first_name,
      lastName: address.last_name,
      streetAddress: address.street_address,
      city: address.city,
      state: address.state,
      zipCode: address.zip_code
    });
    setContactInfo(prev => ({
      ...prev,
      phone: address.phone
    }));
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      loadAddress(address);
      setUseNewAddress(false);
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    setShippingAddress({
      firstName: '',
      lastName: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: ''
    });
  };

  // Set initial zipCode if passed from cart
  useEffect(() => {
    if (location.state?.zipCode) {
      setShippingAddress(prev => ({
        ...prev,
        zipCode: location.state.zipCode
      }));
    }
  }, [location.state]);

  const handleContactChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    // Validate coupon against offer banners (both percentage and coupon types)
    const matchedBanner = offerBanners.find(
      banner => banner.coupon_code && banner.coupon_code.toUpperCase() === couponCode.toUpperCase()
    );

    if (matchedBanner) {
      // Check minimum order requirement
      if (matchedBanner.min_order_amount && subtotal < parseFloat(matchedBanner.min_order_amount)) {
        alert(`This coupon requires a minimum order of ₹${matchedBanner.min_order_amount}`);
        return;
      }

      if (matchedBanner.type === 'percentage') {
        setAppliedCoupon({ 
          code: matchedBanner.coupon_code, 
          discount: parseFloat(matchedBanner.discount_value),
          type: 'percentage',
          title: matchedBanner.title
        });
      } else {
        setAppliedCoupon({ 
          code: matchedBanner.coupon_code, 
          discount: parseFloat(matchedBanner.discount_value),
          type: 'fixed',
          title: matchedBanner.title
        });
      }
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!contactInfo.email || !contactInfo.phone) {
      alert('Please provide contact information');
      return;
    }
    
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.streetAddress || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert('Please complete shipping address');
      return;
    }

    if (!shippingInfo) {
      alert('Please enter your pincode to calculate shipping charges');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'online') {
        // Razorpay online payment
        const orderDetails = {
          amount: total,
          currency: 'INR',
          customerInfo: {
            email: contactInfo.email,
            phone: contactInfo.phone,
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            address: `${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`
          },
          cartItems: cartItems,
          shippingAddress: shippingAddress,
          specialInstructions: specialInstructions,
          appliedCoupon: appliedCoupon,
          shippingCharge: shippingCharge,
          tax: tax,
          discount: discount
        };

        await razorpayService.initiatePayment(
          orderDetails,
          orderDetails.customerInfo,
          (response) => {
            // Payment successful
            alert('Payment successful! Order placed successfully.');
            clearCart();
            navigate('/', { 
              state: { 
                message: 'Order placed successfully! You will receive a confirmation email shortly.',
                orderId: response.data.order_id 
              }
            });
            setIsProcessing(false);
          },
          (error) => {
            // Payment failed
            console.error('Payment failed:', error);
            alert('Payment failed: ' + error.message);
            setIsProcessing(false);
          }
        );
      } else if (paymentMethod === 'cod') {
        // Cash on Delivery
        const codOrderData = {
          customerInfo: {
            email: contactInfo.email,
            phone: contactInfo.phone,
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`
          },
          cartItems: cartItems,
          shippingAddress: shippingAddress,
          amount: total,
          specialInstructions: specialInstructions,
          appliedCoupon: appliedCoupon,
          shippingCharge: shippingCharge,
          tax: tax,
          discount: discount
        };

        const apiUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';
        const url = `${apiUrl}/create-cod-order.php`;
        
        console.log('COD API URL:', url);
        console.log('COD Order Data:', codOrderData);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(codOrderData)
        });

        console.log('COD Response Status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('COD Server Error:', errorText);
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          alert('COD Order placed successfully! You will receive a confirmation call shortly.');
          clearCart();
          navigate('/', { 
            state: { 
              message: 'COD Order placed successfully! We will call you to confirm the order.',
              orderId: result.data.order_id 
            }
          });
        } else {
          throw new Error(result.message || 'Failed to place COD order');
        }
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center py-12">
        <div className="text-center">
          <span className="material-symbols-outlined text-8xl text-primary/30 dark:text-secondary/30 mb-4 block">
            shopping_cart
          </span>
          <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-4">
            Your cart is empty
          </h2>
          <p className="text-text-light/70 dark:text-text-dark/70 font-body mb-6">
            Add some items to proceed to checkout
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary text-white dark:bg-secondary dark:text-primary px-6 py-3 rounded-lg font-semibold font-body hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary dark:text-secondary mb-6 sm:mb-8">
          Checkout
        </h1>

        <form onSubmit={handleCompleteOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold font-display text-primary dark:text-secondary mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="your@email.com"
                      readOnly={!!user.email}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="1234567890"
                      readOnly={!!user.phone}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold font-display text-primary dark:text-secondary mb-4">
                  Shipping Address
                </h2>

                {/* Saved Addresses Section */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-text-light dark:text-text-dark">
                        Select Saved Address
                      </h3>
                      <button
                        type="button"
                        onClick={handleUseNewAddress}
                        className="text-sm text-primary dark:text-secondary hover:underline"
                      >
                        + Use New Address
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelection(address.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-primary dark:border-secondary bg-primary/5 dark:bg-secondary/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-secondary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold text-text-light dark:text-text-dark">
                                  {address.first_name} {address.last_name}
                                </p>
                                {address.is_default === 1 && (
                                  <span className="text-xs bg-primary dark:bg-secondary text-white px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                                {address.street_address}
                              </p>
                              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                                {address.city}, {address.state} {address.zip_code}
                              </p>
                              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                                Phone: {address.phone}
                              </p>
                            </div>
                            {selectedAddressId === address.id && (
                              <span className="material-icons text-primary dark:text-secondary">
                                check_circle
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {!useNewAddress && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <span className="material-icons text-sm align-middle mr-1">info</span>
                          Selected address will be used for delivery
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* New Address Form */}
                {(useNewAddress || savedAddresses.length === 0) && (
                  <div className="space-y-4">
                    {savedAddresses.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-3">
                          Enter New Address
                        </h3>
                      </div>
                    )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleShippingChange}
                        className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleShippingChange}
                        className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={shippingAddress.streetAddress}
                      onChange={handleShippingChange}
                      className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Street Address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                        ZIP Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => {
                            handleShippingChange(e);
                            // Auto-calculate shipping when zipCode is 6 digits
                            if (e.target.value.length === 6) {
                              const newZipCode = e.target.value;
                              setTimeout(async () => {
                                try {
                                  setCalculatingShipping(true);
                                  const shipping = await shippingService.calculateShipping(newZipCode, subtotal);
                                  setShippingInfo(shipping);
                                } catch (error) {
                                  console.error('Error calculating shipping:', error);
                                } finally {
                                  setCalculatingShipping(false);
                                }
                              }, 500);
                            }
                          }}
                          className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="ZIP Code"
                          maxLength="6"
                          required
                        />
                        {calculatingShipping && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold font-display text-primary dark:text-secondary mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-3">
                    Select Payment Method
                  </label>
                  
                  {/* Online Payment */}
                  <div className="border border-secondary/30 rounded-lg p-4 bg-background-light/50 dark:bg-background-dark/50">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 mr-3 text-primary dark:text-secondary focus:ring-secondary"
                      />
                      <div className="flex-1">
                        <div className="font-semibold font-body text-text-light dark:text-text-dark mb-1">
                          Online Payment
                        </div>
                        <div className="text-xs sm:text-sm text-text-light/60 dark:text-text-dark/60 font-body mb-2">
                          Pay securely using UPI, Credit/Debit Card, Net Banking
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">
                            <span className="material-symbols-outlined text-sm">account_balance</span>
                            <span>UPI</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">
                            <span className="material-symbols-outlined text-sm">credit_card</span>
                            <span>Cards</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">
                            <span className="material-symbols-outlined text-sm">account_balance</span>
                            <span>Net Banking</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Cash on Delivery - DISABLED */}
                  {false && (
                  <div className="border border-secondary/30 rounded-lg p-4 bg-background-light/50 dark:bg-background-dark/50">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 mr-3 text-primary dark:text-secondary focus:ring-secondary"
                      />
                      <div className="flex-1">
                        <div className="font-semibold font-body text-text-light dark:text-text-dark mb-1">
                          Cash on Delivery (COD)
                        </div>
                        <div className="text-xs sm:text-sm text-text-light/60 dark:text-text-dark/60 font-body mb-2">
                          Pay with cash when your order is delivered to your doorstep
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">
                            <span className="material-symbols-outlined text-sm">payments</span>
                            <span>Cash</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                  )}

                  {/* Payment Method Info */}
                  {paymentMethod === 'online' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
                          security
                        </span>
                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-body">
                          Your payment is secured by Razorpay. We support UPI, Credit/Debit Cards, and Net Banking.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
                          info
                        </span>
                        <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 font-body">
                          Cash on Delivery available. Please keep exact change ready for a smooth delivery experience.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold font-display text-primary dark:text-secondary mb-4">
                  Special Instructions (Optional)
                </h2>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Any special delivery instructions or notes..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-bold font-display text-primary dark:text-secondary mb-4">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-secondary/20">
                      <img
                        src={item.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold font-display text-text-light dark:text-text-dark line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-text-light/60 dark:text-text-dark/60">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-primary dark:text-secondary mt-1">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold font-body text-text-light dark:text-text-dark mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-secondary/30 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Enter coupon code"
                      disabled={appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-secondary text-primary rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span className="font-body">Coupon codes are from the current offer banner</span>
                    </div>
                  )}
                </div>

                {/* Current Offer */}
                {!appliedCoupon && offerBanners.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {offerBanners.map((banner) => (
                      <div key={banner.id} className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-lg border border-secondary/30">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-secondary text-lg">local_offer</span>
                          <div className="text-xs font-body text-text-light dark:text-text-dark">
                            <span className="font-semibold">Current offer:</span> {banner.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4 pt-4 border-t border-secondary/30">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-text-light dark:text-text-dark">Subtotal</span>
                    <span className="font-semibold text-text-light dark:text-text-dark">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm font-body text-green-600 dark:text-green-400">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-text-light dark:text-text-dark">Shipping</span>
                    <span className={`font-semibold ${!shippingInfo ? 'text-text-light/60 dark:text-text-dark/60' : shippingCharge === 0 ? 'text-green-600 dark:text-green-400' : 'text-text-light dark:text-text-dark'}`}>
                      {!shippingInfo ? 'Enter pincode' : shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                    </span>
                  </div>
                  {shippingInfo && shippingInfo.charge > 0 && (
                    <p className="text-xs text-text-light/60 dark:text-text-dark/60 font-body">
                      Free shipping on orders above ₹{shippingInfo.freeAbove?.toLocaleString('en-IN')}
                    </p>
                  )}
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-text-light dark:text-text-dark">Tax (GST)</span>
                    <span className="font-semibold text-text-light dark:text-text-dark">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-t-2 border-secondary/30 mb-4">
                  <span className="text-lg font-bold font-display text-text-light dark:text-text-dark">
                    Total
                  </span>
                  <span className="text-xl font-bold font-display text-primary dark:text-secondary">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* Complete Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-secondary to-secondary/90 text-primary py-3 rounded-lg font-bold font-display text-base hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">shopping_bag</span>
                      Complete Order
                    </>
                  )}
                </button>

                {/* Security Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-light/60 dark:text-text-dark/60">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
