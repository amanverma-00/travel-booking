import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaReceipt,
  FaDownload
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const response = await axios.get(`/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayment(response.data.data);
    } catch (error) {
      console.error('Error fetching payment:', error);
      toast.error('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <FaClock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <FaTimesCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <FaTimesCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <FaClock className="w-5 h-5 text-gray-500" />;
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

  const formatPaymentMethod = (method) => {
    const methods = {
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Found</h1>
          <p className="text-gray-600">The payment you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
              <div className="flex items-center space-x-2">
                {getStatusIcon(payment.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{payment._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-xl">${payment.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">{payment.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <div className="flex items-center space-x-2">
                      <FaCreditCard className="w-4 h-4" />
                      <span className="font-medium">{formatPaymentMethod(payment.paymentMethod)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{payment.paymentIntentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date not available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              {payment.booking && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span className="font-medium">{payment.booking.listing?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {payment.booking.startDate ? new Date(payment.booking.startDate).toLocaleDateString() : 'Date not available'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {payment.booking.endDate ? new Date(payment.booking.endDate).toLocaleDateString() : 'Date not available'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-mono text-sm">{payment.booking._id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                {payment.receiptUrl && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FaDownload className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                  <FaReceipt className="w-4 h-4" />
                  <span>View Receipt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Property Card */}
          {payment.booking?.listing && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="flex items-center space-x-4">
                {payment.booking.listing.images && payment.booking.listing.images[0] && (
                  <img 
                    src={payment.booking.listing.images[0]} 
                    alt={payment.booking.listing.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{payment.booking.listing.title}</h4>
                  <p className="text-gray-600">
                    {payment.booking.listing.location ? (
                      typeof payment.booking.listing.location === 'string' 
                        ? payment.booking.listing.location
                        : `${payment.booking.listing.location.city || ''}, ${payment.booking.listing.location.state || ''}`
                    ) : 'Location not available'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentDetails;