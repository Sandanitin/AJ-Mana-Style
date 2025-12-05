import React from 'react';
import { Link } from 'react-router-dom';

const ShippingReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-primary/10 dark:bg-secondary/10 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold font-display text-primary dark:text-secondary text-center">
            Shipping, Cancellation & Return Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Shipping Policy Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-4">
                Shipping Policy
              </h2>
              <p className="text-text-light dark:text-text-dark font-body">
                At Vastrāni, we are committed to delivering your orders safely, securely, and on time — both within India and internationally. Please review our shipping guidelines below.
              </p>
            </div>

            {/* 1. Order Processing Time */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                1. Order Processing Time
              </h3>
              <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                <li>Orders are processed within 1–2 business days after payment confirmation.</li>
                <li>During festivals, peak seasons, or sales, processing times may be slightly longer.</li>
              </ul>
            </section>

            {/* 2. Shipping Partners */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                2. Shipping Partners
              </h3>
              <p className="text-text-light dark:text-text-dark font-body ml-4">
                We ship through trusted domestic and international courier partners to ensure reliable and smooth delivery.
              </p>
            </section>

            {/* 3. Delivery Timeline */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                3. Delivery Timeline
              </h3>
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                    Domestic Shipping (Within India)
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                    <li>Within Karnataka: 2–4 business days</li>
                    <li>Metro Cities: 3–5 business days</li>
                    <li>Rest of India: 4–7 business days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                    International Shipping
                  </h4>
                  <p className="text-text-light dark:text-text-dark font-body ml-4">
                    Delivery timelines vary based on destination and customs clearance.
                  </p>
                  <p className="text-text-light dark:text-text-dark font-body ml-4">
                    Estimated delivery: 7–14 business days (may extend during customs delays).
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Shipping Charges */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                4. Shipping Charges
              </h3>
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                    Domestic
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                    <li>Shipping charges (if applicable) will be shown during checkout.</li>
                    <li>Free shipping may be offered during select promotions.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                    International
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                    <li>International shipping is chargeable and calculated at checkout based on weight and destination.</li>
                    <li>Any customs duties, import taxes, or additional charges applicable in your country must be paid by the customer.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Tracking Information */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                5. Tracking Information
              </h3>
              <p className="text-text-light dark:text-text-dark font-body ml-4">
                You will receive a tracking link via SMS/WhatsApp/email once your order has been dispatched. Please allow up to 24 hours for the tracking status to update.
              </p>
            </section>

            {/* 6. Delivery Attempts (Missed Delivery) */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                6. Delivery Attempts (Missed Delivery)
              </h3>
              <div className="ml-4 space-y-2">
                <p className="text-text-light dark:text-text-dark font-body">
                  Our courier partners attempt delivery up to three times. If the parcel is not collected, it will be returned to us.
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                  <li>We can re-ship the order upon your request for an additional ₹250 (domestic).</li>
                  <li>International re-shipping charges will be based on actual courier rates.</li>
                </ul>
              </div>
            </section>

            {/* 7. Incorrect Address or Non-Delivery */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                7. Incorrect Address or Non-Delivery
              </h3>
              <p className="text-text-light dark:text-text-dark font-body ml-4">
                Please ensure that the shipping address, pin code, and contact details are accurate. Vastrāni is not responsible for delays or non-delivery due to incorrect or incomplete information provided by the customer.
              </p>
            </section>

            {/* 8. Damaged or Tampered Packaging */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                8. Damaged or Tampered Packaging
              </h3>
              <div className="ml-4 space-y-2">
                <p className="text-text-light dark:text-text-dark font-body">
                  If the package appears tampered with or damaged at the time of delivery:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                  <li>Please do not accept the parcel, and</li>
                  <li>Contact us immediately with photos/videos for assistance.</li>
                </ul>
                <p className="text-text-light dark:text-text-dark font-body">
                  We will coordinate with the courier partner to resolve the issue on priority.
                </p>
              </div>
            </section>

            {/* 9. Customs, Duties & Taxes (International Orders) */}
            <section>
              <h3 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
                9. Customs, Duties & Taxes (International Orders)
              </h3>
              <div className="ml-4 space-y-2">
                <p className="text-text-light dark:text-text-dark font-body">
                  International shipments may be subject to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                  <li>Customs duties</li>
                  <li>Import taxes</li>
                  <li>VAT/GST</li>
                </ul>
                <p className="text-text-light dark:text-text-dark font-body">
                  These charges are not included in the product price or international shipping fee. They must be paid by the customer directly to the customs authorities upon delivery.
                </p>
              </div>
            </section>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-primary/20 dark:border-secondary/20 my-8"></div>

          {/* Cancellation Policy Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-4">
                Cancellation Policy
              </h2>
              <p className="text-text-light dark:text-text-dark font-body">
                You can request an order cancellation within 24 hours of placing your order, as long as it has not yet been shipped.
              </p>
            </div>

            <section>
              <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                <li>If we receive your request before dispatch, we'll be happy to process a full refund.</li>
                <li>Once an order has been shipped, we're unable to cancel it — thank you for understanding.</li>
              </ul>
            </section>
          </div>

          {/* Contact Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-text-light dark:text-text-dark font-body">
              For any questions or concerns regarding shipping or cancellation, please{' '}
              <Link to="/contact" className="text-primary dark:text-secondary hover:underline font-semibold">
                contact us
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturnPolicy;
