import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import { FaSearch, FaFilter, FaSort, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { fetchListingsFromAPI } from '../utils/apiUtils';

const SearchResults = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Extract search parameters
  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = parseInt(searchParams.get('adults')) || 2;
  const children = parseInt(searchParams.get('children')) || 0;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const propertyType = searchParams.get('propertyType') || '';

  // Calculate total guests
  const totalGuests = adults + children;

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  useEffect(() => {
    const searchListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = {
          limit: 50
        };
        
        // Add location filter
        if (location) {
          filters.location = location;
        }
        
        // Add guest capacity filter
        if (totalGuests > 0) {
          filters.minGuests = totalGuests;
        }
        
        // Add price filters
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;
        
        // Add property type filter
        if (propertyType) filters.propertyType = propertyType;

        console.log('Search filters:', filters);
        
        const { listings: searchResults } = await fetchListingsFromAPI(filters);
        
        // Apply date filtering if dates are provided
        let filteredResults = searchResults;
        
        // TODO: Add date availability filtering when booking system is integrated
        // For now, we'll show all results that match other criteria
        
        // Apply sorting
        filteredResults = applySorting(filteredResults, sortBy);
        
        setListings(filteredResults);
        console.log(`Found ${filteredResults.length} listings`);
        
      } catch (error) {
        console.error('Search error:', error);
        setError('Failed to search listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    searchListings();
  }, [location, checkIn, checkOut, adults, children, minPrice, maxPrice, propertyType, sortBy]);

  const applySorting = (listings, sortType) => {
    const sorted = [...listings];
    
    switch (sortType) {
      case 'priceLowToHigh':
        return sorted.sort((a, b) => (a.pricing?.basePrice || a.price || 0) - (b.pricing?.basePrice || b.price || 0));
      case 'priceHighToLow':
        return sorted.sort((a, b) => (b.pricing?.basePrice || b.price || 0) - (a.pricing?.basePrice || a.price || 0));
      case 'topRated':
        return sorted.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      case 'newestFirst':
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'relevance':
      default:
        return sorted; // Keep original order for relevance
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const editSearch = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {listings.length} {listings.length === 1 ? t('search.result') || 'result' : t('search.results') || 'results'}
                {location && ` in ${location}`}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                    <span>{location}</span>
                  </div>
                )}
                
                {checkIn && checkOut && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-1" />
                    <span>{formatDate(checkIn)} - {formatDate(checkOut)} ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                  </div>
                )}
                
                {totalGuests > 0 && (
                  <div className="flex items-center">
                    <FaUsers className="w-4 h-4 mr-1" />
                    <span>{adults} {adults === 1 ? t('booking.adult') : t('booking.adults')}{children > 0 ? `, ${children} ${children === 1 ? t('booking.child') : t('booking.children')}` : ''}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={editSearch}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <FaSearch className="w-4 h-4 mr-2" />
                {t('search.editSearch') || 'Edit Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <FaFilter className="w-4 h-4 mr-2" />
              {t('search.filters') || 'Filters'}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaSort className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="relevance">{t('search.relevance') || 'Relevance'}</option>
              <option value="priceLowToHigh">{t('search.priceLowToHigh') || 'Price: Low to High'}</option>
              <option value="priceHighToLow">{t('search.priceHighToLow') || 'Price: High to Low'}</option>
              <option value="topRated">{t('search.topRated') || 'Top Rated'}</option>
              <option value="newestFirst">{t('search.newestFirst') || 'Newest First'}</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('common.tryAgain') || 'Try Again'}
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('search.noResults') || 'No properties found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('search.noResultsMessage') || 'Try adjusting your search criteria or explore different locations.'}
            </p>
            <button
              onClick={editSearch}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('search.modifySearch') || 'Modify Search'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {/* Load More - TODO: Add pagination */}
        {listings.length >= 20 && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              {t('search.showMore') || 'Show More Results'}
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;