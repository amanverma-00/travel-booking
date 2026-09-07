const API_BASE_URL = '/api';

// Fetch all listings from API
export const fetchListingsFromAPI = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.minGuests) queryParams.append('minGuests', filters.minGuests);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`${API_BASE_URL}/listings?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        listings: data.data,
        pagination: data.pagination
      };
    } else {
      throw new Error(data.error || 'Failed to fetch listings');
    }
  } catch (error) {
    console.error('Error fetching listings from API:', error);
    throw error;
  }
};

// Fetch single listing by ID from API
export const fetchListingByIdFromAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Listing not found');
      }
      throw new Error(`Failed to fetch listing: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to fetch listing');
    }
  } catch (error) {
    console.error('Error fetching listing from API:', error);
    throw error;
  }
};

// Fetch all listings and group by property type (for category view)
export const fetchAllListingsGrouped = async () => {
  try {
    const { listings } = await fetchListingsFromAPI({ limit: 100 }); // Get more listings for grouping
    
    // Group listings by property type
    const grouped = listings.reduce((acc, listing) => {
      const type = listing.propertyType || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(listing);
      return acc;
    }, {});

    return grouped;
  } catch (error) {
    console.error('Error fetching grouped listings:', error);
    throw error;
  }
};

// Get featured listings for each city
export const getFeaturedListingsFromAPI = async (limit = 5) => {
  try {
    // First, get ALL listings to see what we have
    console.log('Fetching all listings from API...');
    const { listings: allListings } = await fetchListingsFromAPI({ limit: 500 });
    
    console.log(`Found ${allListings.length} total listings`);
    
    if (allListings.length === 0) {
      console.warn('No listings found at all');
      return [];
    }
    
    // Group listings by city (case-insensitive)
    const listingsByCity = {};
    allListings.forEach(listing => {
      const city = listing.location?.city || 'other';
      const cityKey = city.toLowerCase();
      if (!listingsByCity[cityKey]) {
        listingsByCity[cityKey] = [];
      }
      listingsByCity[cityKey].push(listing);
    });
    
    console.log('Listings grouped by city:', Object.keys(listingsByCity).map(city => 
      `${city}: ${listingsByCity[city].length}`
    ));
    
    // Create featured categories from actual data, focusing on top cities
    const featuredCategories = [];
    
    // Sort cities by listing count and take the top ones
    const cityEntries = Object.entries(listingsByCity).sort((a, b) => b[1].length - a[1].length);
    const topCities = cityEntries.slice(0, 9); // Top 9 cities
    
    topCities.forEach(([city, cityListings]) => {
      if (cityListings.length > 0 && city !== 'other') {
        const cityName = cityListings[0]?.location?.city || (city.charAt(0).toUpperCase() + city.slice(1));
        featuredCategories.push({
          id: city.toLowerCase(),
          name: cityName,
          type: cityName,
          cities: [city], // Add for backward compatibility
          listings: cityListings.slice(0, Math.min(limit, 6)), // Limit per category for preview
          totalCount: cityListings.length, // Real total count in database for this area
          description: getCityDescription(cityName)
        });
      }
    });

    console.log(`Created ${featuredCategories.length} featured categories`);
    
    // If no categories were created, create a fallback "All Listings" category
    if (featuredCategories.length === 0 && allListings.length > 0) {
      console.log('No categories created, adding fallback category');
      featuredCategories.push({
        id: 'all',
        name: 'All Listings',
        type: 'all',
        types: ['all'],
        listings: allListings.slice(0, Math.min(limit * 5, 30)),
        description: 'All available accommodations'
      });
    }

    return featuredCategories;
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    throw error;
  }
};

// Helper function to get city descriptions
const getCityDescription = (city) => {
  const descriptions = {
    'Mumbai': 'India\'s commercial capital and Bollywood hub',
    'Delhi': 'Historic capital with rich Mughal heritage',
    'Bangalore': 'Silicon Valley of India with pleasant weather',
    'Mysore': 'Royal city famous for palaces and silk',
    'Hyderabad': 'City of pearls and biryani delights',
    'Chennai': 'Cultural capital of South India with beautiful beaches',
    'Kolkata': 'City of joy with rich literary heritage',
    'Jaipur': 'Pink City with magnificent forts and palaces',
    'Goa': 'Beach paradise with Portuguese charm',
    'Pune': 'Cultural and educational hub of Maharashtra',
    'Ahmedabad': 'Textile city with rich Gujarati heritage',
    'Surat': 'Diamond and textile capital of India'
  };
  return descriptions[city] || `Discover amazing stays in ${city}`;
};

// Helper function to get property type descriptions
const getPropertyTypeDescription = (type) => {
  const descriptions = {
    'Hotel': 'Premium hotels with exceptional service and amenities',
    'Resort': 'All-inclusive resorts for the ultimate vacation experience',
    'Villa': 'Luxurious villas with private pools and stunning views',
    'Apartment': 'Modern apartments in prime city locations',
    'Cottage': 'Charming cottages perfect for romantic getaways',
    'Hostel': 'Budget-friendly hostels for backpackers and solo travelers',
    'Guesthouse': 'Cozy guesthouses with personalized local hospitality'
  };
  return descriptions[type] || 'Unique accommodations for memorable stays';
};