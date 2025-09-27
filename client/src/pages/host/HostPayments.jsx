import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaEye,
  FaChartLine,
  FaCalendar
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';

const HostPayments = () => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments/host/received', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(response.data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/payments/host/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <FaTimesCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Payments</h1>
            <p className="text-gray-600">Track payments received from your guests</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">${stats.totalEarnings}</p>
                  </div>
                  <FaChartLine className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">${stats.pendingPayments}</p>
                  </div>
                  <FaClock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Refunded</p>
                    <p className="text-2xl font-bold text-orange-600">${stats.refundedAmount}</p>
                  </div>
                  <FaTimesCircle className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</p>
                  </div>
                  <FaCreditCard className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 text-sm">
                    ({payments.filter(p => status === 'all' || p.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredPayments.length === 0 ? (
              <div className="p-12 text-center">
                <FaCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'You haven\'t received any payments yet.'
                    : `No ${filter} payments found.`
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest & Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.user?.firstName} {payment.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.booking?.listing?.title || 'Property'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">${payment.amount}</div>
                          <div className="text-sm text-gray-500">{payment.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaCalendar className="w-3 h-3" />
                            <span>
                              {new Date(payment.booking?.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {' - '}
                              {new Date(payment.booking?.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/payment/${payment._id}`}
                            className="flex items-center space-x-1 text-pink-600 hover:text-pink-900"
                          >
                            <FaEye className="w-4 h-4" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HostPayments;