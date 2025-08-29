'use client';

import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const mockPlan = {
  name: 'Premium',
  price: 4999,
  status: 'active',
  renewsAt: '2024-08-01',
};
const mockPayments = [
  { id: 1, date: '2024-07-01', amount: 4999, status: 'paid' },
  { id: 2, date: '2024-06-01', amount: 4999, status: 'paid' },
];

// table will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableBody will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableCell will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableHead will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableRow will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divFooter will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divClose will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [canceldivOpen, setCanceldivOpen] = useState(false);
  const [payments, setPayments] = useState(mockPayments);

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-8'>Subscription & Payments</h1>
      <div className='mb-8'>
        <div>
          <h3>Current Plan</h3>
        </div>
        <div>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <div className='text-lg font-semibold'>{mockPlan.name} Plan</div>
              <div className='text-gray-500'>LKR {mockPlan.price} / month</div>
              <div className='text-sm text-green-600 mt-1'>
                {mockPlan.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              <div className='text-xs text-gray-400 mt-1'>
                Renews on {mockPlan.renewsAt}
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                aria-label='Change Plan'
                onClick={() =>
                  toast({ title: 'Change Plan coming soon!', type: 'default' })
                }
              >
                Change Plan
              </button>
              {canceldivOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold'>
                        Cancel Subscription
                      </h3>
                    </div>
                    <div className='mb-6 text-gray-600 dark:text-gray-300'>
                      Are you sure you want to cancel your subscription? This
                      action cannot be undone.
                    </div>
                    <div className='flex gap-2 justify-end'>
                      <button
                        className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                        onClick={() => setCanceldivOpen(false)}
                      >
                        No, Keep Subscription
                      </button>
                      <button
                        className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                        onClick={() => {
                          setCanceldivOpen(false);
                          toast({
                            title: 'Subscription cancelled.',
                            type: 'error',
                          });
                        }}
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                aria-label='Cancel Subscription'
                onClick={() => setCanceldivOpen(true)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h3>Payment History</h3>
        </div>
        <div>
          <table className='w-full'>
            <thead>
              <tr>
                <th className='text-left py-2 px-4 border-b'>Date</th>
                <th className='text-left py-2 px-4 border-b'>Amount (LKR)</th>
                <th className='text-left py-2 px-4 border-b'>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className='text-center py-8 text-gray-400'>
                    <div className='flex flex-col items-center justify-center'>
                      <span className='text-5xl mb-2'>💳</span>
                      <span>No payment history found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id}>
                    <td className='py-2 px-4 border-b'>{p.date}</td>
                    <td className='py-2 px-4 border-b'>
                      {p.amount.toLocaleString()}
                    </td>
                    <td className='py-2 px-4 border-b'>
                      <span
                        className={
                          p.status === 'paid'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
