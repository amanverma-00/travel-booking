import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const ListingSelector = ({ onSelect }) => {
  const { user } = useSelector((state) => state.auth);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState(null);

  useEffect(() => {
    fetchUserListings();
  }, [user]);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/listings/host/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Listings API response:', data); // Debug log
        setListings(data.data || data.listings || []);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListingSelect = (listing) => {
    setSelectedListingId(listing._id);
    onSelect({
      id: listing._id,
      title: listing.title,
      price: listing.pricing?.basePrice || 0,
      rating: listing.averageRating || 0,
      location: listing.location?.city || 'Unknown',
      image: listing.images?.[0] || ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <HomeIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Found</h3>
        <p className="text-gray-600 mb-6">
          You don't have any properties listed yet. Create your first listing to get started.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Add Your First Property
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Property</h3>
        <p className="text-gray-600">Choose one of your listings to get AI-powered pricing recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            onClick={() => handleListingSelect(listing)}
            className={`relative bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedListingId === listing._id 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Selected Indicator */}
            {selectedListingId === listing._id && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-blue-600 rounded-full p-1">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {/* Property Image */}
            <div className="aspect-w-16 aspect-h-10 overflow-hidden rounded-t-lg">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={getImageUrl(listing.images[0])}
                  alt={listing.title}
                  onError={(e) => handleImageError(e)}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <HomeIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {listing.title}
              </h4>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{listing.location?.city}, {listing.location?.state}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}
                  </span>
                  {listing.reviewCount && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({listing.reviewCount})
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(listing.pricing?.basePrice || 0)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/night</span>
                </div>
              </div>

              {/* Property Type */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {listing.propertyType || 'Property'}
                </span>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  listing.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {listing.status || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedListingId && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-800">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Property selected! Continue to AI pricing optimization.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingSelector;