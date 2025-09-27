import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CalendarManagement from '../../components/CalendarManagement';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuthCheck } from '../../hooks/useAuthCheck';

const HostCalendar = () => {
  const { user, isAuthenticated, authChecked, hasRole } = useAuthCheck();
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHostListings();
    }
  }, [isAuthenticated]);

  const fetchHostListings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('/api/listings/host/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setListings(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedListing(data.data[0]);
        }
      } else {
        console.error('Failed to fetch host listings:', response.status);
        toast.error('Failed to fetch your properties');
      }
    } catch (error) {
      console.error('Error fetching host listings:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated or not a host
  if (!authChecked) {
    // Show loading while checking authentication
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user is host or admin (authentication already handled by ProtectedRoute)
  if (!hasRole('host')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need to be a host to access this page.</p>
            <Link 
              to="/become-host" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Become a Host
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Found</h2>
            <p className="text-gray-600 mb-6">You don't have any properties yet. Create a listing to start managing your calendar.</p>
            <Link 
              to="/host/create-listing" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Create Your First Listing
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/host/dashboard"
            className="inline-flex items-center text-pink-600 hover:text-pink-700"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calendar Management
          </h1>
          <p className="text-gray-600">
            Manage availability, block dates, and set custom pricing for your properties.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-9m0 9h4v-9m4 9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Found</h3>
              <p className="text-gray-600 mb-6">
                You need to create a listing first to manage its calendar.
              </p>
              <Link
                to="/host/listings/new"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Create Your First Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Listing Selector */}
            {listings.length > 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Property</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map(listing => (
                    <button
                      key={listing._id}
                      onClick={() => setSelectedListing(listing)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedListing?._id === listing._id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {listing.images && listing.images.length > 0 && (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {listing.location.city}, {listing.location.state}
                          </p>
                          <p className="text-sm font-medium text-pink-600 mt-1">
                            ₹{listing.pricing.basePrice}/night
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Listing Info */}
            {selectedListing && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-4">
                  {selectedListing.images && selectedListing.images.length > 0 && (
                    <img
                      src={selectedListing.images[0]}
                      alt={selectedListing.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedListing.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedListing.location ? 
                        `${selectedListing.location.address || ''}, ${selectedListing.location.city || ''}, ${selectedListing.location.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') 
                        : 'Location not specified'}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-lg font-medium text-pink-600">
                        ₹{selectedListing.pricing?.basePrice || 'N/A'}/night
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedListing.capacity?.guests || 'N/A'} guests • {selectedListing.capacity?.bedrooms || 'N/A'} bedrooms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Component */}
            {selectedListing && (
              <CalendarManagement listingId={selectedListing._id} />
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default HostCalendar;