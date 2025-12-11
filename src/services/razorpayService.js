// Razorpay service for handling payments
class RazorpayService {
  constructor() {
    this.razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_Rl6n2UDTYOJBev' //'rzp_live_RmnF4unYS9Egta';
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'https://seashell-yak-534067.hostingersite.com/backend/api';

    // Debug logging
    console.log('Razorpay Key ID:', this.razorpayKeyId);
    console.log('API Base URL:', this.apiBaseUrl);
  }

  // Load Razorpay script dynamically
  loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create order on backend
  async createOrder(orderData) {
    try {
      const url = `${this.apiBaseUrl}/create-order.php`;
      console.log('Creating order with URL:', url);
      console.log('Order data:', orderData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Order creation result:', result);
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Verify payment on backend
  async verifyPayment(paymentData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/verify-payment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(orderDetails, customerInfo, onSuccess, onFailure) {
    try {
      // Load Razorpay script
      const isScriptLoaded = await this.loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order on backend
      const orderResponse = await this.createOrder(orderDetails);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const { orderId, amount, currency } = orderResponse.data;

      // Razorpay configuration
      const options = {
        key: this.razorpayKeyId,
        amount: amount, // Amount in paise
        currency: currency,
        name: 'AJ-Mana Style',
        description: 'Handloom Sarees & Textiles',
        image: '/Logo_Transparent.png',
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: orderDetails
            };

            const verificationResult = await this.verifyPayment(verificationData);
            if (verificationResult.success) {
              onSuccess(verificationResult);
            } else {
              onFailure(new Error(verificationResult.message || 'Payment verification failed'));
            }
          } catch (error) {
            onFailure(error);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        notes: {
          address: customerInfo.address,
          special_instructions: orderDetails.specialInstructions || ''
        },
        theme: {
          color: '#8B4513'
        },
        modal: {
          ondismiss: () => {
            onFailure(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      onFailure(error);
    }
  }
}

export const razorpayService = new RazorpayService();