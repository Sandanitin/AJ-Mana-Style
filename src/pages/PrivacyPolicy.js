import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-primary/10 dark:bg-secondary/10 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold font-display text-primary dark:text-secondary text-center">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <div>
            <p className="text-text-light dark:text-text-dark font-body">
              At Vastrāni Looms, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you use our website or place an order with us.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              1. Information We Collect
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              We may collect the following types of information:
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                  a) Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                  <li>Name</li>
                  <li>Phone Number</li>
                  <li>Email Address</li>
                  <li>Shipping & Billing Address</li>
                  <li>Payment-related details (processed securely via payment gateway; we do not store card details)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                  b) Non-Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                  <li>Browser type and device information</li>
                  <li>Website usage data (pages visited, time spent, etc.)</li>
                  <li>Cookies and tracking technologies for improving user experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>Process and fulfill orders</li>
              <li>Provide shipping updates and customer support</li>
              <li>Improve our website, products, and services</li>
              <li>Send order confirmations, invoices, and customer service messages</li>
              <li>Share updates, offers, or promotions (only if you opt in)</li>
            </ul>
            <p className="text-text-light dark:text-text-dark font-body mt-3 ml-4">
              <strong>We do not sell or rent your personal data to third parties.</strong>
            </p>
          </section>

          {/* 3. Sharing of Information */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              3. Sharing of Information
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              Your information may be shared only with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>Courier partners for delivery</li>
              <li>Payment gateways for secure payment processing</li>
              <li>IT/Support service providers who help run our website (under strict confidentiality)</li>
            </ul>
            <p className="text-text-light dark:text-text-dark font-body mt-3 ml-4">
              <strong>We do not share, sell, or disclose your information to unrelated third parties.</strong>
            </p>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              4. Data Security
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              We follow industry-standard security measures to protect your information from unauthorized access, misuse, or disclosure.
            </p>
            <p className="text-text-light dark:text-text-dark font-body ml-4">
              However, no online transmission is 100% secure, and we encourage customers to use strong passwords and safe browsing practices.
            </p>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              5. Cookies
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>Improve site performance</li>
              <li>Personalize user experience</li>
              <li>Track website analytics</li>
            </ul>
            <p className="text-text-light dark:text-text-dark font-body mt-3 ml-4">
              You may disable cookies through your browser settings, but some features may not function properly.
            </p>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              6. Your Rights
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-3">
              You can request:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your account or personal information</li>
              <li>Opt out from promotional messages</li>
            </ul>
            <p className="text-text-light dark:text-text-dark font-body mt-3 ml-4">
              To submit a request, please contact us through our customer support.
            </p>
          </section>

          {/* 7. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              7. Third-Party Links
            </h2>
            <p className="text-text-light dark:text-text-dark font-body ml-4">
              Our website may contain links to third-party websites. We are not responsible for their privacy practices or content.
            </p>
          </section>

          {/* 8. Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
              8. Policy Updates
            </h2>
            <p className="text-text-light dark:text-text-dark font-body ml-4">
              We may update this Privacy Policy from time to time. The latest version will always be available on our website.
            </p>
          </section>

          {/* 9. Online Account Policy */}
          <section>
            <h2 className="text-2xl font-bold font-display text-primary dark:text-secondary mb-3">
         Online Account Policy
            </h2>
            <p className="text-text-light dark:text-text-dark font-body mb-4">
              Some features of our website may require you to create an account. By registering, you agree to the following terms:
            </p>

            {/* 9.1 Account Creation */}
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                 Account Creation
                </h3>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-4">
                  <li>You must provide accurate, complete, and up-to-date information.</li>
                  <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>Any activities conducted under your account will be considered authorized by you.</li>
                </ul>
              </div>

              {/* 9.2 Account Responsibilities */}
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                   Account Responsibilities
                </h3>
                <p className="text-text-light dark:text-text-dark font-body mb-3 ml-4">
                  By creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-8">
                  <li>Keep your password secure</li>
                  <li>Notify us immediately if you suspect unauthorized access</li>
                  <li>Avoid using false information or impersonating someone else</li>
                  <li>Update your contact details if they change</li>
                </ul>
                <p className="text-text-light dark:text-text-dark font-body mt-3 ml-4">
                  We reserve the right to suspend or delete accounts if suspicious or harmful activity is detected.
                </p>
              </div>

              {/* 9.3 Order History & Saved Information */}
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                Order History & Saved Information
                </h3>
                <p className="text-text-light dark:text-text-dark font-body mb-3 ml-4">
                  Your account may store:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-light dark:text-text-dark font-body ml-8">
                  <li>Order history</li>
                  <li>Saved addresses</li>
                  <li>Wishlist items</li>
                  <li>Communication preferences</li>
                </ul>
                <p className="text-text-light dark:text-text-dark font-body mt-3 ml-4">
                  This helps provide a faster, smoother shopping experience.
                </p>
              </div>

              {/* 9.4 Termination of Account */}
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                 Termination of Account
                </h3>
                <p className="text-text-light dark:text-text-dark font-body ml-4 mb-3">
                  You may delete your account at any time by contacting customer support.
                </p>
                <p className="text-text-light dark:text-text-dark font-body ml-4">
                  We may also suspend or terminate accounts for violation of our Terms & Conditions.
                </p>
              </div>

              {/* 9.5 Data Retention After Account Deletion */}
              <div>
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark font-body mb-2">
                 Data Retention After Account Deletion
                </h3>
                <p className="text-text-light dark:text-text-dark font-body ml-4">
                  Even after an account is deleted, certain transaction-related information may be retained as required by law (e.g., invoices, GST, or payment records).
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-text-light dark:text-text-dark font-body">
              For any questions or concerns regarding privacy or your account, please{' '}
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

export default PrivacyPolicy;
