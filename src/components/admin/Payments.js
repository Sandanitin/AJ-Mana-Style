import React from 'react';

const Payments = () => {
  const transactions = [
    { id: 'TXN-001', orderId: 'ORD-001', amount: 15000, method: 'UPI', status: 'success', date: '2024-11-20' },
    { id: 'TXN-002', orderId: 'ORD-002', amount: 22000, method: 'Card', status: 'success', date: '2024-11-19' },
  ];

  return (
    <div className="space-y-6">
      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-display font-bold text-primary dark:text-secondary mb-4">Recent Transactions</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary/10 dark:bg-secondary/10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Transaction ID</th>
                <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Order ID</th>
                <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Method</th>
                <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-body font-bold text-primary dark:text-secondary uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-primary/5 dark:hover:bg-secondary/5">
                  <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{txn.id}</td>
                  <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{txn.orderId}</td>
                  <td className="px-3 py-2 font-body text-xs font-semibold text-text-light dark:text-text-dark">₹{txn.amount.toLocaleString()}</td>
                  <td className="px-3 py-2 font-body text-xs text-text-light dark:text-text-dark">{txn.method}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-body font-semibold">
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-body text-[10px] text-text-light dark:text-text-dark">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
