import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { fetchListingsFromAPI } from '../utils/apiUtils';
import { fetchAllListings, filterListingsByType } from '../utils/categoryUtils';

const ListingsGrid = ({ activeFilter = 'all' }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(20);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = { limit: displayLimit };
        
        if (activeFilter && activeFilter !== 'all') {
          const knownTypes = ['hotel', 'resort', 'villa', 'apartment', 'cottage', 'hostel', 'guesthouse', 'cabin', 'bungalow', 'other'];
          const isType = knownTypes.includes(activeFilter.toLowerCase());
          
          if (isType) {
            filters.propertyType = activeFilter;
          } else {
            const cityOnly = activeFilter.split(',')[0].trim();
            filters.city = cityOnly;
            filters.location = cityOnly;
          }
        }

        try {
          console.log('Fetching listings from API with filter:', activeFilter, filters);
          const { listings: apiListings } = await fetchListingsFromAPI(filters);
          
          if (apiListings && apiListings.length > 0) {
            setListings(apiListings);
          } else {
            // Fallback to mock data if API returns empty
            const mockData = await fetchAllListings();
            const filtered = filterListingsByType(mockData, activeFilter);
            setListings(filtered);
          }
        } catch (apiError) {
          console.warn('API failed, falling back to mock data:', apiError.message);
          const mockData = await fetchAllListings();
          const filtered = filterListingsByType(mockData, activeFilter);
          setListings(filtered);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeFilter, displayLimit]);

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 20);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && listings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e0314f] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-500">
            {activeFilter === 'all' 
              ? 'No properties available at the moment.'
              : `No ${activeFilter.toLowerCase()} properties available.`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {listings.length} {listings.length === 1 ? 'stay' : 'stays'}
          {activeFilter !== 'all' && ` • ${activeFilter}`}
        </h2>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      {/* Load More Button */}
      {listings.length >= displayLimit && (
        <div className="text-center mt-8">
          <button 
            onClick={handleLoadMore}
            className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue exploring
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;