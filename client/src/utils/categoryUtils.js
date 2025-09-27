// City categories configuration for Indian destinations
export const CITY_CATEGORIES = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    cities: ['Mumbai'],
    icon: '🏙️',
    description: 'India\'s commercial capital and Bollywood hub'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    cities: ['Delhi', 'New Delhi'],
    icon: '🕌',
    description: 'Historic capital with rich Mughal heritage'
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    cities: ['Bangalore'],
    icon: '�',
    description: 'Silicon Valley of India with pleasant weather'
  },
  {
    id: 'mysore',
    name: 'Mysore',
    cities: ['Mysore'],
    icon: '�',
    description: 'Royal city famous for palaces and silk'
  },
  {
    id: 'goa',
    name: 'Goa',
    cities: ['Goa'],
    icon: '�️',
    description: 'Beach paradise with Portuguese charm'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    cities: ['Jaipur'],
    icon: '�️',
    description: 'Pink City with magnificent forts and palaces'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    cities: ['Hyderabad'],
    icon: '💎',
    description: 'City of pearls and biryani delights'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    cities: ['Chennai'],
    icon: '�',
    description: 'Cultural capital of South India with beautiful beaches'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    cities: ['Kolkata'],
    icon: '📚',
    description: 'City of joy with rich literary heritage'
  }
];

// Fetch all listings from API with error handling
export const fetchAllListings = async () => {
  try {
    const response = await fetch('/api/listings');
    if (response.ok) {
      const data = await response.json();
      console.log('[fetchAllListings] API Response:', data?.listings?.length || 0, 'listings');
      return data.listings || [];
    }
    console.warn('[fetchAllListings] API failed, using mock data');
    return getMockListings();
  } catch (error) {
    console.error('[fetchAllListings] Error:', error);
    return getMockListings();
  }
};

// Filter listings by property type or city
export const filterListingsByType = (listings, filterType) => {
  if (!listings || !Array.isArray(listings)) {
    return [];
  }
  
  if (filterType === 'all') {
    return listings;
  }
  
  // Check if it's a city filter
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Mysore', 'Hyderabad', 'Jaipur', 'Goa', 'Dehradun', 'Kolkata', 'Lucknow', 'Chennai'];
  if (cities.includes(filterType)) {
    return listings.filter(listing => 
      listing.location && listing.location.city && 
      listing.location.city.toLowerCase() === filterType.toLowerCase()
    );
  }
  
  // Otherwise filter by property type
  return listings.filter(listing => listing.propertyType === filterType);
};

// Group listings by city
export const getListingsByCategory = (listings) => {
  const categorizedListings = {};
  
  CITY_CATEGORIES.forEach(category => {
    categorizedListings[category.id] = [];
  });

  listings.forEach(listing => {
    const matchingCategory = CITY_CATEGORIES.find(category => 
      category.cities.some(city => {
        // Handle both object and string location formats
        if (listing.location?.city) {
          // Object format: { city: "Mumbai", state: "Maharashtra", ... }
          return listing.location.city.toLowerCase().includes(city.toLowerCase());
        } else if (typeof listing.location === 'string') {
          // String format: "Mumbai, India"
          return listing.location.toLowerCase().includes(city.toLowerCase());
        }
        return false;
      })
    );
    
    if (matchingCategory) {
      categorizedListings[matchingCategory.id].push(listing);
    }
  });

  return categorizedListings;
};

export const getCategoryListings = (listings, categoryId, limit = null) => {
  const allListings = getListingsByCategory(listings);
  const categoryListings = allListings[categoryId] || [];
  
  return limit ? categoryListings.slice(0, limit) : categoryListings;
};

export const getCategoryInfo = (categoryId) => {
  return CITY_CATEGORIES.find(category => category.id === categoryId);
};

export const getFeaturedListings = (listings, perCategory = null) => {
  const allListings = getListingsByCategory(listings);
  
  return CITY_CATEGORIES.map(category => ({
    ...category,
    listings: perCategory ? allListings[category.id].slice(0, perCategory) : allListings[category.id]
  })).filter(category => category.listings.length > 0);
};

