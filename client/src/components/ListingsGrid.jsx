import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { fetchListingsFromAPI } from '../utils/apiUtils';
import { fetchAllListings, filterListingsByType } from '../utils/categoryUtils';

const ListingsGrid = ({ activeFilter }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration - replace with API call
  const mockListings = [
    {
      _id: '1',
      title: 'Luxury Beachfront Villa with Private Pool',
      location: 'Goa, India',
      propertyType: 'Villa',
      price: 15000,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      ratingsAverage: 4.8,
      images: [
        { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' },
        { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400' }
      ]
    },
    {
      _id: '2',
      title: 'Mountain Resort with Stunning Valley Views',
      location: 'Manali, Himachal Pradesh',
      propertyType: 'Resort',
      price: 8500,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.6,
      images: [
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' }
      ]
    },
    {
      _id: '3',
      title: 'Modern City Hotel in Business District',
      location: 'Mumbai, Maharashtra',
      propertyType: 'Hotel',
      price: 6500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.4,
      images: [
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' }
      ]
    },
    {
      _id: '4',
      title: 'Cozy Cottage in Tea Gardens',
      location: 'Darjeeling, West Bengal',
      propertyType: 'Cottage',
      price: 4500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.7,
      images: [
        { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400' }
      ]
    },
    {
      _id: '5',
      title: 'Spacious Apartment Near Beach',
      location: 'Kochi, Kerala',
      propertyType: 'Apartment',
      price: 3500,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      ratingsAverage: 4.3,
      images: [
        { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' }
      ]
    },
    {
      _id: '6',
      title: 'Budget Hostel in City Center',
      location: 'Delhi, India',
      propertyType: 'Hostel',
      price: 1200,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      ratingsAverage: 4.1,
      images: [
        { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
      ]
    },
    {
      _id: '7',
      title: 'Traditional Guesthouse with Garden',
      location: 'Udaipur, Rajasthan',
      propertyType: 'Guesthouse',
      price: 2800,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.5,
      images: [
        { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400' }
      ]
    },
    {
      _id: '8',
      title: 'Serene Bungalow by the Lake',
      location: 'Nainital, Uttarakhand',
      propertyType: 'Bungalow',
      price: 7200,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      ratingsAverage: 4.9,
      images: [
        { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' }
      ]
    },
    {
      _id: '9',
      title: 'Luxury Resort with Spa Facilities',
      location: 'Rishikesh, Uttarakhand',
      propertyType: 'Resort',
      price: 12500,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.8,
      images: [
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400' }
      ]
    }
  ];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API first
        try {
          console.log('Fetching listings from API with filter:', activeFilter);
          const filters = {};
          
          if (activeFilter !== 'all') {
            // Map filter names to cities for API filtering
            filters.city = activeFilter;
          }
          
          filters.limit = 50; // Get more listings
          
          const { listings: apiListings } = await fetchListingsFromAPI(filters);
          console.log('API listings loaded:', apiListings.length);
          
          if (apiListings.length > 0) {
            setListings(apiListings);
          } else {
            // No API listings, use mock data
            const mockListings = await fetchAllListings();
            const filtered = filterListingsByType(mockListings, activeFilter);
            console.log('Using mock data:', filtered.length);
            setListings(filtered);
          }
          
        } catch (apiError) {
          console.warn('API failed, using mock data:', apiError.message);
          // Fallback to mock data
          const mockListings = await fetchAllListings();
          const filtered = filterListingsByType(mockListings, activeFilter);
          setListings(filtered);
          setError('Using demo data - connecting to database...');
        }
        
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeFilter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(12)].map((_, index) => (
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

  if (error) {
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
      {filteredListings.length >= 9 && (
        <div className="text-center mt-8">
          <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Continue exploring
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;