import React from 'react';

const CancellationRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold font-display text-primary dark:text-secondary mb-8">
              Cancellation & Refund Policy
            </h1>
            
            <div className="space-y-6 font-body text-text-light dark:text-text-dark leading-relaxed">
              <p className="text-lg">
                You can request an order cancellation within 24 hours of placing your order, as long as it has not yet been shipped.
              </p>
              
              <p className="text-lg">
                If we receive your request before dispatch, we'll be happy to process a full refund.
              </p>
              
              <p className="text-lg">
                Once an order has been shipped, we're unable to cancel it — thank you for understanding.
              </p>
              
              <p className="text-lg">
                For any questions or concerns regarding shipping or cancellation, please contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;