// Mock data that matches our city categories
export const getMockListings = () => [
  {
    _id: "villa_goa",
    title: "Luxury Beachfront Villa",
    description: "A stunning beachfront villa with panoramic ocean views, private pool, and direct beach access. Perfect for luxury getaways.",
    location: { city: "Goa", state: "Goa", country: "India" },
    propertyType: "Villa",
    price: 15000,
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    ratingsAverage: 4.8,
    ratingsQuantity: 127,
    images: [{ url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" }],
    amenities: ["WiFi", "Pool", "Beach Access", "Full Kitchen", "Garden", "Parking", "BBQ Area", "Air Conditioning"],
    isAvailable: true
  },
  {
    _id: "resort_bangalore",
    title: "Garden City Luxury Resort",
    description: "Experience tranquility in India's Silicon Valley. Premium amenities with lush gardens and modern facilities.",
    location: { city: "Bangalore", state: "Karnataka", country: "India" },
    propertyType: "Resort",
    price: 12000,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    ratingsAverage: 4.6,
    ratingsQuantity: 89,
    images: [{ url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800" }],
    amenities: ["WiFi", "Spa", "Restaurant", "Garden", "Pool", "Room Service", "Gym", "Conference Room"],
    isAvailable: true
  },
  {
    _id: "hotel_mumbai",
    title: "Mumbai Business Hotel",
    description: "Modern business hotel in India's commercial capital with excellent connectivity and premium amenities.",
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    propertyType: "Hotel",
    price: 8500,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    ratingsAverage: 4.4,
    ratingsQuantity: 234,
    images: [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" }],
    amenities: ["WiFi", "Business Center", "Restaurant", "Room Service", "Gym", "Conference Room", "Airport Shuttle", "Laundry"],
    isAvailable: true
  },
  {
    _id: "hotel_delhi",
    title: "Heritage Delhi Hotel",
    description: "Experience Delhi's rich heritage in this elegant hotel near major monuments and cultural sites.",
    location: { city: "Delhi", state: "Delhi", country: "India" },
    propertyType: "Hotel",
    price: 4500,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    ratingsAverage: 4.2,
    ratingsQuantity: 156,
    images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800" }],
    amenities: ["WiFi", "Restaurant", "Heritage Tours", "Parking", "Air Conditioning", "Room Service", "Cultural Shows", "Metro Access"],
    isAvailable: true
  },
  {
    _id: "palace_jaipur",
    title: "Royal Palace Hotel Jaipur",
    description: "Stay like royalty in this magnificent palace hotel featuring traditional Rajasthani architecture and luxury amenities.",
    location: { city: "Jaipur", state: "Rajasthan", country: "India" },
    propertyType: "Hotel",
    price: 9500,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    ratingsAverage: 4.7,
    ratingsQuantity: 98,
    images: [{ url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800" }],
    amenities: ["WiFi", "Royal Architecture", "Traditional Cuisine", "Spa", "Palace Tours", "Cultural Shows", "Luxury Suites", "Heritage Experience"],
    isAvailable: true
  },
  {
    _id: "heritage_mysore",
    title: "Mysore Palace View Hotel",
    description: "Elegant hotel with stunning views of the famous Mysore Palace. Experience royal heritage and South Indian hospitality.",
    location: { city: "Mysore", state: "Karnataka", country: "India" },
    propertyType: "Hotel",
    price: 6500,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    ratingsAverage: 4.5,
    ratingsQuantity: 143,
    images: [{ url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800" }],
    amenities: ["WiFi", "Palace Views", "South Indian Cuisine", "Silk Shopping", "Cultural Tours", "Yoga Center", "Garden", "Traditional Decor"],
    isAvailable: true
  },
  {
    _id: "tech_hyderabad",
    title: "Hyderabad Tech City Hotel",
    description: "Modern business hotel in Hyderabad's IT corridor. Perfect for tech professionals and business travelers.",
    location: { city: "Hyderabad", state: "Telangana", country: "India" },
    propertyType: "Hotel",
    price: 7200,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    ratingsAverage: 4.3,
    ratingsQuantity: 201,
    images: [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" }],
    amenities: ["High-Speed WiFi", "Business Center", "IT Park Shuttle", "Biryani Restaurant", "Conference Rooms", "Tech Facilities", "Modern Amenities", "Airport Connectivity"],
    isAvailable: true
  },
  // Additional listings with string location format for compatibility
  {
    _id: "hotel_chennai",
    title: "Chennai Marina Beach Hotel",
    description: "Beachfront hotel with stunning views of Marina Beach and traditional South Indian hospitality.",
    location: "Chennai, India",
    propertyType: "Hotel",
    price: 5800,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 3,
    ratingsAverage: 4.4,
    ratingsQuantity: 87,
    images: [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" }],
    amenities: ["WiFi", "Beach Views", "South Indian Cuisine", "Cultural Tours", "Swimming Pool", "Spa", "Restaurant"],
    isAvailable: true
  },
  {
    _id: "heritage_kolkata",
    title: "Kolkata Heritage Mansion",
    description: "Colonial-era mansion converted into luxury hotel in the heart of cultural Kolkata.",
    location: "Kolkata, India", 
    propertyType: "Hotel",
    price: 4200,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    ratingsAverage: 4.6,
    ratingsQuantity: 156,
    images: [{ url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800" }],
    amenities: ["WiFi", "Heritage Architecture", "Bengali Cuisine", "Cultural Shows", "Library", "Art Gallery", "Traditional Decor"],
    isAvailable: true
  }
];

export default {
  CITY_CATEGORIES,
  fetchAllListings,
  filterListingsByType,
  getListingsByCategory,
  getCategoryListings,
  getCategoryInfo,
  getFeaturedListings,
  getMockListings
};