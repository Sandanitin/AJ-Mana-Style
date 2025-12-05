import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-primary/10 dark:bg-secondary/10 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold font-display text-primary dark:text-secondary text-center">
            Terms & Conditions
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          
          <p className="text-text-light dark:text-text-dark font-body">
            Welcome to Vastrāni Looms. By placing an order on our website or social platforms, you agree to the following terms and conditions.
          </p>

          {/* 1. Product Information */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              1. Product Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>We strive to provide accurate product descriptions, images, and details.</li>
              <li><strong>Please note:</strong> slight variations in color, texture, or weaving may occur due to lighting, device screens, and the handmade nature of sarees. These are not considered defects.</li>
            </ul>
          </section>

          {/* 2. Pricing & Payments */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              2. Pricing & Payments
            </h2>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>All prices are listed in INR and may change without prior notice.</li>
              <li>Orders are processed only after full payment is received.</li>
              <li>Discounts, offers, and coupon codes may apply only where specified.</li>
            </ul>
          </section>

          {/* 3. Order Confirmation */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              3. Order Confirmation
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              Once your order is placed, you will receive a confirmation through email or WhatsApp. Please review it and contact us immediately if any details are incorrect.
            </p>
          </section>

          {/* 4. Shipping & Delivery */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              4. Shipping & Delivery
            </h2>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>We ship through trusted courier partners across India.</li>
              <li>Delivery time varies by location.</li>
              <li>Delays caused by courier delays, weather, or unforeseen events are beyond our control.</li>
              <li>Tracking details will be shared once the order is dispatched.</li>
            </ul>
            
            <h3 className="text-xl font-semibold font-display text-primary dark:text-secondary mt-4 mb-2">
              4a. Missed Delivery
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>Our courier partners will make up to three delivery attempts. If the order is not collected during these attempts, the shipment will be returned to us.</li>
              <li>We can re-ship the order upon your request for an additional ₹250.</li>
            </ul>
          </section>

          {/* 5. Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              5. Cancellation Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>You may request cancellation within 24 hours, provided the order has not been shipped.</li>
              <li>Orders cannot be cancelled after dispatch. Refunds (if applicable) are processed to the original payment method.</li>
            </ul>
          </section>

          {/* 6. Exchange Policy */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              6. Exchange Policy
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              We want you to love your purchase. However, we do not offer exchanges unless the saree/product is defective or damaged.
            </p>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              If you receive a defective or incorrect item, please inform us within 24 hours of delivery and share clear unboxing videos. This helps us verify the issue quickly and assist you with the appropriate resolution.
            </p>
            <p className="text-text-light dark:text-text-dark font-body mb-2">
              <strong>To be eligible:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4 mb-3">
              <li>Saree must be unused, unwashed, and undamaged</li>
              <li>Must be returned in the original packaging</li>
              <li>Customer must arrange return shipping at their own cost</li>
            </ul>
            <p className="text-text-light dark:text-text-dark font-body">
              Exchanges are subject to stock availability.
            </p>
          </section>

          {/* 7. No Returns / Refunds After Delivery */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              7. No Returns / Refunds After Delivery
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              We do not offer returns or refunds once a saree has been delivered, except in case of genuine defects.
            </p>
          </section>

          {/* 8. Defective or Incorrect Product */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              8. Defective or Incorrect Product
            </h2>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>If you receive a defective or incorrect item, please contact us within 24 hours of delivery with clear unboxing videos.</li>
              <li>Once verified, we will assist with an exchange or replacement.</li>
            </ul>
          </section>

          {/* 9. Custom Orders & Pre-Orders */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              9. Custom Orders & Pre-Orders
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              Custom-made items, pre-orders, and altered sarees are not eligible for cancellation, exchange, or refund.
            </p>
          </section>

          {/* 10. Care Instructions */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              10. Care Instructions
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              Please follow the saree care instructions provided to maintain the longevity and appearance of your product.
            </p>
          </section>

          {/* 11. Copyright & Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              11. Copyright & Intellectual Property
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              All product images, designs, text, and content on this website belong to Vastrāni Looms. Reproduction or unauthorized use is strictly prohibited.
            </p>
          </section>

          {/* 12. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              12. Limitation of Liability
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-2">
              Vastrāni Looms is not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4 mb-3">
              <li>Shipping delays</li>
              <li>Misuse of products</li>
              <li>Any indirect or consequential damages</li>
            </ul>
            <p className="text-text-light dark:text-text-dark font-body">
              Our liability is strictly limited to the value of the purchased product.
            </p>
          </section>

          {/* 13. Updates to Terms */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              13. Updates to Terms
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              We may update these Terms & Conditions at any time. Changes will be posted on this page, and continued use of our website constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-text-light dark:text-text-dark font-body text-center">
              For any questions or concerns regarding these Terms & Conditions, please{' '}
              <Link to="/contact" className="text-primary dark:text-secondary font-semibold hover:underline">
                contact us
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
