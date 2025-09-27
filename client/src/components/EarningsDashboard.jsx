import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  EyeIcon,
  ChevronDownIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

const EarningsDashboard = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [payoutData, setPayoutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');

  useEffect(() => {
    fetchEarningsData();
    fetchPayoutData();
  }, [selectedPeriod]);

  const fetchEarningsData = async () => {
    try {
      const response = await fetch(`/api/financial/dashboard?period=${selectedPeriod}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setEarningsData(data);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoutData = async () => {
    try {
      const response = await fetch('/api/financial/payouts', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayoutData(data.payouts || []);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const requestPayout = async () => {
    try {
      const response = await fetch('/api/financial/request-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(payoutAmount)
        }),
      });
      
      if (response.ok) {
        setShowPayoutModal(false);
        setPayoutAmount('');
        fetchPayoutData();
        fetchEarningsData();
        alert('Payout request submitted successfully!');
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
      alert('Error requesting payout');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPayoutStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your rental income and manage payouts</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            
            {earningsData?.availableEarnings > 0 && (
              <button
                onClick={() => setShowPayoutModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Payout
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData?.totalEarnings || 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% from last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available for Payout</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(earningsData?.availableEarnings || 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCardIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Available 24 hours after guest checkout
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(earningsData?.pendingEarnings || 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              From active bookings
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {earningsData?.totalBookings || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Completed bookings
            </p>
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payouts</h2>
          
          {payoutData.length === 0 ? (
            <div className="text-center py-8">
              <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payouts yet</p>
              <p className="text-sm text-gray-500">Request your first payout when you have available earnings</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutData.slice(0, 10).map((payout) => (
                    <tr key={payout._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 capitalize">
                        {payout.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPayoutStatusColor(payout.status)}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {payout.transactionId || 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout Request Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Payout</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Available balance:</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(earningsData?.availableEarnings || 0)}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Amount
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={earningsData?.availableEarnings || 0}
                  min="100"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount (min ₹100)"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={requestPayout}
                  disabled={!payoutAmount || parseFloat(payoutAmount) < 100}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Request Payout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsDashboard;